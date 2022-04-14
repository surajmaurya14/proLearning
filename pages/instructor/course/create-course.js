import { Context } from "../../../context";
import { useContext } from "react";
import InstructorRoute from "../../../components/Routes/InstructorRoute";
import InstructorSidebar from "../../../components/Sidebars/InstructorSidebar";

import { useRouter } from "next/router";

import CreateCourseForm from "../../../components/Course/CreateCourseForm";

const CreateCourse = () => {
    const { state } = useContext(Context);
    const { user } = state;

    const router = useRouter();

    return (
        <InstructorRoute>
            <div className="flex flex-col lg:flex-row">
                <InstructorSidebar />
                <div className="lg:w-5/6 p-8">
                    <CreateCourseForm user={user} router={router} />
                </div>
            </div>
        </InstructorRoute>
    );
};

export default CreateCourse;
