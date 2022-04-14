import { useEffect, useState } from "react";
import format from "date-fns/format";
import formatCurrency from "../../utils-server/formatCurrency";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { ChevronUpIcon } from "@heroicons/react/outline";

import { Disclosure, Tab } from "@headlessui/react";

import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import axios from "axios";
import PlayVideo from "./PlayVideo";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const SingleCourseView = ({ course, user, dispatch, router }) => {
    const [playVideoOpen, setPlayVideoOpen] = useState(false);
    const [previewLesson, setPreviewLesson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(false);

    const handlePaidEnrollment = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post("/api/user/courses/enroll", {
                course_id: course._id,
            });
            if (data.success === true) {
                const stripe = await loadStripe(
                    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                );

                if (data.success === true) {
                    stripe.redirectToCheckout({
                        sessionId: `${data.session_id}`,
                    });
                } else {
                    toast.warning("Couldn't purchase the course");
                }
            } else {
                setLoading(false);
                toast.warning("Couldn't purchase the course");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
    };

    const handleFreeEnrollment = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post("/api/user/courses/enroll", {
                course_id: course._id,
            });
            if (data.success === true) {
                await dispatch({
                    type: "COURSE_ADDITION",
                    payload: { courses: data.user.courses },
                });
                toast.success("Enrolled successfully");
                setLoading(false);
                router.push(`/user/course/${course.slug}`);
            } else {
                setLoading(false);
                toast.warning("Couldn't enroll in the course");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
    };

    const handleCourseEnrollment = async () => {
        if (
            course.paid === true
                ? handlePaidEnrollment()
                : handleFreeEnrollment()
        );
    };

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                const { data } = await axios.get(
                    `/api/user/courses/check-enrollment/${course.slug}`
                );
                if (data.success === true) {
                    setEnrolled(data.enrolled);
                } else {
                    toast.warning("Couldn't check enrollment");
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
        };
        if (user !== null) checkEnrollment();
    }, [course, enrolled, user]);

    return (
        <>
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 lg:items-start">
                        {/* Image gallery */}
                        <div>
                            <Tab.Group
                                as="div"
                                className="flex flex-col-reverse"
                            >
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
                                        {course.sections.length > 0 &&
                                        course.sections[0].lessons[0] &&
                                        course.sections[0].lessons[0]
                                            .content ? (
                                            <div
                                                className="preview"
                                                onClick={() => {
                                                    if (user !== null) {
                                                        setPreviewLesson(
                                                            course.sections[0]
                                                                .lessons[0]
                                                        );
                                                        setPlayVideoOpen(true);
                                                    } else {
                                                        toast.warning(
                                                            "Please log in"
                                                        );
                                                    }
                                                }}
                                            >
                                                <div className="thumbnail">
                                                    <img
                                                        src={
                                                            course.thumbnail
                                                                .location
                                                        }
                                                        alt={"Course Thumbnail"}
                                                        className="object-center object-cover sm:rounded-lg w-[320px] h-[180px]"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            course.thumbnail && (
                                                <>
                                                    <img
                                                        src={
                                                            course.thumbnail
                                                                .location
                                                        }
                                                        alt={"Course Thumbnail"}
                                                        className="object-center object-cover sm:rounded-lg w-[320px] h-[180px]"
                                                    />
                                                </>
                                            )
                                        )}
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                            <div className="mt-10 flex sm:flex-col1">
                                {user ? (
                                    enrolled === true ? (
                                        <button
                                            type="button"
                                            className="max-w-xs flex-1 bg-brand-dark border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                            onClick={() => {
                                                router.push(
                                                    `/user/course/${course.slug}`
                                                );
                                            }}
                                            disabled={loading}
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
                                                <span>Go to the dashboard</span>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="max-w-xs flex-1 bg-brand-dark border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                            onClick={handleCourseEnrollment}
                                            disabled={loading}
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
                                                <>
                                                    {course.paid ? (
                                                        <span>Buy</span>
                                                    ) : (
                                                        <span>Enroll</span>
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    )
                                ) : (
                                    <button
                                        type="button"
                                        className="max-w-xs flex-1 bg-brand-dark border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                        onClick={() => {
                                            router.push("/user/login");
                                        }}
                                    >
                                        Login to buy
                                    </button>
                                )}
                            </div>
                        </div>

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
                                                        Lessons
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                        {course &&
                                                            course.lesson_count}
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
            <div className="w-full px-4 lg:w-3/4 mx-auto">
                <div className="flex flex-row justify-between mt-16">
                    <div>
                        <h2 className="text-xl leading-6 font-medium text-gray-900">
                            Course Sections
                        </h2>
                    </div>
                    <div className="text-purple-900 font-medium">
                        <p>
                            Sections:{" "}
                            {course.sections && course.sections.length}
                        </p>
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
                                                                (
                                                                    lesson,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        className="bg-brand-bg_light"
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                                            <div className="flex flex-row justify-between">
                                                                                <span
                                                                                    className="hover:cursor-pointer"
                                                                                    onClick={() => {}}
                                                                                >
                                                                                    {index +
                                                                                        1 +
                                                                                        ". "}
                                                                                    {
                                                                                        lesson.title
                                                                                    }
                                                                                </span>
                                                                                {lesson.for_preview && (
                                                                                    <div className="">
                                                                                        <span
                                                                                            className="h-5 w-5 text-brand-super_dark hover:text-brand cursor-pointer"
                                                                                            aria-hidden="true"
                                                                                            onClick={() => {
                                                                                                if (
                                                                                                    user !==
                                                                                                    null
                                                                                                ) {
                                                                                                    setPreviewLesson(
                                                                                                        lesson
                                                                                                    );
                                                                                                    setPlayVideoOpen(
                                                                                                        true
                                                                                                    );
                                                                                                } else {
                                                                                                    toast.warning(
                                                                                                        "Please log in"
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Preview
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
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
            </div>

            <Transition.Root show={playVideoOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    onClose={setPlayVideoOpen}
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
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-4xl sm:p-6">
                                <div>
                                    <div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-brand-super_dark"
                                        >
                                            Course Preview
                                        </Dialog.Title>
                                        <div>
                                            <PlayVideo lesson={previewLesson} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-dark text-base font-medium text-white hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={() => setPlayVideoOpen(false)}
                                    >
                                        Go back
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

export default SingleCourseView;
