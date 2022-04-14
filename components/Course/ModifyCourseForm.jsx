import { useState } from "react";
import format from "date-fns/format";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import formatCurrency from "../../utils-server/formatCurrency";
import {
    ChevronUpIcon,
    PlusCircleIcon,
    PencilAltIcon,
    AcademicCapIcon,
    ArchiveIcon,
    UsersIcon,
} from "@heroicons/react/outline";

import { Disclosure, Tab } from "@headlessui/react";

import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import AddVideoForm from "./AddVideoForm";
import AddSectionForm from "./AddSectionForm";
import { toast } from "react-toastify";
import axios from "axios";
import { RefreshIcon } from "@heroicons/react/solid";
import AddCodingQuestionForm from "./Coding Question/AddCodingQuestionForm";
import AddNotesForm from "./AddNotesForm";
import AddQuizForm from "./AddQuizForm";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const ModifyCourseForm = ({
    user,
    course,
    setCourse,
    slug,
    router,
    studentsCount,
}) => {
    const [addVideoOpen, setAddVideoOpen] = useState(false);
    const [addSectionOpen, setAddSectionOpen] = useState(false);
    const [addQuizOpen, setAddQuizOpen] = useState(false);
    const [addNotesOpen, setAddNotesOpen] = useState(false);
    const [addCodingQuestionOpen, setAddCodingQuestionOpen] = useState(false);

    const handlePublishCourse = async () => {
        try {
            const confirmation = confirm(
                "Are you sure you want to publish your course?"
            );
            if (!confirmation) {
                return;
            }
            const { data } = await axios.put("/api/instructor/course/status", {
                course_id: course._id,
                published: true,
            });
            if (data.success === true) {
                toast.success("Course is live now");
                setCourse(data.course);
            } else {
                toast.warning("Couldn't launch course");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };
    const handleUnpublishCourse = async () => {
        try {
            const confirmation = confirm(
                "Are you sure you want to unpublish your course?"
            );
            if (!confirmation) {
                return;
            }
            const { data } = await axios.put("/api/instructor/course/status", {
                course_id: course._id,
                published: false,
            });
            if (data.success === true) {
                toast.success("Course availability hidden");
                setCourse(data.course);
            } else {
                toast.warning("Couldn't change availability of the course");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };
    const updateStatus = async () => {
        try {
            const { data } = await axios.put(
                "/api/instructor/course/update-status",
                {
                    course_id: course._id,
                }
            );
            if (data.success === true) {
                toast.success("Updated status");
            } else {
                toast.warning("Couldn't update status");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    return (
        <>
            <div className="p-8">
                <div className="flex flex-row justify-between">
                    <div>
                        <h2 className="text-2xl leading-6 font-medium text-gray-900">
                            Course Information
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Modify the course according to your preferences.
                        </p>
                    </div>
                    <div className="flex flex-row space-x-4">
                        <div className="">
                            <div className="relative flex flex-col items-center group">
                                <PencilAltIcon
                                    className="h-5 w-5 lg:h-8 lg:w-8 text-red-700 cursor-pointer"
                                    aria-hidden="true"
                                    onClick={() => {
                                        router.push(
                                            `/instructor/course/edit/${slug}`
                                        );
                                    }}
                                />
                                <div className="absolute bottom-0 flex-col items-center hidden mb-8 group-hover:flex">
                                    <span className="relative z-10 p-2 text-sm lg:text-md leading-none  rounded-md text-white whitespace-no-wrap bg-black shadow-lg">
                                        Edit
                                    </span>
                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black" />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="relative flex flex-col items-center group">
                                <RefreshIcon
                                    className="h-5 w-5 lg:h-8 lg:w-8 text-green-700 cursor-pointer"
                                    aria-hidden="true"
                                    onClick={() => {
                                        updateStatus();
                                    }}
                                />
                                <div className="absolute bottom-0 flex-col items-center hidden mb-8 group-hover:flex">
                                    <span className="relative z-10 p-2 text-sm lg:text-md leading-none  rounded-md text-white whitespace-no-wrap bg-black shadow-lg">
                                        Update status
                                    </span>
                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black" />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="relative flex flex-col items-center group">
                                <UsersIcon
                                    className="h-5 w-5 lg:h-8 lg:w-8 text-brand-super_dark cursor-pointer"
                                    aria-hidden="true"
                                />
                                <div className="absolute bottom-0 flex-col items-center hidden mb-8 group-hover:flex">
                                    <span className="relative z-10 p-2 text-sm lg:text-md leading-none  rounded-md text-white whitespace-no-wrap bg-black shadow-lg">
                                        Enrolled: {studentsCount}
                                    </span>
                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black" />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="relative flex flex-col items-center group">
                                {course.published === false ? (
                                    <>
                                        <AcademicCapIcon
                                            className="h-5 w-5 lg:h-8 lg:w-8 text-yellow-400 cursor-pointer"
                                            aria-hidden="true"
                                            onClick={() => {
                                                handlePublishCourse();
                                            }}
                                        />
                                        <div className="absolute bottom-0 flex-col items-center hidden mb-8 group-hover:flex">
                                            <span className="relative z-10 p-2 text-sm lg:text-md leading-none  rounded-md text-white whitespace-no-wrap bg-black shadow-lg">
                                                Publish
                                            </span>
                                            <div className="w-3 h-3 -mt-2 rotate-45 bg-black" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ArchiveIcon
                                            className="h-5 w-5 lg:h-8 lg:w-8 text-gray-700 cursor-pointer"
                                            aria-hidden="true"
                                            onClick={() => {
                                                handleUnpublishCourse();
                                            }}
                                        />
                                        <div className="absolute bottom-0 flex-col items-center hidden mb-8 group-hover:flex">
                                            <span className="relative z-10 p-2 text-sm lg:text-md leading-none  rounded-md text-white whitespace-no-wrap bg-black shadow-lg">
                                                Unpublish
                                            </span>
                                            <div className="w-3 h-3 -mt-2 rotate-45 bg-black" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 lg:items-start">
                        {/* Image gallery */}
                        <Tab.Group as="div" className="flex flex-col-reverse">
                            {/* Image selector */}
                            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                <Tab.List className="grid grid-cols-4 gap-6">
                                    <Tab className="relative h-10 w-18 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50">
                                        {({ selected }) => (
                                            <>
                                                <span className="sr-only">
                                                    {"Course Thumbnail"}
                                                </span>
                                                <span className="absolute inset-0 rounded-md overflow-hidden">
                                                    {course.thumbnail && (
                                                        <>
                                                            <img
                                                                src={
                                                                    course
                                                                        .thumbnail
                                                                        .location
                                                                }
                                                                alt=""
                                                                className="object-center object-cover w-[320px] h-[180px]"
                                                            />
                                                        </>
                                                    )}
                                                </span>
                                                <span
                                                    className={classNames(
                                                        selected
                                                            ? "ring-indigo-500"
                                                            : "ring-transparent",
                                                        "absolute inset-0 rounded-md ring-1 ring-offset-1 pointer-events-none"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </>
                                        )}
                                    </Tab>
                                </Tab.List>
                            </div>

                            <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                                <Tab.Panel>
                                    {course.thumbnail && (
                                        <>
                                            <img
                                                src={course.thumbnail.location}
                                                alt={"Course Thumbnail"}
                                                className="object-center object-cover sm:rounded-lg w-[320px] h-[180px]"
                                            />
                                        </>
                                    )}
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>

                        {/* Course info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 col-span-2 space-y-4">
                            <h1 className="text-4xl font-extrabold tracking-tight text-brand-super_dark">
                                {course.title}
                            </h1>

                            <h6 className="text-lg tracking-tight text-brand-dark">
                                {course.subtitle}
                            </h6>

                            <div className="mt-3">
                                <h2 className="sr-only">Course information</h2>
                                <p className="text-3xl font-semibold text-brand-extra_dark">
                                    {course.paid ? (
                                        <span>
                                            {formatCurrency(
                                                course.price,
                                                course.currency_type
                                                    .AlphabeticCode
                                            )}
                                        </span>
                                    ) : (
                                        <span>Free</span>
                                    )}
                                </p>
                            </div>
                            <div className="bg-white sm:pb-16">
                                <div className="relative">
                                    <div className="absolute inset-0 h-1/2 bg-gray-50" />
                                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                                        <div className="max-w-4xl mx-auto">
                                            <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Level
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.level}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Domain Restriction
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.domain_restriction
                                                            ? course.domain
                                                            : "Availabe to Everyone"}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Category
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.category}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Language
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.language &&
                                                            course.language
                                                                .English}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Sections
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.sections &&
                                                            course.sections
                                                                .length}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Instructor
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.instructor &&
                                                            course.instructor
                                                                .first_name +
                                                                " " +
                                                                course
                                                                    .instructor
                                                                    .last_name}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Published
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.published
                                                            ? "Live"
                                                            : "Not Live"}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Created
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.createdAt && (
                                                            <>
                                                                <time
                                                                    dateTime={format(
                                                                        new Date(
                                                                            course.createdAt
                                                                        ),
                                                                        "d MMM, hh:mm a"
                                                                    )}
                                                                >
                                                                    {format(
                                                                        new Date(
                                                                            course.createdAt
                                                                        ),
                                                                        "d MMM, hh:mm a"
                                                                    )}
                                                                </time>
                                                            </>
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                        Last Update
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course.createdAt && (
                                                            <>
                                                                <time
                                                                    dateTime={format(
                                                                        new Date(
                                                                            course.updatedAt
                                                                        ),
                                                                        "d MMM, hh:mm a"
                                                                    )}
                                                                >
                                                                    {format(
                                                                        new Date(
                                                                            course.updatedAt
                                                                        ),
                                                                        "d MMM, hh:mm a"
                                                                    )}
                                                                </time>
                                                            </>
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>

                        <div
                            className="text-base text-gray-700 space-y-6"
                            dangerouslySetInnerHTML={{
                                __html: course.description,
                            }}
                        />
                    </div>

                    <section
                        aria-labelledby="details-heading"
                        className="mt-12"
                    >
                        <h2 id="details-heading" className="sr-only">
                            Additional details
                        </h2>

                        <div className="border-t divide-y divide-gray-200">
                            <Disclosure as="div">
                                {({ open }) => (
                                    <>
                                        <h3>
                                            <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                                                <span
                                                    className={classNames(
                                                        open
                                                            ? "text-brand"
                                                            : "text-brand-super_dark",
                                                        "text-sm font-medium"
                                                    )}
                                                >
                                                    {"Course Objectives"}
                                                </span>
                                                <span className="ml-6 flex items-center">
                                                    {open ? (
                                                        <MinusSmIcon
                                                            className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <PlusSmIcon
                                                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </h3>
                                        <Disclosure.Panel
                                            as="div"
                                            className="pb-6 prose prose-sm"
                                        >
                                            <ul role="list">
                                                {course.objectives &&
                                                    course.objectives.map(
                                                        (item, index) => (
                                                            <li key={item}>
                                                                <span>
                                                                    {index + 1}
                                                                    {". "}
                                                                </span>
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                            <Disclosure as="div">
                                {({ open }) => (
                                    <>
                                        <h3>
                                            <Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
                                                <span
                                                    className={classNames(
                                                        open
                                                            ? "text-brand"
                                                            : "text-brand-super_dark",
                                                        "text-sm font-medium"
                                                    )}
                                                >
                                                    {"Course Requirements"}
                                                </span>
                                                <span className="ml-6 flex items-center">
                                                    {open ? (
                                                        <MinusSmIcon
                                                            className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <PlusSmIcon
                                                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </h3>
                                        <Disclosure.Panel
                                            as="div"
                                            className="pb-6 prose prose-sm"
                                        >
                                            <ul role="list">
                                                {course.requirements &&
                                                    course.requirements.map(
                                                        (item, index) => (
                                                            <li key={item}>
                                                                <span>
                                                                    {index + 1}
                                                                    {". "}
                                                                </span>
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                            </ul>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        </div>
                    </section>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-4 px-4">
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                        setAddSectionOpen(true);
                    }}
                >
                    <PlusCircleIcon
                        className="-ml-1 mr-3 h-5 w-5"
                        aria-hidden="true"
                    />
                    Add Section
                </button>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                        if (course.sections && course.sections.length > 0)
                            setAddVideoOpen(true);
                        else toast.warning("Please create section first");
                    }}
                >
                    <PlusCircleIcon
                        className="-ml-1 mr-3 h-5 w-5"
                        aria-hidden="true"
                    />
                    Add Video
                </button>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                        if (course.sections && course.sections.length > 0)
                            setAddNotesOpen(true);
                        else toast.warning("Please create section first");
                    }}
                >
                    <PlusCircleIcon
                        className="-ml-1 mr-3 h-5 w-5"
                        aria-hidden="true"
                    />
                    Add Notes
                </button>

                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                        if (course.sections && course.sections.length > 0)
                            setAddQuizOpen(true);
                        else toast.warning("Please create section first");
                    }}
                >
                    <PlusCircleIcon
                        className="-ml-1 mr-3 h-5 w-5"
                        aria-hidden="true"
                    />
                    Add Quiz
                </button>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                        if (course.sections && course.sections.length > 0)
                            setAddCodingQuestionOpen(true);
                        else toast.warning("Please create section first");
                    }}
                >
                    <PlusCircleIcon
                        className="-ml-1 mr-3 h-5 w-5"
                        aria-hidden="true"
                    />
                    Add Coding Question
                </button>
            </div>

            <Transition.Root show={addVideoOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setAddVideoOpen}
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
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            Lesson Upload
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <AddVideoForm
                                                course={course}
                                                setCourse={setCourse}
                                                setAddVideoOpen={
                                                    setAddVideoOpen
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setAddVideoOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={addNotesOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setAddNotesOpen}
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
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            Lesson Upload
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <AddNotesForm
                                                course={course}
                                                setCourse={setCourse}
                                                setAddNotesOpen={
                                                    setAddNotesOpen
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setAddNotesOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={addQuizOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setAddQuizOpen}
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
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            Lesson Upload
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <AddQuizForm
                                                course={course}
                                                setCourse={setCourse}
                                                setAddQuizOpen={setAddQuizOpen}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setAddQuizOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={addCodingQuestionOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setAddCodingQuestionOpen}
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
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            Lesson Upload
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <AddCodingQuestionForm
                                                course={course}
                                                setCourse={setCourse}
                                                setAddCodingQuestionOpen={
                                                    setAddCodingQuestionOpen
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
                                            setAddCodingQuestionOpen(false)
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

            <Transition.Root show={addSectionOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setAddSectionOpen}
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
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            Section Creation
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <AddSectionForm
                                                course={course}
                                                setCourse={setCourse}
                                                setAddSectionOpen={
                                                    setAddSectionOpen
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setAddSectionOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className="flex flex-row justify-between mt-16">
                <div>
                    <h2 className="text-xl leading-6 font-medium text-gray-900">
                        Course Sections
                    </h2>
                </div>
                <div className="text-purple-900 font-medium">
                    <p>Sections: {course.sections && course.sections.length}</p>
                </div>
            </div>

            <div className="w-full px-4 py-4">
                <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                    <ul>
                        {course.sections &&
                            course.sections.map((section, index) => (
                                <li key={index}>
                                    <Disclosure>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-brand-extra_light hover:bg-brand-extra_light focus:outline-none focus-visible:ring focus-visible:ring-brand-dark focus-visible:ring-opacity-75">
                                                    <span>
                                                        {index + 1 + ". "}
                                                        {section.title}
                                                    </span>
                                                    <div className="flex flex-row space-x-4">
                                                        <p className="text-brand">
                                                            {section.lessons
                                                                .length === 1 ||
                                                            section.lessons
                                                                .length === 0
                                                                ? section
                                                                      .lessons
                                                                      .length +
                                                                  " lesson"
                                                                : section
                                                                      .lessons
                                                                      .length +
                                                                  " lessons"}
                                                        </p>
                                                        <ChevronUpIcon
                                                            className={`${
                                                                open
                                                                    ? "transform rotate-180"
                                                                    : ""
                                                            } w-5 h-5 text-purple-500`}
                                                        />
                                                    </div>
                                                </Disclosure.Button>
                                                <ul key={index}>
                                                    {section.lessons &&
                                                        section.lessons.map(
                                                            (lesson, index) => (
                                                                <li
                                                                    className="bg-brand-bg_light"
                                                                    key={index}
                                                                >
                                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                                        <span>
                                                                            {index +
                                                                                1 +
                                                                                ". "}
                                                                            {
                                                                                lesson.title
                                                                            }
                                                                        </span>
                                                                    </Disclosure.Panel>
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </>
                                        )}
                                    </Disclosure>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ModifyCourseForm;
