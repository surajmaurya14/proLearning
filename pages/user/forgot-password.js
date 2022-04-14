import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useState } from "react";

import PublicRoute from "../../components/Routes/PublicRoute";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [tokenSent, setTokenSent] = useState(false);
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleFormSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const { data } = await axios.post(
                "/api/auth/reset-password-token",
                {
                    email,
                }
            );

            if (data.success === true) {
                setTokenSent(true);
                setLoading(false);
                toast.success(
                    "Please check your email. We have sent you a reset token"
                );
            } else {
                if (data.time !== null) {
                    toast.warning(
                        `Please try again after ${data.time} minutes`
                    );
                }
                setLoading(false);
                router.push("/user/login");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (password !== confirmPassword) {
                setPassword("");
                setConfirmPassword("");
                setLoading(false);
                toast.warning("Passwords doesn't match");
                return;
            }
            const { data } = await axios.post("/api/auth/change-password", {
                email,
                password_reset_token: token,
                password,
            });

            if (data.success === true) {
                setLoading(false);
                toast.success("Password has been changed. Please Login");
                router.push("/user/login");
            } else {
                toast.warning("Login failed");
                setLoading(false);
                router.push("/user/login");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
        }
    };

    return (
        <PublicRoute>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <img
                            src="/logo.svg"
                            alt="proLearing"
                            className="w-12 h-12"
                        />
                    </div>

                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot your Password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your email address to get reset token.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form
                            className="space-y-6"
                            onSubmit={
                                !tokenSent
                                    ? handleFormSubmitEmail
                                    : handleFormSubmit
                            }
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        value={email}
                                        disabled={tokenSent ? true : false}
                                    />
                                </div>
                            </div>

                            {tokenSent && (
                                <>
                                    <div>
                                        <label
                                            htmlFor="token"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Token
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="token"
                                                name="token"
                                                type="text"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                onChange={(e) => {
                                                    setToken(e.target.value);
                                                }}
                                                value={token}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                minLength={6}
                                                maxLength={64}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                }}
                                                value={password}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="confirm-password"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="confirm-password"
                                                name="confirm-password"
                                                type="password"
                                                required
                                                minLength={6}
                                                maxLength={64}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                onChange={(e) => {
                                                    setConfirmPassword(
                                                        e.target.value
                                                    );
                                                }}
                                                value={confirmPassword}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading ? true : false}
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
                                        <span>
                                            {!tokenSent ? "Continue" : "Submit"}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
};
export default ForgotPassword;
