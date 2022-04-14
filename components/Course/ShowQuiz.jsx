import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const ShowQuiz = ({
    lesson,
    handleMarkLesson = () => {},
    completedLessons = [],
}) => {
    const [question, setQuestion] = useState([]);
    const [loadingContent, setLoadingContent] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finish, setFinish] = useState(false);

    const handleQuestion = (i) => {
        const Val = [...question];
        if (Val[questionIndex].option[i].isCorrect == true) {
            setScore(score + 1);
        }
        if (questionIndex + 1 < question.length) {
            setQuestionIndex(questionIndex + 1);
        } else {
            setFinish(true);
        }
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoadingContent(true);
                const { data } = await axios.post(
                    `/api/user/courses/fetch-content`,
                    {
                        content_id: lesson.content,
                    }
                );
                if (data.success === true) {
                    setQuestion(data.content);
                    setQuestionIndex(0);
                    setScore(0);
                    setFinish(false);
                    setLoadingContent(false);
                } else {
                    setLoadingContent(false);
                }
            } catch (err) {
                // console.error(`Error: ${err}`);
                toast.error("Error");
                setLoadingContent(false);
                return;
            }
        };
        fetchContent();
    }, [lesson]);

    return (
        <>
            {/* Show Quiz section */}
            {loadingContent ? (
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
            ) : (
                <div className="mt-6 flex flex-col items-start space-y-4">
                    <div className="flex flex-col w-full">
                        <div className="flex p-10">
                            {question && finish !== true ? (
                                <div className="w-full">
                                    <p className="fontextra-bold text-center text-brand-super_dark text-4xl">
                                        Question {questionIndex + 1}/
                                        {question && question.length}
                                    </p>
                                    <h1 className="my-4 p-2 font-bold text-2xl">
                                        {question[questionIndex] &&
                                            question[questionIndex].question}
                                    </h1>
                                    {question[questionIndex] &&
                                        question[questionIndex].option.map(
                                            (data, i) => (
                                                <button
                                                    onClick={() =>
                                                        handleQuestion(i)
                                                    }
                                                    key={i}
                                                    type="button"
                                                    className="my-2 p-2 border-4 rounded-2xl w-full hover:bg-brand border-brand text-lg"
                                                >
                                                    {data.answer}
                                                </button>
                                            )
                                        )}
                                </div>
                            ) : (
                                <div className="self-center w-full grid place-items-center">
                                    <p className="text-center font-bold w-full text-4xl py-4">
                                        Your Score is {score} Out Of{" "}
                                        {question.length}
                                    </p>
                                    <button
                                        className="px-4 py-2 bg-brand-dark hover:bg-brand-super_dark text-white font-bold rounded-md"
                                        type="button"
                                        onClick={() => {
                                            if (
                                                !completedLessons.includes(
                                                    lesson._id
                                                )
                                            ) {
                                                handleMarkLesson();
                                            } else {
                                                toast.success(
                                                    "Let's proceed to next lesson"
                                                );
                                            }
                                        }}
                                    >
                                        Finish
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default ShowQuiz;
