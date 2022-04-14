import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    XCircleIcon,
} from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";
import formatCurrency from "../../utils-client/formatCurrency";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const searchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user/orders?page=${page}`);
            if (data.success === true) {
                setOrders(data.orders);
                setTotalOrders(data.totalOrders);
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
        const getOrders = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get("/api/user/orders?page=1");
                if (data.success === true) {
                    setOrders(data.orders);
                    setTotalOrders(data.totalOrders);
                    setTotalPages(data.totalPages);
                }
                setLoading(false);
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoading(false);
            }
        };
        getOrders();
    }, []);

    return (
        <div className="bg-white divide-y divide-gray-200 lg:col-span-9">
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Order History
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        You can check status of your payments below.
                    </p>
                </div>
                <div className="mt-8">
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
                        <div>
                            <h2 className="sr-only">Recent orders</h2>
                            <div className="max-w-7xl mx-auto sm:px-2 lg:px-8">
                                <div className="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                                    {orders.map((order, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border"
                                        >
                                            <h3 className="sr-only">
                                                Order placed on{" "}
                                                <time
                                                    dateTime={format(
                                                        new Date(
                                                            order.createdAt
                                                        ),
                                                        "d MMM, hh:mm a"
                                                    )}
                                                >
                                                    {format(
                                                        new Date(
                                                            order.createdAt
                                                        ),
                                                        "d MMM, hh:mm a"
                                                    )}
                                                </time>
                                            </h3>

                                            <div className="flex items-center p-4 border-b border-gray-200 sm:p-6 sm:grid sm:grid-cols-4 sm:gap-x-6">
                                                <dl className="flex-1 grid grid-cols-2 gap-x-6 text-xs sm:col-span-3 sm:grid-cols-4 lg:text-sm lg:col-span-4">
                                                    <div>
                                                        <dt className="font-medium text-brand-super_dark">
                                                            Order ID
                                                        </dt>
                                                        <dd className="mt-1 text-gray-500">
                                                            {order._id}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="font-medium text-brand-super_dark">
                                                            Payment Method
                                                        </dt>
                                                        <dd className="mt-1 text-gray-500">
                                                            {order &&
                                                                (order.course
                                                                    .paid ===
                                                                false ? (
                                                                    <span>
                                                                        Free
                                                                        Course
                                                                    </span>
                                                                ) : (
                                                                    order.payment_session &&
                                                                    order
                                                                        .payment_session
                                                                        .payment_method_types[0]
                                                                ))}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="font-medium text-brand-super_dark">
                                                            Date placed
                                                        </dt>
                                                        <dd className="mt-1 text-gray-500">
                                                            <time
                                                                dateTime={format(
                                                                    new Date(
                                                                        order.createdAt
                                                                    ),
                                                                    "d MMM, hh:mm a"
                                                                )}
                                                            >
                                                                {format(
                                                                    new Date(
                                                                        order.createdAt
                                                                    ),
                                                                    "d MMM, hh:mm a"
                                                                )}
                                                            </time>
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="font-medium text-brand-super_dark">
                                                            Total amount
                                                        </dt>
                                                        <dd className="mt-1 text-gray-500">
                                                            {order.course
                                                                .paid ===
                                                            true ? (
                                                                <>
                                                                    {formatCurrency(
                                                                        order
                                                                            .course
                                                                            .price,
                                                                        order
                                                                            .course
                                                                            .currency_type
                                                                            .AlphabeticCode
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span>
                                                                    Free
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>

                                            {/* Products */}
                                            <h4 className="sr-only">Items</h4>
                                            <ul
                                                role="list"
                                                className="divide-y divide-gray-200"
                                            >
                                                <li className="p-4 sm:p-6">
                                                    <div className="flex items-center sm:items-start">
                                                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
                                                            <img
                                                                src={
                                                                    order.course
                                                                        .thumbnail
                                                                        .location
                                                                }
                                                                alt={
                                                                    order.course
                                                                        .subtitle
                                                                }
                                                                className="object-center object-cover w-40 h-40"
                                                            />
                                                        </div>
                                                        <div className="flex-1 ml-6 text-sm">
                                                            <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                                                <h5>
                                                                    {
                                                                        order
                                                                            .course
                                                                            .title
                                                                    }
                                                                </h5>
                                                                <p className="mt-2 sm:mt-0">
                                                                    {order
                                                                        .course
                                                                        .paid ===
                                                                    true ? (
                                                                        <>
                                                                            {formatCurrency(
                                                                                order
                                                                                    .course
                                                                                    .price,
                                                                                order
                                                                                    .course
                                                                                    .currency_type
                                                                                    .AlphabeticCode
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span>
                                                                            Free
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <p className="hidden text-gray-500 sm:block sm:mt-2">
                                                                {
                                                                    order.course
                                                                        .subtitle
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 sm:flex sm:justify-between">
                                                        {(
                                                            order.course.paid
                                                                ? order.payment_status
                                                                : true === true
                                                        ) ? (
                                                            <div className="flex items-center">
                                                                <CheckCircleIcon
                                                                    className="w-5 h-5 text-green-500"
                                                                    aria-hidden="true"
                                                                />
                                                                <p className="ml-2 text-sm font-medium text-gray-500">
                                                                    Payment
                                                                    Succesful
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center">
                                                                <XCircleIcon
                                                                    className="w-5 h-5 text-red-500"
                                                                    aria-hidden="true"
                                                                />
                                                                <p className="ml-2 text-sm font-medium text-gray-500">
                                                                    Payment
                                                                    Failed
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="mt-6 border-t border-gray-200 pt-4 flex items-center space-x-4 divide-x divide-gray-200 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
                                                            <div className="flex-1 flex justify-center">
                                                                <Link
                                                                    href={`/course/${order.course.slug}`}
                                                                >
                                                                    <a className="text-indigo-600 whitespace-nowrap hover:text-indigo-500">
                                                                        Go to
                                                                        the
                                                                        course
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                            <div className="flex-1 pl-4 flex justify-center">
                                                                <Link
                                                                    href={`/user/course/${order.course.slug}`}
                                                                >
                                                                    <a className="text-indigo-600 whitespace-nowrap hover:text-indigo-500">
                                                                        Go to
                                                                        the
                                                                        dashboard
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
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
                                                    setCurrentPage(
                                                        currentPage - 1
                                                    );
                                                    searchOrders(currentPage);
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
                                                    setCurrentPage(
                                                        currentPage + 1
                                                    );
                                                    searchOrders(currentPage);
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
                                                    {orders.length !== 0
                                                        ? (currentPage - 1) *
                                                              10 +
                                                          1
                                                        : 0}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-medium">
                                                    {" "}
                                                    {(currentPage - 1) * 10 +
                                                        +orders.length}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-medium">
                                                    {totalOrders}
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
                                                            searchOrders(
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
                                                            searchOrders(
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
                                                                searchOrders(
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
                                                            currentPage <
                                                            totalPages
                                                        ) {
                                                            setCurrentPage(
                                                                currentPage + 1
                                                            );
                                                            searchOrders(
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
