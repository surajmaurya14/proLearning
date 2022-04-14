import { useState, useEffect, Fragment } from "react";
import ReactQuillComponent from "../../ReactQuillComponent";
import axios from "axios";
import { toast } from "react-toastify";
import TestcasesIO from "./TestCasesIO";

const EditCodingQuestionForm = ({
    course,
    editContent,
    editContentIndex,
    setEditCodingQuestionOpen,
    sections,
    setSections,
}) => {
    const [title, setTitle] = useState(editContent.title);
    const [description, setDescription] = useState(editContent.description);
    const [examples, setExamples] = useState("");
    const [constraints, setConstraints] = useState("");
    const [ioValues, setIoValues] = useState([{ input: "", output: "" }]);
    const [loading, setLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const [section, setSection] = useState(
        sections[editContentIndex.sectionIndex]
    );

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoadingContent(true);
                const { data } = await axios.post(
                    `/api/instructor/course/fetch-content`,
                    { content_id: editContent.content, course_id: course._id }
                );
                if (data.success === true) {
                    setExamples(data.content.examples);
                    setConstraints(data.content.constraints);
                    setIoValues(data.content.testcases);
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
    }, [editContent, course._id]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (title == "") {
                alert("Required, Add title for question");
            } else if (description < 20) {
                alert("Required, Add description minimum length 20 characters");
            } else if (examples < 2) {
                alert("Required, Add atleast Example");
            } else if (constraints < 10) {
                alert("Required, Add minimum required Constraints");
            } else if (ioValues.length < 2) {
                alert("Required, Add atleast 2 testcases");
            } else {
                const { data } = await axios.put(
                    "/api/instructor/course/sections/lessons",
                    {
                        title,
                        description,
                        content_type: "Coding Question",
                        content: {
                            examples: examples,
                            constraints: constraints,
                            testcases: ioValues,
                        },
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
                    setEditCodingQuestionOpen(false);
                } else {
                    toast.error("Couldn't modify lesson");
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
    };

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
                    {/* Coding Question Creation */}
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                        <div>
                            <h2 className="text-lg leading-6 font-medium text-gray-900">
                                Type: Coding Question
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Please provide detailed questions with well
                                defined test cases.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col items-start space-y-4">
                            <div className="w-full">
                                <label
                                    htmlFor="lesson-title"
                                    className="block text-sm font-medium text-brand-super_dark"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="lesson-title"
                                    id="lesson-title"
                                    required
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
                                    className="block text-sm font-medium text-brand-super_dark"
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

                            <div className="w-full">
                                <label
                                    htmlFor="lesson-examples"
                                    className="block text-sm font-medium text-brand-super_dark"
                                >
                                    Examples
                                </label>
                                <div id="lesson-examples">
                                    <ReactQuillComponent
                                        value={examples}
                                        setValue={setExamples}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="lesson-constraints"
                                    className="block text-sm font-medium text-brand-super_dark"
                                >
                                    Constraints
                                </label>
                                <div id="lesson-constraints">
                                    <ReactQuillComponent
                                        value={constraints}
                                        setValue={setConstraints}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <label
                                    htmlFor="lesson-ioValues"
                                    className="block text-sm font-medium text-brand-super_dark"
                                >
                                    Input output values
                                </label>
                                <div id="lesson-ioValues">
                                    <TestcasesIO
                                        ioValues={ioValues}
                                        setIoValues={setIoValues}
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
            )}
        </>
    );
};
export default EditCodingQuestionForm;
