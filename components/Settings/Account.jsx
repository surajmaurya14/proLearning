import { Switch } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};
const Account = ({ user, dispatch }) => {
    const [newsletter, setNewsletter] = useState(user.newsletter);
    const [loading, setLoading] = useState(false);
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/api/user/settings/account", {
                newsletter,
            });
            if (data.success === true) {
                toast.success("Settings applied");
                dispatch({
                    type: "SETTINGS_CHANGE",
                    payload: { newsletter },
                });
            }
            setLoading(false);
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
        }
    };

    return (
        <form
            className="divide-y divide-gray-200 lg:col-span-9"
            onSubmit={handleFormSubmit}
        >
            {/* Profile section */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Account
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Modify the settings related to your Account.
                    </p>
                </div>
            </div>

            {/* Privacy section */}
            <div className="pt-6 divide-y divide-gray-200">
                <div className="px-4 sm:px-6">
                    <div>
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            Privacy
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Modify your preferences below.
                        </p>
                    </div>
                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                        <Switch.Group
                            as="li"
                            className="py-4 flex items-center justify-between"
                        >
                            <div className="flex flex-col">
                                <Switch.Label
                                    as="p"
                                    className="text-sm font-medium text-gray-900"
                                    passive
                                >
                                    Subscribe to newsletter
                                </Switch.Label>
                                <Switch.Description className="text-sm text-gray-500">
                                    Receive updates from the product and
                                    upcoming features.
                                </Switch.Description>
                            </div>
                            <Switch
                                checked={newsletter}
                                onChange={setNewsletter}
                                className={classNames(
                                    newsletter ? "bg-teal-500" : "bg-gray-200",
                                    "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        newsletter
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                />
                            </Switch>
                        </Switch.Group>
                    </ul>
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
            </div>
        </form>
    );
};

export default Account;
