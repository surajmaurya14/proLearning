import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import axios from "axios";

const PlayVideo = ({
    lesson,
    handleMarkLesson = () => {},
    completedLessons = [],
}) => {
    const [content, setContent] = useState({});
    const [loadingContent, setLoadingContent] = useState(false);
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
                    setContent(data.content);
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
    }, [lesson.content]);

    return (
        <>
            {/* Video section */}
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
                    <div className="w-full">
                        <ReactPlayer
                            url={content.location}
                            width="100%"
                            height="100%"
                            controls={true}
                            config={{
                                file: {
                                    attributes: {
                                        controlsList: "nodownload",
                                    },
                                },
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                            onEnded={() => {
                                if (!completedLessons.includes(lesson._id))
                                    handleMarkLesson();
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
export default PlayVideo;
