import { useEffect } from "react";
import { useRouter } from "next/router";
import { Context } from "../../context";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PublicRoute from "../../components/Routes/PublicRoute";

const Callback = () => {
    const router = useRouter();
    const { dispatch } = useContext(Context);
    useEffect(() => {
        const getAccountStatus = async () => {
            try {
                const { data } = await axios.get(
                    `/api/instructor/account-data`
                );
                if (data.success === true) {
                    dispatch({
                        type: "INITIAL_LOGIN_STATE",
                        payload: data.user,
                    });
                    localStorage.setItem("user", JSON.stringify(data.user));
                    router.push("/instructor");
                } else {
                    toast.warning("Error");
                    router.push("/user");
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                router.push("/user");
            }
        };
        getAccountStatus();
    }, [dispatch, router]);
    return (
        <PublicRoute>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
                            Alright...
                        </h2>
                        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Thank You for setting up Stripe Account.
                        </p>
                        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                            Please wait, you will be redirected to the
                            instructor dashboard.
                        </p>
                    </div>
                </div>
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
            </div>
        </PublicRoute>
    );
};

export default Callback;
