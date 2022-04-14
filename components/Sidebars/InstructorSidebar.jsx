import { HomeIcon, UsersIcon, CashIcon } from "@heroicons/react/outline";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const navigation = [
    { name: "Dashboard", icon: HomeIcon, href: "/instructor" },
    {
        name: "Create Course",
        icon: UsersIcon,
        href: "/instructor/course/create-course",
    },
    {
        name: "My Earnings",
        icon: CashIcon,
        href: "/instructor/earnings",
    },
];

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const InstructorSidebar = () => {
    const router = useRouter();
    let currentLocation = router.pathname;
    const [tab, setTab] = useState(currentLocation);
    return (
        <div className="flex flex-col flex-grow lg:w-1/6 lg:flex-grow-0  border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
            <div className="mt-5 flex-grow flex flex-col p-4">
                <nav className="flex-1 bg-white space-y-1" aria-label="Sidebar">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <a
                                className={classNames(
                                    tab === item.href
                                        ? "bg-indigo-50 border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900",

                                    "group flex items-center px-3 py-2 text-sm font-medium border-l-4"
                                )}
                                onClick={(e) => {
                                    setTab(item.href);
                                }}
                            >
                                <item.icon
                                    className={classNames(
                                        tab === item.href
                                            ? "text-indigo-500"
                                            : "text-gray-400 group-hover:text-gray-500",
                                        "mr-3 flex-shrink-0 h-6 w-6"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </a>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};
export default InstructorSidebar;
