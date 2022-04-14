import { useRouter } from "next/router";
import { Context } from "../../../../context";
import { useContext, useEffect, useState } from "react";
import InstructorRoute from "../../../../components/Routes/InstructorRoute";
import InstructorSidebar from "../../../../components/Sidebars/InstructorSidebar";
import { toast } from "react-toastify";
import axios from "axios";
import ModifyCourseForm from "../../../../components/Course/ModifyCourseForm";

const InstructorCourseView = () => {
    const router = useRouter();
    const { state, dispatch } = useContext(Context);
    const { user } = state;
    const [course, setCourse] = useState({});
    const [studentsCount, setStudentsCount] = useState(0);
    const { slug } = router.query;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.post(
                    "/api/instructor/course/data",
                    { slug }
                );

                if (data.success === true) {
                    setCourse(data.course);
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
        };
        if (slug !== undefined) fetchCourse();
    }, [slug]);

    useEffect(() => {
        const fetchStudentsCount = async () => {
            try {
                if (course._id !== null) {
                    const { data } = await axios.post(
                        "/api/instructor/course/students-count",
                        {
                            course_id: course._id,
                        }
                    );

                    if (data.success === true) {
                        setStudentsCount(data.count);
                    } else {
                        toast.warning("Couldn't fetch student's count");
                    }
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                return;
            }
        };
        if (course._id !== undefined) fetchStudentsCount();
    }, [slug, course]);

    return (
        <>
            <InstructorRoute>
                <div className="flex flex-col lg:flex-row">
                    <InstructorSidebar />

                    <div className="lg:w-5/6 p-4">
                        {course._id !== null ? (
                            <ModifyCourseForm
                                user={user}
                                course={course}
                                setCourse={setCourse}
                                slug={slug}
                                router={router}
                                studentsCount={studentsCount}
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
        </>
    );
};

export default InstructorCourseView;
