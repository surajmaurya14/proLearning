import { useEffect, useState } from "react";
import InstructorRoute from "../../components/Routes/InstructorRoute";
import InstructorSidebar from "../../components/Sidebars/InstructorSidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import {
    CalendarIcon,
    CheckCircleIcon,
    MenuAlt1Icon,
    XCircleIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
const InstructorDashboard = () => {
    const [courses, setCourses] = useState(undefined);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get(
                    "/api/instructor/course/fetch-courses"
                );
                if (data.success === true) {
                    setCourses(data.courses);
                } else {
                    toast.warning("Couldn't fetch courses");
                }
            } catch (err) {
                // toast.warning("Couldn't fetch courses");
                return;
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
            <InstructorRoute>
                <div className="flex flex-col lg:flex-row">
                    <InstructorSidebar />

                    <div className="lg:w-5/6 p-8">
                        {courses !== undefined ? (
                            <>
                                <div>
                                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                                        Your created courses
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Select any of the below courses to
                                        modify the courses.
                                    </p>
                                </div>
                                <div className="mt-4 shadow overflow-hidden sm:rounded-md">
                                    <ul
                                        role="list"
                                        className="divide-y divide-gray-200"
                                    >
                                        {courses.map((course, index) => (
                                            <li key={index}>
                                                <div className="px-4 py-4 sm:px-6 bg-brand-bg_light">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-row items-center">
                                                            <img
                                                                className="rounded-full w-12 h-12"
                                                                src={
                                                                    course
                                                                        .thumbnail
                                                                        .location
                                                                }
                                                                alt=""
                                                            />
                                                            <p className="mx-4 text-sm font-medium text-indigo-600">
                                                                {course.title}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Link
                                                                href={`/instructor/course/modify/${course.slug}`}
                                                                passHref
                                                            >
                                                                <button
                                                                    className="ml-2 flex-shrink-0 flex"
                                                                    type="button"
                                                                >
                                                                    <p className="p-2 rounded-md inline-flex text-sm leading-5 font-semibold bg-green-100 text-green-800">
                                                                        Modify
                                                                    </p>
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 sm:flex sm:justify-between">
                                                        <div className="sm:flex">
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                <MenuAlt1Icon
                                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                                <span>
                                                                    Sections
                                                                    present:{" "}
                                                                    {
                                                                        course
                                                                            .sections
                                                                            .length
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p className="flex items-center text-sm text-gray-500 sm:ml-6">
                                                                <MenuAlt1Icon
                                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />
                                                                <span>
                                                                    Lessons
                                                                    present:{" "}
                                                                    {
                                                                        course.lesson_count
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                                <CalendarIcon
                                                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                                                    aria-hidden="true"
                                                                />

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
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                            {course.published ? (
                                                                <>
                                                                    <CheckCircleIcon
                                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <p>
                                                                        Course
                                                                        is live.
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircleIcon
                                                                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <p>
                                                                        Course
                                                                        is not
                                                                        live.
                                                                    </p>
                                                                </>
                                                            )}

                                                            <p>
                                                                {
                                                                    course.published
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="animate-spin text-black h-24 w-24 mx-auto mt-8"
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
                            </>
                        )}
                    </div>
                </div>
            </InstructorRoute>
        </>
    );
};

export default InstructorDashboard;
