import UserRoute from "../../../components/Routes/UserRoute";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../context";

const PaymentSuccess = () => {
    const router = useRouter();
    const orderId = router.query.id;
    const { dispatch } = useContext(Context);

    useEffect(() => {
        const addCourse = async () => {
            try {
                const { data } = await axios.get(
                    `/api/user/courses/stripe-success/${orderId}`
                );

                if (data.success === true) {
                    await dispatch({
                        type: "COURSE_ADDITION",
                        payload: { user: data.user },
                    });
                    toast.success("Enrolled successfully");
                    router.push(`/user/course/${data.course.slug}`);
                } else {
                    toast.warning("Couldn't verify purchase");
                    router.push("/user");
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
        };
        if (orderId !== undefined) addCourse();
    }, [orderId, router, dispatch]);
    return (
        <UserRoute>
            <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
                <div className="max-w-max mx-auto">
                    <main className="sm:flex">
                        <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
                            Congratulations
                        </p>
                        <div className="sm:ml-6">
                            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                                    Thank you for course purchase
                                </h1>
                                <p className="mt-1 text-base text-gray-500">
                                    Please wait. You will now be redirected to
                                    the course dashboard.
                                </p>
                            </div>
                            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                                <svg
                                    className="animate-spin text-black h-24 w-24 mx-auto mt-8"
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
                        </div>
                    </main>
                </div>
            </div>
        </UserRoute>
    );
};

export default PaymentSuccess;
