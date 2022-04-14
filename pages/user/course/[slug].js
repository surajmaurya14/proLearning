import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import UserRoute from "../../../components/Routes/UserRoute";
import CourseSidebar from "../../../components/Sidebars/CourseSidebar";
import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
    PlusSmIcon,
    MinusSmIcon,
    CheckIcon,
    XIcon,
    EyeIcon,
} from "@heroicons/react/outline";
import format from "date-fns/format";
import Footer from "../../../components/Footer";
import PlayVideo from "../../../components/Course/PlayVideo";
import CodeEditorQuestion from "../../../components/Course/Coding Question/CodeEditorQuestion";
import ShowNotes from "../../../components/Course/ShowNotes";
import ShowQuiz from "../../../components/Course/ShowQuiz";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const bottomNavbarItems = ["Overview", "About Course"];

const CourseDashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({});
    const [tab, setTab] = useState(null);
    const [navItem, setNavItem] = useState(bottomNavbarItems[0]);
    const [selectedSection, setSelectedSection] = useState(-1);
    const [selectedLesson, setSelectedLesson] = useState(-1);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [certificate, setCertificate] = useState(null);
    const slug = router.query.slug;

    const handleMarkLesson = async () => {
        try {
            const { data } = await axios.post(
                "/api/user/course/track/mark-lesson",
                {
                    course_id: course._id,
                    lesson_id: selectedLesson._id,
                }
            );
            if (data.success === true) {
                if (data.status === true) {
                    const listCopy = [...completedLessons, selectedLesson._id];
                    setCompletedLessons(listCopy);
                    toast.success("Marked as completed");
                } else {
                    const listCopy = [...completedLessons];
                    const index = listCopy.indexOf(selectedLesson._id);
                    if (index !== -1) {
                        listCopy.splice(index, 1);
                    }
                    setCompletedLessons(listCopy);
                    toast.success("Marked as pending");
                }
            } else {
                toast.warning("Couldn't mark as completed");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const handleGenerateCertificate = async () => {
        const generateCertificate = async () => {
            let completedPercentage =
                (completedLessons.length / course.lesson_count) * 100.0;

            if (completedPercentage > 90) {
                try {
                    const { data } = await axios.post(
                        "/api/user/course/track/certificate",
                        {
                            course_id: course._id,
                        }
                    );
                    if (data.success === true) {
                        setCertificate(data.certificate);
                        toast.success("Certificate generated");
                    }
                } catch (err) {
                    // console.error("Error");
                    toast.error("Error");
                    return;
                }
            } else {
                toast.warning("Please complete all lessons first");
            }
        };
        generateCertificate();
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const { data } = await axios.post(`/api/user/course/data`, {
                    slug: slug,
                });
                if (data.success === true) {
                    setCourse(data.course);
                    setLoading(false);
                } else {
                    toast.warning("Couldn't fetch course");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoading(false);
                return;
            }
        };
        if (slug !== undefined) fetchCourse();
    }, [slug]);
    useEffect(() => {
        if (router.query.section && router.query.lesson && course.sections) {
            setTab({
                section: router.query.section,
                lesson: router.query.lesson,
            });
            setSelectedSection(course.sections[router.query.section]);
            setSelectedLesson(
                course.sections[router.query.section].lessons[
                    router.query.lesson
                ]
            );
        }
    }, [router, course]);

    useEffect(() => {
        const fetchCompletedLessons = async () => {
            try {
                setLoading(true);
                const { data } = await axios.post(
                    "/api/user/course/track/completed-lessons",
                    {
                        course_id: course._id,
                    }
                );
                if (data.success === true) {
                    setCompletedLessons(data.completed_lessons);
                    if (data.certificate !== null)
                        setCertificate(data.certificate);
                    setLoading(false);
                } else {
                    toast.warning("Couldn't fetch course");
                    setLoading(false);
                    return;
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoading(false);
                return;
            }
        };
        if (slug !== undefined && course._id !== undefined)
            fetchCompletedLessons();
    }, [course, slug]);

    return (
        <UserRoute>
            <div className="flex flex-col lg:flex-row lg:fixed w-full">
                {loading ? (
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
                    <>
                        <div className="lg:w-4/6 bg-brand-50 lg:h-screen overflow-y-scroll">
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="p-4">
                                        <button
                                            className="text-xl px-4 font-bold"
                                            type="button"
                                            onClick={() => {
                                                router.push("/user");
                                            }}
                                        >
                                            {"❮"}
                                        </button>
                                        <span className="text-xl text-brand-dark font-medium ">
                                            {course.title}
                                        </span>
                                    </div>
                                    {completedLessons.length > 0 && (
                                        <div>
                                            {certificate === null ? (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center mx-4 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    onClick={
                                                        handleGenerateCertificate
                                                    }
                                                >
                                                    <EyeIcon
                                                        className="-ml-1 mr-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                    Generate Certificate
                                                </button>
                                            ) : (
                                                <a
                                                    className="inline-flex items-center mx-4 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    href={`/certificate/${certificate}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <EyeIcon
                                                        className="-ml-1 mr-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                    View Certificate
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedSection !== -1 &&
                                selectedLesson !== -1 ? (
                                    <>
                                        <div className="lesson-content">
                                            {selectedLesson.content_type ===
                                                "Video" && (
                                                <PlayVideo
                                                    lesson={selectedLesson}
                                                    handleMarkLesson={
                                                        handleMarkLesson
                                                    }
                                                    completedLessons={
                                                        completedLessons
                                                    }
                                                />
                                            )}
                                            {selectedLesson.content_type ===
                                                "Notes" && (
                                                <ShowNotes
                                                    lesson={selectedLesson}
                                                />
                                            )}
                                            {selectedLesson.content_type ===
                                                "Quiz" && (
                                                <ShowQuiz
                                                    lesson={selectedLesson}
                                                    handleMarkLesson={
                                                        handleMarkLesson
                                                    }
                                                    completedLessons={
                                                        completedLessons
                                                    }
                                                />
                                            )}
                                            {selectedLesson.content_type ===
                                                "Coding Question" && (
                                                <CodeEditorQuestion
                                                    lesson={selectedLesson}
                                                    course_id={course._id}
                                                />
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="course-thumbnail ">
                                        {course &&
                                            course.thumbnail &&
                                            course.thumbnail.location && (
                                                <img
                                                    src={
                                                        course.thumbnail
                                                            .location
                                                    }
                                                    alt={course.subtitle}
                                                    className="w-full"
                                                />
                                            )}
                                    </div>
                                )}
                            </div>

                            <div className="border-b border-gray-200 px-4">
                                <div className="flex flex-row justify-between items-center">
                                    <nav
                                        className="-mb-px flex space-x-2 lg:space-x-8"
                                        aria-label="Tabs"
                                    >
                                        {bottomNavbarItems.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className={classNames(
                                                        navItem === item
                                                            ? "border-indigo-500 text-indigo-600"
                                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
                                                    )}
                                                    aria-current={
                                                        navItem === item
                                                            ? "page"
                                                            : undefined
                                                    }
                                                    onClick={() => {
                                                        setNavItem(item);
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </nav>
                                    {selectedLesson !== -1 && (
                                        <div>
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-2 py-2 lg:px-3 border border-transparent shadow-sm text-sm leading-4 lg:font-medium rounded-md text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={handleMarkLesson}
                                            >
                                                {completedLessons.includes(
                                                    selectedLesson._id
                                                ) ? (
                                                    <>
                                                        <XIcon
                                                            className="-ml-1 mr-3 h-8 w-8"
                                                            aria-hidden="true"
                                                        />
                                                        <span>
                                                            Mark as pending
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckIcon
                                                            className="-ml-1 mr-3 h-8 w-8"
                                                            aria-hidden="true"
                                                        />
                                                        <span>
                                                            Mark as completed
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {navItem === "Overview" && (
                                <div className="about-section px-4 py-8">
                                    {/* Lesson info */}
                                    {selectedLesson != -1 &&
                                    selectedLesson.content_type !==
                                        "Coding Question" ? (
                                        <>
                                            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 col-span-2 space-y-4">
                                                <h1 className="text-4xl font-extrabold tracking-tight text-brand-super_dark">
                                                    {selectedLesson.title}
                                                </h1>
                                            </div>
                                            <div className="mt-6">
                                                <h3 className="text-brand-super_dark text-xl py-4">
                                                    Description
                                                </h3>

                                                <div
                                                    className="text-base text-gray-700 space-y-6"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedLesson.description,
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-md font-semibold tracking-tight text-brand-super_dark">
                                            Hi, we hope you are enjoying the
                                            course!
                                        </p>
                                    )}
                                </div>
                            )}
                            {navItem === "About Course" && (
                                <>
                                    <div className="about-section px-4 py-8">
                                        {/* Course info */}
                                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 col-span-2 space-y-4">
                                            <h1 className="text-4xl font-extrabold tracking-tight text-brand-super_dark">
                                                {course.title}
                                            </h1>

                                            <h6 className="text-lg tracking-tight text-brand-dark">
                                                {course.subtitle}
                                            </h6>

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
                                                                        {
                                                                            course.level
                                                                        }
                                                                    </dd>
                                                                </div>
                                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                                        Domain
                                                                        Restriction
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
                                                                        {
                                                                            course.category
                                                                        }
                                                                    </dd>
                                                                </div>
                                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                                        Language
                                                                    </dt>
                                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                                        {course.language &&
                                                                            course
                                                                                .language
                                                                                .English}
                                                                    </dd>
                                                                </div>
                                                                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                                                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                                                                        Sections
                                                                    </dt>
                                                                    <dd className="order-1 text-xl font-extrabold text-indigo-600">
                                                                        {course.sections &&
                                                                            course
                                                                                .sections
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
                                                                            course
                                                                                .instructor
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
                                                                        Last
                                                                        Update
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
                                        <div className="mt-6">
                                            <h3 className="sr-only">
                                                Description
                                            </h3>

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
                                            <h2
                                                id="details-heading"
                                                className="sr-only"
                                            >
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
                                                                        {
                                                                            "Course Objectives"
                                                                        }
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
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        item
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        {index +
                                                                                            1}
                                                                                        {
                                                                                            ". "
                                                                                        }
                                                                                    </span>
                                                                                    {
                                                                                        item
                                                                                    }
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
                                                                        {
                                                                            "Course Requirements"
                                                                        }
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
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        item
                                                                                    }
                                                                                >
                                                                                    <span>
                                                                                        {index +
                                                                                            1}
                                                                                        {
                                                                                            ". "
                                                                                        }
                                                                                    </span>
                                                                                    {
                                                                                        item
                                                                                    }
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
                                </>
                            )}
                            <div className="hidden lg:visible">
                                <Footer />
                            </div>
                        </div>
                        <CourseSidebar
                            router={router}
                            course={course}
                            tab={tab}
                            setTab={setTab}
                            setSelectedLesson={setSelectedLesson}
                            setSelectedSection={setSelectedSection}
                            completedLessons={completedLessons}
                        />
                        <div className="visible lg:hidden">
                            <Footer />
                        </div>
                    </>
                )}
            </div>
        </UserRoute>
    );
};
export default CourseDashboard;
