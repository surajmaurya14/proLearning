import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useState } from "react";
import UserRoute from "../../components/Routes/UserRoute";

const BecomeInstructor = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleButtonClick = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post("/api/instructor");
            if (data.success === true) {
                toast.success("Redirecting to Stripe for account setup");
                router.push(data.url);
            } else {
                setLoading(false);
                router.push("/user");
            }
        } catch (err) {
            // toast.error("Error");
            setLoading(false);
            return;
        }
    };

    return (
        <UserRoute>
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
                        Become Instructor
                    </h2>
                    <p className="mt-4  text-center text-md text-gray-600">
                        You need to have a stripe account to get payments to
                        your bank. By continuing, you agree to connect your
                        stripe account with proLearning to get payments for your
                        purchased courses.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div>
                            <button
                                onClick={handleButtonClick}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={loading ? true : false}
                                type="button"
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
                                    <span>Continue</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </UserRoute>
    );
};
export default BecomeInstructor;
