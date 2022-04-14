import { useEffect, useState } from "react";
import ReactQuillComponent from "../ReactQuillComponent";
import axios from "axios";
import { toast } from "react-toastify";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

const EditNotesForm = ({
    course,
    editContent,
    editContentIndex,
    setEditNotesOpen,
    sections,
    setSections,
}) => {
    const [title, setTitle] = useState(editContent.title);
    const [description, setDescription] = useState(editContent.description);
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const [uploading_started, setUploadingStarted] = useState(false);
    const [progress_bar, setProgressBar] = useState(0);
    const [section, setSection] = useState(
        sections[editContentIndex.sectionIndex]
    );

    const handleNotesUpload = async (e) => {
        e.preventDefault();
        setUploadingStarted(true);
        const notesFile = e.target.files[0];
        try {
            const dataToBeSent = new FormData();
            dataToBeSent.append("notes", notesFile);
            dataToBeSent.append("course_id", course._id);
            const { data } = await axios.post(
                "/api/instructor/course/upload-notes",
                dataToBeSent,
                {
                    onUploadProgress: (e) => {
                        setProgressBar(
                            Math.floor((e.loaded * 100.0) / e.total)
                        );
                    },
                }
            );
            if (data.success === true) {
                setContent(data.about);
                toast.success("Notes uploaded");
            } else {
                setUploadingStarted(false);
                toast.warning(`data.message`);
                return;
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setUploadingStarted(false);
            return;
        }
    };
    const handleNotesRemove = async () => {
        try {
            const { data } = await axios.post(
                "/api/instructor/course/delete-file",
                {
                    ...content,
                    course_id: course._id,
                }
            );

            if (data.success) {
                setContent(null);
                setUploadingStarted(false);
                setProgressBar(0);
                toast.success("Notes deleted successfully.");
            } else {
                setUploadingStarted(false);
                toast.warning(`data.message`);
                return;
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setUploadingStarted(false);
            return;
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put(
                "/api/instructor/course/sections/lessons",
                {
                    title,
                    description,
                    content_type: "Notes",
                    content,
                    course_id: course._id,
                    section_id: section._id,
                    lesson_id: editContent._id,
                    content_id: editContent.content,
                }
            );
            if (data.success === true) {
                const listCopy = [...sections];
                listCopy[editContentIndex.sectionIndex].lessons[
                    editContentIndex.lessonIndex
                ].title = title;
                listCopy[editContentIndex.sectionIndex].lessons[
                    editContentIndex.lessonIndex
                ].description = description;

                listCopy[editContentIndex.sectionIndex].lessons[
                    editContentIndex.lessonIndex
                ].content = editContent.content;

                setSections(listCopy);
                setLoading(false);

                toast.success("Lesson Modified");
                setEditNotesOpen(false);
            } else {
                setLoading(false);
                toast.warning("Couldn't edit lesson");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoadingContent(true);
                const { data } = await axios.post(
                    `/api/instructor/course/fetch-content`,
                    { content_id: editContent.content, course_id: course._id }
                );
                if (data.success === true) {
                    setContent(data.content);
                    setLoadingContent(false);
                } else {
                    setLoadingContent(false);
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoadingContent(false);
                return;
            }
        };
        fetchContent();
    }, [editContent.content, course._id]);

    return (
        <>
            {loadingContent ? (
                <svg
                    className="animate-spin text-black h-24 w-24 mx-auto"
                    // xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    width={100}
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
                <form
                    className="divide-y divide-gray-200 lg:col-span-9"
                    onSubmit={handleFormSubmit}
                >
                    {/* Notes section */}
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                        <div>
                            <h2 className="text-lg leading-6 font-medium text-gray-900">
                                Type: Notes
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Please upload well maintained PDF notes.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col items-start space-y-4">
                            <div className="w-full">
                                <label
                                    htmlFor="lesson-title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="lesson-title"
                                    id="lesson-title"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="lesson-description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <div id="lesson-description">
                                    <ReactQuillComponent
                                        value={description}
                                        setValue={setDescription}
                                    />
                                </div>
                            </div>

                            <div className="w-full lg:w-4/6">
                                <label
                                    htmlFor="notes"
                                    className="block text-sm font-medium text-brand-super_dark"
                                >
                                    Notes File
                                </label>
                                <div className="flex flex-row">
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="file"
                                            name="notes"
                                            id="notes"
                                            required={content ? false : true}
                                            className="mt-1 mb-4 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                            onChange={handleNotesUpload}
                                            accept={"application/pdf"}
                                        />
                                    </div>
                                </div>

                                {uploading_started && (
                                    <div>
                                        <h4 className="sr-only">Status</h4>

                                        <div
                                            className="mt-6 bg-gray-200 rounded-full overflow-hidden"
                                            aria-hidden="true"
                                        >
                                            <div
                                                className="h-2 bg-brand-dark rounded-full"
                                                style={{
                                                    width: { progress_bar },
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {progress_bar === 100 && (
                                    <div>
                                        <CheckCircleIcon
                                            className="flex-shrink-0 mr-1.5 mt-2 h-5 w-5 text-green-400"
                                            aria-hidden="true"
                                        />
                                    </div>
                                )}
                                {!uploading_started &&
                                    content &&
                                    content.location && (
                                        <div className="flex flex-row">
                                            <div>
                                                <iframe
                                                    src={content.location}
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                            {((!uploading_started &&
                                                content !== null) ||
                                                progress_bar === 100) && (
                                                <div className="-mt-4">
                                                    <XCircleIcon
                                                        className="h-5 w-5 text-red-400"
                                                        aria-hidden="true"
                                                        onClick={
                                                            handleNotesRemove
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
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
            )}
        </>
    );
};
export default EditNotesForm;
