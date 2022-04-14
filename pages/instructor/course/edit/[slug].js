import { useState, useEffect } from "react";
import InstructorRoute from "../../../../components/Routes/InstructorRoute";
import InstructorSidebar from "../../../../components/Sidebars/InstructorSidebar";
import axios from "axios";
import { useRouter } from "next/router";
import EditCourseForm from "../../../../components/Course/EditCourseForm";
import { toast } from "react-toastify";

const EditCourse = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [course, setCourse] = useState(undefined);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.post(
                    "/api/instructor/course/data",
                    { slug }
                );

                if (data.success === true) {
                    setCourse(data.course);
                } else {
                    toast.warning("Couldn't fetch data");
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
        };
        if (slug !== undefined) fetchCourse();
    }, [slug]);

    return (
        <InstructorRoute>
            <div className="flex flex-col lg:flex-row">
                <InstructorSidebar />
                <div className="lg:w-5/6 p-8">
                    {course !== undefined ? (
                        <EditCourseForm
                            router={router}
                            slug={slug}
                            course={course}
                            setCourse={setCourse}
                        />
                    ) : (
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
                    )}
                </div>
            </div>
        </InstructorRoute>
    );
};

export default EditCourse;
