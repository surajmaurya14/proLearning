import { useState } from "react";
import ReactQuillComponent from "../ReactQuillComponent";
import axios from "axios";
import { toast } from "react-toastify";

const EditSectionForm = ({
    course,
    editSectionContent,
    editSectionContentIndex,
    setEditSectionOpen,
    sections,
    setSections,
}) => {
    const [title, setTitle] = useState(editSectionContent.title);
    const [description, setDescription] = useState(
        editSectionContent.description
    );
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put(
                "/api/instructor/course/sections",
                {
                    title,
                    description,
                    course_id: course._id,
                    section_id: editSectionContent._id,
                }
            );
            if (data.success === true) {
                setLoading(true);
                const listCopy = [...sections];
                listCopy[editSectionContentIndex].title = title;
                listCopy[editSectionContentIndex].description = description;
                setSections(listCopy);
                setLoading(false);
                toast.success("Section Modified");
                setEditSectionOpen(false);
            } else {
                setLoading(false);
                toast.error("Couldn't create section");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
        e.preventDefault();
    };

    return (
        <form
            className="divide-y divide-gray-200 lg:col-span-9"
            onSubmit={handleFormSubmit}
        >
            {/* Section Creation */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Type: Section
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Please write meaningful title for section with respect
                        to content.
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-start space-y-4">
                    <div className="w-full">
                        <label
                            htmlFor="section-title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            name="section-title"
                            id="section-title"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <label
                            htmlFor="section-description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <div id="section-description">
                            <ReactQuillComponent
                                value={description}
                                setValue={setDescription}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-6 divide-y divide-gray-200">
                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                    <button
                        type="submit"
                        className="ml-5 bg-brand-dark border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                // xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <span>Save</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};
export default EditSectionForm;
