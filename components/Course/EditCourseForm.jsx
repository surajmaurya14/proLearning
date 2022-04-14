import { Draggable, DragDropContext, Droppable } from "react-beautiful-dnd";
import { Fragment } from "react";
import { Switch } from "@headlessui/react";
import { Listbox, Transition } from "@headlessui/react";
import ReactQuillComponent from "../ReactQuillComponent";
import { Disclosure } from "@headlessui/react";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Resizer from "react-image-file-resizer";

import {
    CheckIcon,
    SelectorIcon,
    XCircleIcon,
    ChevronUpIcon,
    PlusSmIcon as PlusSmIconOutline,
    TrashIcon,
} from "@heroicons/react/solid";

import EditVideoForm from "./EditVideoForm";
import EditCodingQuestionForm from "./Coding Question/EditCodingQuestionForm";
import EditSectionForm from "./EditSectionForm";
import EditNotesForm from "./EditNotesForm";
import { Dialog } from "@headlessui/react";
import EditQuizForm from "./EditQuizForm";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const languageData = require("../../data-sets/language");
const categoryData = require("../../data-sets/category");
const currencyData = require("../../data-sets/currency");

const levelData = ["Beginner", "Intermediate", "Expert", "All Levels"];

const EditCourseForm = ({ router, slug, course, setCourse }) => {
    const [course_title, setCourseTitle] = useState(course.title);
    const [course_subtitle, setCourseSubtitle] = useState(course.subtitle);
    const [course_description, setCourseDescription] = useState(
        course.description
    );
    const [course_objectives, setCourseObjective] = useState(course.objectives);
    const [course_requirements, setCourseRequirement] = useState(
        course.requirements
    );
    const [paid, setPaid] = useState(course.paid);
    const [price, setPrice] = useState(course.price);
    const [currency_type, setCurrencyType] = useState(currencyData[25]);

    const [access_to_domain, setAccessToDomain] = useState(
        course.domain_restriction
    );

    const [domain, setDomain] = useState(course.domain);
    const [image_data, setImageData] = useState(course.thumbnail);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(course.thumbnail.location);
    const [category, setCategory] = useState(categoryData[0]);
    const [language, setLanguage] = useState(languageData[37]);
    const [level, setLevel] = useState(levelData[3]);

    const [sections, setSections] = useState(course.sections);

    const [editVideoOpen, setEditVideoOpen] = useState(false);
    const [editCodingQuestionOpen, setEditCodingQuestionOpen] = useState(false);
    const [editNotesOpen, setEditNotesOpen] = useState(false);
    const [editQuizOpen, setEditQuizOpen] = useState(false);

    const [editContent, setEditContent] = useState({});
    const [editContentIndex, setEditContentIndex] = useState(null);
    const [editSectionOpen, setEditSectionOpen] = useState(false);
    const [editSectionContent, setEditSectionContent] = useState(null);
    const [editSectionContentIndex, setEditSectionContentIndex] = useState(0);

    const handleObjectiveChange = (e, index) => {
        const objectiveList = [...course_objectives];
        objectiveList[index] = e.target.value;
        setCourseObjective(objectiveList);
    };

    const handleObjectiveRemove = (index) => {
        const objectiveList = [...course_objectives];
        objectiveList.splice(index, 1);
        setCourseObjective(objectiveList);
    };

    const handleObjectiveAdd = () => {
        setCourseObjective([...course_objectives, ""]);
    };

    const handleRequirementChange = (e, index) => {
        const requirementList = [...course_requirements];
        requirementList[index] = e.target.value;
        setCourseRequirement(requirementList);
    };

    const handleRequirementRemove = (index) => {
        const requirementList = [...course_requirements];
        requirementList.splice(index, 1);
        setCourseRequirement(requirementList);
    };

    const handleRequirementAdd = () => {
        setCourseRequirement([...course_requirements, ""]);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            Resizer.imageFileResizer(
                file, // Is the file of the image which will resized.
                1280, // Is the maxWidth of the resized new image.
                720, // Is the maxHeight of the resized new image.
                "JPEG", // Is the compressFormat of the resized new image.
                100, // Is the quality of the resized new image.
                0, // Is the degree of clockwise rotation to apply to uploaded image.
                async (uri) => {
                    try {
                        let { data } = await axios.post(
                            "/api/instructor/course/upload-image",
                            {
                                image: uri,
                            }
                        );
                        if (data.success === true) {
                            toast.success("Image Uploaded");
                            setImageData(data.about);
                        } else {
                            toast.error("Couldn't upload image");
                        }
                        setUploading(false);
                    } catch (err) {
                        // console.error(`Error: ${err}`);
                        toast.error("Error");
                        setUploading(false);
                        return;
                    }
                }, // Is the callBack function of the resized new image URI.
                "base64", // Is the output type of the resized new image.
                "200", // Is the minWidth of the resized new image.
                "200" // Is the minHeight of the resized new image.
            );
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const handleImageRemove = async (req, res) => {
        try {
            setUploading(true);
            const { data } = await axios.post(
                "/api/instructor/course/delete-image",
                {
                    image_data,
                }
            );
            if (data.success) {
                setImagePreview("");
                setImageData({});
                setUploading(false);
                toast.success("Video deleted successfully.");
            } else {
                setUploading(false);
                toast.warning(`data.message`);
                return;
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            setUploading(false);
            toast.error("Error");
            return;
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data } = await axios.put("/api/instructor/course", {
                title: course_title,
                subtitle: course_subtitle,
                description: course_description,
                objectives: course_objectives,
                requirements: course_requirements,
                category,
                language,
                level,
                domain_restriction: access_to_domain,
                domain,
                paid,
                price,
                thumbnail: image_data,
                sections: sections,
                currency_type,
                course_id: course._id,
            });
            if (data.success === true) {
                toast.success("Course updated");
                setLoading(false);
                router.push("/instructor");
            } else {
                toast.warning(`Couldn't update course: ${data.message}`);
                setLoading(false);
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
        }
    };

    const handleSectionDelete = async (sectionId, sectionIndex) => {
        try {
            const confirmation = confirm(
                "Are you sure you want to remove this section?"
            );
            if (!confirmation) {
                return;
            }
            const listCopy = [...sections];
            listCopy.splice(sectionIndex, 1);
            const { data } = await axios.put(
                "/api/instructor/course/sections/remove",
                {
                    section_id: sectionId,
                    section_index: sectionIndex,
                    course_id: course._id,
                }
            );
            if (data.success === true) {
                toast.success("Section removed");
                setSections(listCopy);
            } else {
                toast.warning(`Couldn't remove section: ${data.message}`);
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const handleLessonDelete = async (
        sectionId,
        lessonId,
        contentId,
        sectionIndex,
        lessonIndex
    ) => {
        try {
            const confirmation = confirm(
                "Are you sure you want to remove this lesson?"
            );
            if (!confirmation) {
                return;
            }
            const listCopy = [...sections];
            listCopy[sectionIndex].lessons.splice(lessonIndex, 1);

            const { data } = await axios.put(
                "/api/instructor/course/sections/lessons/remove",
                {
                    section_id: sectionId,
                    lesson_id: lessonId,
                    content_id: contentId,
                    section_index: sectionIndex,
                    lesson_index: lessonIndex,
                    course_id: course._id,
                }
            );
            if (data.success === true) {
                toast.success("Lesson removed");
                setSections(listCopy);
            } else {
                toast.warning(`Couldn't remove lesson: ${data.message}`);
            }
        } catch (err) {
            console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const listCopy = [...sections];

        let index = listCopy.findIndex(
            (section) => section._id === result.source.droppableId
        );
        const removedElement = listCopy[index].lessons.splice(
            result.source.index,
            1
        );

        index = listCopy.findIndex(
            (section) => section._id === result.destination.droppableId
        );
        listCopy[index].lessons.splice(
            result.destination.index,
            0,
            removedElement[0]
        );

        setSections(listCopy);
    };

    return (
        <>
            <form className="" onSubmit={handleFormSubmit}>
                {/* Course section */}
                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                    <div>
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Course Details
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Please fill correct details for each fields to have
                            a successful course creation.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col items-start space-y-8">
                        <div className="w-full lg:w-4/6">
                            <label
                                htmlFor="course_title"
                                className="block text-sm font-medium text-brand-super_dark"
                            >
                                Title of your Course
                            </label>
                            <input
                                type="text"
                                name="course_title"
                                id="course_title"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                value={course_title}
                                onChange={(e) => {
                                    setCourseTitle(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-full lg:w-4/6">
                            <label
                                htmlFor="course_subtitle"
                                className="block text-sm font-medium text-brand-super_dark"
                            >
                                Sub-title of your Course
                            </label>

                            <input
                                type="text"
                                name="course_subtitle"
                                id="course_subtitle"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                value={course_subtitle}
                                onChange={(e) => {
                                    setCourseSubtitle(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-full lg:w-4/6">
                            <label
                                htmlFor="course_description"
                                className="block text-sm font-medium text-brand-super_dark"
                            >
                                Description of your Course
                            </label>

                            <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                                <ReactQuillComponent
                                    value={course_description}
                                    setValue={setCourseDescription}
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-4/6">
                            <label
                                htmlFor="course_objective"
                                className="block text-sm font-medium text-brand-super_dark"
                            >
                                Objectives of your Course.
                            </label>
                            {course_objectives &&
                                course_objectives.map(
                                    (singleObjective, index) => (
                                        <div key={index} className="objectives">
                                            <div className="first-division">
                                                <input
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                                    name="course_objective"
                                                    type="text"
                                                    value={singleObjective}
                                                    onChange={(e) =>
                                                        handleObjectiveChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    required
                                                />
                                                {course_objectives.length !==
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleObjectiveRemove(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <span className="block text-sm font-medium text-brand-dark">
                                                            Remove
                                                        </span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="second-division">
                                                {course_objectives.length -
                                                    1 ===
                                                    index &&
                                                    course_objectives.length <
                                                        4 && (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleObjectiveAdd
                                                            }
                                                            className="mt-4 p-3 border border-transparent rounded-full shadow-sm text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            <PlusSmIconOutline
                                                                className="h-4 w-4"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>

                        <div className="w-full lg:w-4/6">
                            <label
                                htmlFor="course_requirement"
                                className="block text-sm font-medium text-brand-super_dark"
                            >
                                Requirements of your Course.
                            </label>
                            {course_requirements &&
                                course_requirements.map(
                                    (singleRequirement, index) => (
                                        <div
                                            key={index}
                                            className="requirements"
                                        >
                                            <div className="first-division">
                                                <input
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                                    name="course_requirement"
                                                    type="text"
                                                    value={singleRequirement}
                                                    onChange={(e) =>
                                                        handleRequirementChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    required
                                                />
                                                {course_requirements.length !==
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRequirementRemove(
                                                                index
                                                            )
                                                        }
                                                        className=""
                                                    >
                                                        <span className="block text-sm font-medium text-brand-dark">
                                                            Remove
                                                        </span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="second-division">
                                                {course_requirements.length -
                                                    1 ===
                                                    index &&
                                                    course_requirements.length <
                                                        4 && (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleRequirementAdd
                                                            }
                                                            className="mt-4 p-3 border border-transparent rounded-full shadow-sm text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            <PlusSmIconOutline
                                                                className="h-4 w-4"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>

                        <div className="w-full lg:w-4/6">
                            <Listbox value={category} onChange={setCategory}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                            Category of your Course
                                        </Listbox.Label>
                                        <div className="mt-1 relative">
                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <span className="block truncate">
                                                    {category}
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
                                                    {categoryData.map(
                                                        (
                                                            typeOfCategory,
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
                                                                    typeOfCategory
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
                                                                            {
                                                                                typeOfCategory
                                                                            }
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

                        <div className="w-full lg:w-4/6">
                            <Listbox value={language} onChange={setLanguage}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                            Language of your Course
                                        </Listbox.Label>
                                        <div className="mt-1 relative">
                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <span className="block truncate">
                                                    {language.English}
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
                                                    {languageData.map(
                                                        (
                                                            typeOfLanguage,
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
                                                                    typeOfLanguage
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
                                                                            {
                                                                                typeOfLanguage.English
                                                                            }
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

                        <div className="w-full lg:w-4/6">
                            <Listbox value={level} onChange={setLevel}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                            {" "}
                                            Level of your Course
                                        </Listbox.Label>
                                        <div className="mt-1 relative">
                                            <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <span className="block truncate">
                                                    {level}
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
                                                    {levelData.map(
                                                        (
                                                            typeOfLevel,
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
                                                                    typeOfLevel
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
                                                                            {
                                                                                typeOfLevel
                                                                            }
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

                        <div className="w-full lg:w-4/6">
                            <Switch.Group
                                as="div"
                                className="flex items-center justify-between"
                            >
                                <span className="flex-grow flex flex-col">
                                    <Switch.Label
                                        as="span"
                                        className="text-sm font-medium text-brand-super_dark"
                                        passive
                                    >
                                        Availability to your institution only?
                                    </Switch.Label>
                                    <Switch.Description
                                        as="span"
                                        className="text-sm text-gray-500"
                                    >
                                        Turn on only if you want your course to
                                        be accessibe to only your institution
                                        students. You need to have a
                                        institutional email address.
                                    </Switch.Description>
                                </span>
                                <Switch
                                    checked={access_to_domain}
                                    onChange={() => {
                                        if (domainValue === "") {
                                            return;
                                        } else {
                                            setAccessToDomain(true);
                                        }
                                    }}
                                    className={classNames(
                                        access_to_domain
                                            ? "bg-brand-dark"
                                            : "bg-gray-200",
                                        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={classNames(
                                            access_to_domain
                                                ? "translate-x-5"
                                                : "translate-x-0",
                                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                        )}
                                    />
                                </Switch>
                            </Switch.Group>
                        </div>
                        {access_to_domain && (
                            <>
                                <div className="w-full lg:w-4/6">
                                    <label
                                        htmlFor="domain"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Domain of your college
                                    </label>
                                    <input
                                        type="text"
                                        name="domain"
                                        id="domain"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-brand-extra_light"
                                        placeholder="Institutional email address mandatory"
                                        value={domain}
                                        onChange={(e) => {
                                            setDomain(e.target.value);
                                        }}
                                        disabled
                                    />
                                </div>
                            </>
                        )}

                        <div className="w-full lg:w-4/6">
                            <Switch.Group
                                as="div"
                                className="flex items-center justify-between"
                            >
                                <span className="flex-grow flex flex-col">
                                    <Switch.Label
                                        as="span"
                                        className="text-sm font-medium text-brand-super_dark"
                                        passive
                                    >
                                        Want to charge certain amount for your
                                        course?
                                    </Switch.Label>
                                    <Switch.Description
                                        as="span"
                                        className="text-sm text-gray-500"
                                    >
                                        Turn on only if you want your course to
                                        be paid. 50% of taxed amount is given to
                                        instructors for each purchase.
                                    </Switch.Description>
                                </span>
                                <Switch
                                    checked={paid}
                                    onChange={setPaid}
                                    className={classNames(
                                        paid ? "bg-brand-dark" : "bg-gray-200",
                                        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={classNames(
                                            paid
                                                ? "translate-x-5"
                                                : "translate-x-0",
                                            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                        )}
                                    />
                                </Switch>
                            </Switch.Group>
                        </div>
                        {paid && (
                            <>
                                <div className="w-full lg:w-4/6">
                                    <label
                                        htmlFor="price"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Price
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                ₹
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            id="price"
                                            min={199}
                                            max={9999}
                                            step={10}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="0.00"
                                            required
                                            value={price}
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                            }}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center">
                                            <label
                                                htmlFor="currency"
                                                className="sr-only"
                                            >
                                                Currency
                                            </label>
                                            <select
                                                id="currency"
                                                disabled
                                                name="currency"
                                                className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                            >
                                                <option selected>INR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="w-full lg:w-4/6">
                            <label
                                htmlFor="course_thumbnail"
                                className="block text-sm font-medium text-brand-super_dark"
                            >
                                Thumbnail of your course
                            </label>
                            <input
                                type="file"
                                name="course_thumbnail"
                                id="course_thumbnail"
                                className="mt-1 mb-4 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                onChange={handleImageUpload}
                                accept={"image/*"}
                            />

                            {imagePreview && (
                                <>
                                    <div className="ml-80">
                                        <XCircleIcon
                                            className="h-5 w-5 text-red-400"
                                            aria-hidden="true"
                                            onClick={handleImageRemove}
                                        />
                                    </div>
                                    <img
                                        className="inline-block rounded-md w-[320px] h-[180px]"
                                        id="course_thumbnail_selected"
                                        src={imagePreview}
                                        alt=""
                                    />
                                </>
                            )}
                            {uploading && (
                                <>
                                    <svg
                                        className="animate-spin h-8 w-8 text-black"
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
                                </>
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
            <div className="flex flex-row justify-between  mt-8  ">
                <div>
                    <h2 className="text-xl leading-6 font-medium text-gray-900">
                        Course Sections
                    </h2>
                </div>
                <div className="text-purple-900 font-medium">
                    <p>Sections: {sections && sections.length}</p>
                </div>
            </div>

            <div className="w-full px-4 py-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                        <ul>
                            {sections &&
                                sections.map((section, sectionIndex) => (
                                    <Disclosure key={section._id}>
                                        {({ open }) => (
                                            <li>
                                                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-brand-extra_light hover:bg-brand-extra_light focus:outline-none focus-visible:ring focus-visible:ring-brand-dark focus-visible:ring-opacity-75">
                                                    <span
                                                        onClick={(e) => {
                                                            setEditSectionOpen(
                                                                true
                                                            );
                                                            setEditSectionContent(
                                                                section
                                                            );
                                                            setEditSectionContentIndex(
                                                                sectionIndex
                                                            );
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        {sectionIndex +
                                                            1 +
                                                            ". "}
                                                        {section.title}
                                                    </span>
                                                    <div className="flex flex-row space-x-4">
                                                        <p className="text-brand">
                                                            {section.lessons &&
                                                                (section.lessons
                                                                    .length ===
                                                                    1 ||
                                                                section.lessons
                                                                    .length ===
                                                                    0
                                                                    ? section
                                                                          .lessons
                                                                          .length +
                                                                      " lesson"
                                                                    : section
                                                                          .lessons
                                                                          .length +
                                                                      " lessons")}
                                                        </p>
                                                        <div className="flex flex-row justify-between">
                                                            <TrashIcon
                                                                className="h-5 w-5 text-red-400 cursor-pointer"
                                                                aria-hidden="true"
                                                                onClick={() => {
                                                                    handleSectionDelete(
                                                                        section._id,
                                                                        sectionIndex
                                                                    );
                                                                }}
                                                            />
                                                            <ChevronUpIcon
                                                                className={`${
                                                                    open
                                                                        ? "transform rotate-180"
                                                                        : ""
                                                                } w-5 h-5 text-purple-500`}
                                                            />
                                                        </div>
                                                    </div>
                                                </Disclosure.Button>
                                                <Droppable
                                                    droppableId={`${section._id}`}
                                                >
                                                    {(provided) => (
                                                        <ul
                                                            {...provided.droppableProps}
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                        >
                                                            {section.lessons &&
                                                                section.lessons.map(
                                                                    (
                                                                        item,
                                                                        lessonIndex
                                                                    ) => (
                                                                        <Draggable
                                                                            draggableId={
                                                                                item._id
                                                                            }
                                                                            key={
                                                                                item._id
                                                                            }
                                                                            index={
                                                                                lessonIndex
                                                                            }
                                                                        >
                                                                            {(
                                                                                provided,
                                                                                snapshot
                                                                            ) => (
                                                                                <li
                                                                                    className="bg-brand-bg_light"
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    snapshot={
                                                                                        snapshot
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                >
                                                                                    <>
                                                                                        <Disclosure.Panel
                                                                                            className="px-4 pt-4 pb-2 text-sm text-gray-500"
                                                                                            key={
                                                                                                item._id
                                                                                            }
                                                                                        >
                                                                                            <div className="flex flex-row justify-between">
                                                                                                <span
                                                                                                    className="hover:cursor-pointer"
                                                                                                    onClick={() => {
                                                                                                        const contentType =
                                                                                                            item.content_type;
                                                                                                        switch (
                                                                                                            contentType
                                                                                                        ) {
                                                                                                            case "Video": {
                                                                                                                setEditContent(
                                                                                                                    item
                                                                                                                );
                                                                                                                setEditContentIndex(
                                                                                                                    {
                                                                                                                        sectionIndex,
                                                                                                                        lessonIndex,
                                                                                                                    }
                                                                                                                );
                                                                                                                setEditVideoOpen(
                                                                                                                    true
                                                                                                                );
                                                                                                                break;
                                                                                                            }
                                                                                                            case "Coding Question": {
                                                                                                                setEditContent(
                                                                                                                    item
                                                                                                                );
                                                                                                                setEditContentIndex(
                                                                                                                    {
                                                                                                                        sectionIndex,
                                                                                                                        lessonIndex,
                                                                                                                    }
                                                                                                                );
                                                                                                                setEditCodingQuestionOpen(
                                                                                                                    true
                                                                                                                );
                                                                                                                break;
                                                                                                            }
                                                                                                            case "Quiz": {
                                                                                                                setEditContent(
                                                                                                                    item
                                                                                                                );
                                                                                                                setEditContentIndex(
                                                                                                                    {
                                                                                                                        sectionIndex,
                                                                                                                        lessonIndex,
                                                                                                                    }
                                                                                                                );
                                                                                                                setEditQuizOpen(
                                                                                                                    true
                                                                                                                );
                                                                                                                break;
                                                                                                            }
                                                                                                            case "Notes": {
                                                                                                                setEditContent(
                                                                                                                    item
                                                                                                                );
                                                                                                                setEditContentIndex(
                                                                                                                    {
                                                                                                                        sectionIndex,
                                                                                                                        lessonIndex,
                                                                                                                    }
                                                                                                                );
                                                                                                                setEditNotesOpen(
                                                                                                                    true
                                                                                                                );
                                                                                                                break;
                                                                                                            }
                                                                                                            default: {
                                                                                                                break;
                                                                                                            }
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    {lessonIndex +
                                                                                                        1 +
                                                                                                        ". "}
                                                                                                    {
                                                                                                        item.title
                                                                                                    }
                                                                                                </span>
                                                                                                <div className="">
                                                                                                    <TrashIcon
                                                                                                        className="h-5 w-5 text-red-400 cursor-pointer"
                                                                                                        aria-hidden="true"
                                                                                                        onClick={() => {
                                                                                                            handleLessonDelete(
                                                                                                                section._id,
                                                                                                                item._id,
                                                                                                                item.content,
                                                                                                                sectionIndex,
                                                                                                                lessonIndex
                                                                                                            );
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </Disclosure.Panel>
                                                                                    </>
                                                                                </li>
                                                                            )}
                                                                        </Draggable>
                                                                    )
                                                                )}
                                                            {
                                                                provided.placeholder
                                                            }
                                                        </ul>
                                                    )}
                                                </Droppable>
                                            </li>
                                        )}
                                    </Disclosure>
                                ))}
                        </ul>
                    </div>
                </DragDropContext>
            </div>
            <Transition.Root show={editSectionOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setEditSectionOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-brand-super_dark"
                                        >
                                            Section Modification
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <EditSectionForm
                                                course={course}
                                                editSectionContent={
                                                    editSectionContent
                                                }
                                                setEditSectionOpen={
                                                    setEditSectionOpen
                                                }
                                                editSectionContentIndex={
                                                    editSectionContentIndex
                                                }
                                                sections={sections}
                                                setSections={setSections}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() =>
                                            setEditSectionOpen(false)
                                        }
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <Transition.Root show={editVideoOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setEditVideoOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-brand-super_dark"
                                        >
                                            Lesson Modification
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <EditVideoForm
                                                course={course}
                                                sections={sections}
                                                setSections={setSections}
                                                setEditVideoOpen={
                                                    setEditVideoOpen
                                                }
                                                editContent={editContent}
                                                editContentIndex={
                                                    editContentIndex
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setEditVideoOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={editQuizOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setEditQuizOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-brand-super_dark"
                                        >
                                            Lesson Modification
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <EditQuizForm
                                                course={course}
                                                sections={sections}
                                                setSections={setSections}
                                                setCourse={setCourse}
                                                slug={slug}
                                                setEditQuizOpen={
                                                    setEditQuizOpen
                                                }
                                                editContent={editContent}
                                                editContentIndex={
                                                    editContentIndex
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setEditQuizOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={editNotesOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setEditNotesOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-brand-super_dark"
                                        >
                                            Lesson Modification
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <EditNotesForm
                                                course={course}
                                                sections={sections}
                                                setSections={setSections}
                                                setEditNotesOpen={
                                                    setEditNotesOpen
                                                }
                                                editContent={editContent}
                                                editContentIndex={
                                                    editContentIndex
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setEditNotesOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <Transition.Root show={editCodingQuestionOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setEditCodingQuestionOpen}
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-brand-super_dark"
                                        >
                                            Lesson Modification
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <EditCodingQuestionForm
                                                course={course}
                                                sections={sections}
                                                setSections={setSections}
                                                setEditCodingQuestionOpen={
                                                    setEditCodingQuestionOpen
                                                }
                                                editContent={editContent}
                                                editContentIndex={
                                                    editContentIndex
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() =>
                                            setEditCodingQuestionOpen(false)
                                        }
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};

export default EditCourseForm;
