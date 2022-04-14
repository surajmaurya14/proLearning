import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = ({ user, dispatch }) => {
    const [first_name, setFirstName] = useState(user.first_name);
    const [last_name, setLastName] = useState(user.last_name);

    const [loading, setLoading] = useState(false);
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/api/user/settings/profile", {
                first_name,
                last_name,
            });
            if (data.success === true) {
                toast.success("Settings applied");
                dispatch({
                    type: "SETTINGS_CHANGE",
                    payload: { first_name, last_name },
                });
            } else {
                toast.success(data.message);
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
                        Profile
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed publicly so be
                        careful what you share.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                        <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            First name
                        </label>
                        <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="first-name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={first_name}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                            required
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Last name
                        </label>
                        <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            autoComplete="last-name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={last_name}
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="pt-6 divide-y divide-gray-200">
                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                    <button
                        type="submit"
                        disabled={loading}
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
    );
};

export default Profile;
