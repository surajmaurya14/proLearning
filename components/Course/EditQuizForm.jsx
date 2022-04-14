import { useState, useEffect, Fragment } from "react";
import ReactQuillComponent from "../ReactQuillComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const EditQuizForm = ({
    course,
    editContent,
    editContentIndex,
    setEditQuizOpen,
    sections,
    setSections,
}) => {
    const [title, setTitle] = useState(editContent.title);
    const [description, setDescription] = useState(editContent.description);
    const [loading, setLoading] = useState(false);
    const [loadingContent, setLoadingContent] = useState([]);
    const [section, setSection] = useState(
        sections[editContentIndex.sectionIndex]
    );
    const [value, setValue] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);

    const Add = () => {
        const newVal = [...value];
        newVal[questionIndex]["option"] = [
            ...newVal[questionIndex].option,
            { answer: "", isCorrect: false },
        ];
        setValue(newVal);
    };

    const handleQues = (e) => {
        const Ques = [...value];
        Ques[questionIndex]["question"] = e.target.value;
        setValue(Ques);
    };

    const handleAns = (e, i) => {
        const Val = [...value];
        Val[questionIndex]["option"][i]["answer"] = e.target.value;
        setValue(Val);
    };

    const handleR = (i, e) => {
        const Val = [...value];
        Val[questionIndex]["option"][i]["isCorrect"] = e.target.checked;
        setValue(Val);
    };

    const removeAns = (i) => {
        const Val = [...value];
        Val[questionIndex]["option"].splice(i, 1);
        setValue(Val);
    };

    const deleteQues = () => {
        const Val = [...value];
        Val.splice(questionIndex, 1);
        setValue(Val);
        setQuestionIndex(questionIndex !== 0 ? questionIndex - 1 : 0);
    };

    const New = () => {
        if (questionIndex + 1 == value.length) {
            setValue([
                ...value,
                {
                    question: "",
                    option: [
                        { answer: "", isCorrect: false },
                        { answer: "", isCorrect: false },
                    ],
                },
            ]);
        }
        setQuestionIndex(questionIndex + 1);
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
                    setValue(data.content);
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await axios.put(
                "/api/instructor/course/sections/lessons",
                {
                    title,
                    description,
                    content_type: "Quiz",
                    content: value,
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
                setEditQuizOpen(false);
            } else {
                toast.warning("Couldn't modify lesson");
                setLoading(false);
                return;
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
                    {/* Quiz section */}
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                        <div>
                            <h2 className="text-lg leading-6 font-medium text-gray-900">
                                Type: Quiz
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Please provide relavant options for quiz.
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

                            <div className="w-full lg:w-4/6">
                                <Listbox value={section} onChange={setSection}>
                                    {({ open }) => (
                                        <>
                                            <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                                Section
                                            </Listbox.Label>
                                            <div className="mt-1 relative">
                                                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                    <span className="block truncate">
                                                        {section.title}
                                                    </span>
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                        <SelectorIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>

                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                        {course.sections &&
                                                            course.sections.map(
                                                                (
                                                                    singleSection,
                                                                    index
                                                                ) => (
                                                                    <Listbox.Option
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            classNames(
                                                                                active
                                                                                    ? "text-white bg-brand-dark"
                                                                                    : "text-gray-900",
                                                                                "cursor-default select-none relative py-2 pl-3 pr-9"
                                                                            )
                                                                        }
                                                                        value={
                                                                            singleSection
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                <span
                                                                                    className={classNames(
                                                                                        selected
                                                                                            ? "font-semibold"
                                                                                            : "font-normal",
                                                                                        "block truncate"
                                                                                    )}
                                                                                >
                                                                                    {index +
                                                                                        1 +
                                                                                        ". " +
                                                                                        singleSection.title}
                                                                                </span>

                                                                                {selected ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                            active
                                                                                                ? "text-white"
                                                                                                : "text-indigo-600",
                                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                        )}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className="h-5 w-5"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                )
                                                            )}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </>
                                    )}
                                </Listbox>
                            </div>

                            <div className="w-full">
                                <label
                                    htmlFor="quiz"
                                    className="block text-sm font-medium text-brand-super_dark"
                                >
                                    Quiz
                                </label>
                                <div className="quiz my-4">
                                    <p className="font-semibold text-lg">
                                        Question {questionIndex + 1}/
                                        {value.length}
                                    </p>
                                    <div>
                                        <div className="my-4 flex justify-start">
                                            <input
                                                onChange={handleQues}
                                                className="w-full mr-4 px-2 border-2 border-black text-lg"
                                                value={
                                                    value[questionIndex]
                                                        .question
                                                }
                                                placeholder="Question"
                                            />
                                            <button
                                                onClick={deleteQues}
                                                disabled={
                                                    value.length === 1
                                                        ? true
                                                        : false
                                                }
                                                className="px-4 py-2 text-white bg-red-600 disabled:bg-red-800 font-bold rounded-md"
                                                type="button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        {value[questionIndex].option.map(
                                            (data, i) => (
                                                <div
                                                    key={i}
                                                    className="my-2 p-2 border-4 rounded-2xl w-full border-sky-600 flex justify-start"
                                                >
                                                    <input
                                                        onChange={(e) =>
                                                            handleR(i, e)
                                                        }
                                                        className="self-center h-4 w-4 mr-4"
                                                        type="checkbox"
                                                        checked={data.isCorrect}
                                                    />
                                                    <input
                                                        onChange={(e) =>
                                                            handleAns(e, i)
                                                        }
                                                        className="w-full outline-none text-md"
                                                        value={data.answer}
                                                        placeholder="Answer"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeAns(i)
                                                        }
                                                    >
                                                        <svg
                                                            className="w-8 h-8 self-center mx-4"
                                                            fill="red"
                                                            stroke="white"
                                                            viewBox="0 0 24 24"
                                                            // xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            )
                                        )}
                                        <div className="grid mt-2">
                                            <button
                                                onClick={Add}
                                                className="mr-4 px-4 py-2 text-white bg-red-600 font-bold rounded-md justify-self-end"
                                                type="button"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-24 grid grid-cols-3 gap-3">
                                        <button
                                            className="px-4 py-2 text-white bg-green-600  font-bold disabled:bg-green-800 rounded-md"
                                            disabled={
                                                questionIndex == 0
                                                    ? true
                                                    : false
                                            }
                                            onClick={() =>
                                                setQuestionIndex(
                                                    questionIndex - 1
                                                )
                                            }
                                            type="button"
                                        >
                                            Prev
                                        </button>

                                        <button
                                            className="px-4 py-2 bg-green-600 text-white font-bold rounded-md"
                                            onClick={New}
                                            type="button"
                                        >
                                            {questionIndex + 1 == value.length
                                                ? "New"
                                                : "Next"}
                                        </button>
                                    </div>
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
export default EditQuizForm;
