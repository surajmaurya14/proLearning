import axios from "axios";
import { useEffect, useState } from "react";
import formatCurrency from "../utils-server/formatCurrency";
import Link from "next/link";
import { toast } from "react-toastify";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [totalCourses, setTotalCourses] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const searchCourses = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `/api/user/courses/fetch-courses?page=${page}`
            );
            if (data.success === true) {
                setCourses(data.courses);
                setTotalCourses(data.totalCourses);
                setTotalPages(data.totalPages);
                setLoading(false);
            } else {
                setLoading(false);
                toast.warning("Couldn't fetch courses");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
    };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(
                    `/api/user/courses/fetch-courses?page=1`
                );
                if (data.success === true) {
                    setCourses(data.courses);
                    setTotalCourses(data.totalCourses);
                    setTotalPages(data.totalPages);
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.warning("Couldn't fetch courses");
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoading(false);
                return;
            }
        };
        fetchCourses();
    }, []);
    return (
        <>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <h1 className="text-3xl text-brand-super_dark mb-8 font-semibold">
                        Courses
                    </h1>
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
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                                {courses.map((course, index) => (
                                    <div className="course" key={index}>
                                        <Link
                                            href={`${process.env.NEXT_PUBLIC_DOMAIN}/course/${course.slug}`}
                                        >
                                            <a className="group text-sm">
                                                <div className="w-[320px] h-[180px] aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-75">
                                                    <img
                                                        src={
                                                            course.thumbnail
                                                                .location
                                                        }
                                                        alt={course.subtitle}
                                                        className="w-full h-full object-center object-cover"
                                                    />
                                                </div>
                                                <h3 className="mt-4 font-medium text-gray-900">
                                                    {course.title}
                                                </h3>
                                            </a>
                                        </Link>

                                        <p className="text-gray-500 italic">
                                            {course.instructor.first_name +
                                                " " +
                                                course.instructor.last_name}
                                        </p>
                                        <p className="text-brand font-semibold">
                                            {course.category}
                                        </p>
                                        {course.paid === false ? (
                                            <p className="mt-2 font-medium text-gray-900">
                                                Free
                                            </p>
                                        ) : (
                                            <p className="mt-2 font-medium text-gray-900">
                                                {formatCurrency(
                                                    course.price,
                                                    course.currency_type
                                                        .AlphabeticCode
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white mt-8 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <a
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) {
                                                setCurrentPage(currentPage - 1);
                                                searchCourses(currentPage);
                                            }
                                        }}
                                    >
                                        Previous
                                    </a>
                                    <a
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) {
                                                setCurrentPage(currentPage + 1);
                                                searchCourses(currentPage);
                                            }
                                        }}
                                    >
                                        Next
                                    </a>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {courses.length !== 0
                                                    ? (currentPage - 1) * 10 + 1
                                                    : 0}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {" "}
                                                {(currentPage - 1) * 10 +
                                                    +courses.length}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {totalCourses}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                            aria-label="Pagination"
                                        >
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) {
                                                        setCurrentPage(
                                                            currentPage - 1
                                                        );
                                                        searchCourses(
                                                            currentPage
                                                        );
                                                    }
                                                }}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <span className="sr-only">
                                                    Previous
                                                </span>
                                                <ChevronLeftIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage !== 1) {
                                                        setCurrentPage(1);
                                                        searchCourses(
                                                            currentPage
                                                        );
                                                    }
                                                }}
                                                aria-current="page"
                                                className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
                                            >
                                                1
                                            </a>
                                            {totalPages > 1 && (
                                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    ...
                                                </span>
                                            )}

                                            {totalPages > 1 && (
                                                <a
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (
                                                            currentPage !==
                                                            totalPages
                                                        ) {
                                                            setCurrentPage(
                                                                totalPages
                                                            );
                                                            searchCourses(
                                                                currentPage
                                                            );
                                                        }
                                                    }}
                                                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                                >
                                                    {totalPages}
                                                </a>
                                            )}

                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (
                                                        currentPage < totalPages
                                                    ) {
                                                        setCurrentPage(
                                                            currentPage + 1
                                                        );
                                                        searchCourses(
                                                            currentPage
                                                        );
                                                    }
                                                }}
                                                className=" inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium hover:bg-gray-50"
                                            >
                                                <span className="sr-only">
                                                    Next
                                                </span>
                                                <ChevronRightIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
