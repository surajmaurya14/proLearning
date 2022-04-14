import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const InstructorRoute = ({ children }) => {
    const router = useRouter();

    const [verifying, setVerifying] = useState(true);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user === null) {
            router.push("/user/login");
        } else if (!user.role.includes("Instructor")) {
            router.push("/user");
        } else {
            setVerifying(false);
        }
    }, [router]);

    return (
        <>
            {verifying ? (
                <>
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
                </>
            ) : (
                <>{children}</>
            )}
        </>
    );
};
export default InstructorRoute;
