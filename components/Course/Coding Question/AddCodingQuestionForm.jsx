import { useState, Fragment } from "react";
import ReactQuillComponent from "../../ReactQuillComponent";
import axios from "axios";
import { toast } from "react-toastify";
import { Listbox, Transition } from "@headlessui/react";
import TestcasesIO from "./TestCasesIO";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const AddCodingQuestionForm = ({
    course,
    setCourse,
    setAddCodingQuestionOpen,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [examples, setExamples] = useState("");
    const [constraints, setConstraints] = useState("");
    const [ioValues, setIoValues] = useState([{ input: "", output: "" }]);
    const [loading, setLoading] = useState(false);
    const [section, setSection] = useState(
        course.sections && course.sections[0]
    );

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
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
                const { data } = await axios.post(
                    "/api/instructor/course/sections/lessons",
                    {
                        title: title,
                        description: description,
                        content_type: "Coding Question",
                        content: {
                            examples: examples,
                            constraints: constraints,
                            testcases: ioValues,
                        },
                        course_id: course._id,
                        section_id: section._id,
                    }
                );
                if (data.success === true) {
                    setLoading(false);
                    setCourse(data.course);
                    toast.success("Lesson Created");
                    setAddCodingQuestionOpen(false);
                } else {
                    setLoading(false);
                    toast.error("Couldn't create lesson");
                }
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
            {/* Coding Question Creation */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Type: Coding Question
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Please provide detailed questions with well defined test
                        cases.
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
                                                                key={index}
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
    );
};
export default AddCodingQuestionForm;
