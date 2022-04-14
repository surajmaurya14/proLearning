import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Password = () => {
    const [current_password, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (password !== confirm_password) {
                setPassword("");
                setConfirmPassword("");
                setLoading(false);
                toast.warning("Passwords doesn't match");
                return;
            }
            const { data } = await axios.post(
                "/api/user/settings/change-password",
                {
                    current_password,
                    password,
                }
            );
            if (data.success === true) {
                toast.success("Settings applied");
            } else {
                if (data.message !== null) {
                    toast.success(data.message);
                }
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
            {/* Password section */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Password
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        You will need to enter your current password before you
                        can update your password.
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-start space-y-4">
                    <div className="w-full lg:w-3/6">
                        <label
                            htmlFor="current-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            autoComplete="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={current_password}
                            required
                            minLength={6}
                            maxLength={64}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full lg:w-3/6">
                        <label
                            htmlFor="new-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            // autoComplete="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={password}
                            required
                            minLength={6}
                            maxLength={64}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full lg:w-3/6">
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            // autoComplete="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={confirm_password}
                            required
                            minLength={6}
                            maxLength={64}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
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

export default Password;
