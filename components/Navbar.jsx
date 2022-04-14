import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SearchIcon, UserIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const navigation = [
    { name: "Dashboard", href: "/user" },
    { name: "Playground", href: "/playground" },
    { name: "Practice", href: "/practice" },
];

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ currentPath }) => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setSearch(search);
            if (search !== "") router.push(`/user/search/${search}`);
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const { state, dispatch } = useContext(Context);
    const { user } = state;
    const logout = async (e) => {
        e.preventDefault();
        await axios.post("/api/auth/logout");
        dispatch({
            type: "LOGOUT",
        });
        localStorage.removeItem("user");
        router.push("/user/login");
    };

    return (
        <Disclosure as="nav" className="bg-white shadow">
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex px-2 lg:px-0">
                                <div className="flex-shrink-0 flex items-center">
                                    <div className="block lg:hidden">
                                        <Link href="/">
                                            <a>
                                                <img
                                                    src="/logo.svg"
                                                    alt="proLearning"
                                                    className="w-8 h-8"
                                                />
                                            </a>
                                        </Link>
                                    </div>

                                    <div className="hidden lg:block">
                                        <Link href="/">
                                            <a>
                                                <img
                                                    src="/logo.svg"
                                                    alt="proLearning"
                                                    className="w-8 h-8"
                                                />
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                                    {navigation.map((item, index) => (
                                        <Link href={item.href} key={index}>
                                            <a
                                                key={item.name}
                                                className={classNames(
                                                    item.href == currentPath
                                                        ? "border-indigo-500 text-gray-900"
                                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                                )}
                                                aria-current={
                                                    item.href == currentPath
                                                        ? "page"
                                                        : undefined
                                                }
                                            >
                                                {item.name}
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                                <div className="max-w-lg w-full lg:max-w-xs">
                                    <label htmlFor="search" className="sr-only">
                                        Search available course
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <form onSubmit={handleFormSubmit}>
                                            <input
                                                id="search"
                                                name="search"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Search available course"
                                                type="search"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                }}
                                            />
                                            <input
                                                type="submit"
                                                className="hidden"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        submit;
                                                    }
                                                }}
                                            />
                                        </form>
                                    </div>
                                </div>
                                {user === null && (
                                    <>
                                        <div className="hidden lg:block">
                                            <Link href="/user/login">
                                                <a className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Login
                                                </a>
                                            </Link>
                                        </div>
                                        <div className="hidden lg:block">
                                            <Link href="/user/register">
                                                <a className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Register
                                                </a>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center lg:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {open ? (
                                        <XIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <MenuIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="hidden lg:ml-4 lg:flex lg:items-center">
                                {/* Profile dropdown */}
                                <Menu
                                    as="div"
                                    className="ml-4 relative flex-shrink-0"
                                >
                                    <div>
                                        <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>

                                            <UserIcon
                                                className="block h-8 w-8 text-black group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {user !== null &&
                                            user.role !== null &&
                                            user.role.includes("Instructor") ? (
                                                <Menu.Item>
                                                    <Link href="/instructor">
                                                        <a
                                                            className={
                                                                "hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                                            }
                                                        >
                                                            Instructor Dashboard
                                                        </a>
                                                    </Link>
                                                </Menu.Item>
                                            ) : (
                                                <Menu.Item>
                                                    <Link href="/user/become-instructor">
                                                        <a
                                                            className={
                                                                "hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                                            }
                                                        >
                                                            Become Instructor
                                                        </a>
                                                    </Link>
                                                </Menu.Item>
                                            )}

                                            <Menu.Item>
                                                <Link href="/user/settings">
                                                    <a
                                                        className={
                                                            "hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                                        }
                                                    >
                                                        Settings
                                                    </a>
                                                </Link>
                                            </Menu.Item>

                                            {user !== null && (
                                                <>
                                                    <Menu.Item>
                                                        <a
                                                            onClick={logout}
                                                            className={
                                                                "hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                                            }
                                                        >
                                                            Sign out
                                                        </a>
                                                    </Menu.Item>
                                                </>
                                            )}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="lg:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as={Link}
                                    href={item.href}
                                    aria-current={
                                        item.current ? "page" : undefined
                                    }
                                >
                                    <a
                                        className={classNames(
                                            item.current
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 block"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                </Disclosure.Button>
                            ))}
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <UserIcon
                                        className="block h-8 w-8 text-black group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">
                                        {user !== null
                                            ? user.first_name +
                                              " " +
                                              user.last_name
                                            : ""}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user !== null ? user.email : ""}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                {user !== null &&
                                user.role !== null &&
                                user.role.includes("Instructor") ? (
                                    <Disclosure.Button
                                        as={Link}
                                        href="/instructor"
                                    >
                                        <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                            Instructor Dashboard
                                        </a>
                                    </Disclosure.Button>
                                ) : (
                                    <Disclosure.Button
                                        as={Link}
                                        href="/user/become-instructor"
                                    >
                                        <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                            Become Instructor
                                        </a>
                                    </Disclosure.Button>
                                )}

                                <Disclosure.Button
                                    as={Link}
                                    href="/user/settings"
                                >
                                    <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                        Settings
                                    </a>
                                </Disclosure.Button>
                                {user !== null && (
                                    <>
                                        <Disclosure.Button as="div">
                                            <a
                                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                                onClick={logout}
                                            >
                                                Sign out
                                            </a>
                                        </Disclosure.Button>
                                    </>
                                )}
                                {user === null && (
                                    <>
                                        <Disclosure.Button
                                            as={Link}
                                            href="/user/login"
                                        >
                                            <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                                Login
                                            </a>
                                        </Disclosure.Button>
                                        <Disclosure.Button
                                            as={Link}
                                            href="/user/register"
                                        >
                                            <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                                Register
                                            </a>
                                        </Disclosure.Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Navbar;
