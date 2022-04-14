import { useState } from "react";
import ReactQuillComponent from "../ReactQuillComponent";
import { Switch } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Listbox } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

import { CheckIcon, SelectorIcon, XCircleIcon } from "@heroicons/react/solid";
import ReactPlayer from "react-player";
const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const AddVideoForm = ({ course, setCourse, setAddVideoOpen }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview, setPreview] = useState(false);
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploading_started, setUploadingStarted] = useState(false);
    const [progress_bar, setProgressBar] = useState(0);
    const [section, setSection] = useState(
        course.sections && course.sections[0]
    );

    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setUploadingStarted(true);
        const videoFile = e.target.files[0];
        try {
            const dataToBeSent = new FormData();
            dataToBeSent.append("video", videoFile);
            dataToBeSent.append("course_id", course._id);
            const { data } = await axios.post(
                "/api/instructor/course/upload-video",
                dataToBeSent,
                {
                    onUploadProgress: (e) => {
                        setProgressBar(
                            Math.floor((e.loaded * 100.0) / e.total)
                        );
                    },
                }
            );
            if (data.success === true) {
                setContent(data.about);
                setUploadingStarted(false);
                toast.success("Video uploaded");
            } else {
                setUploadingStarted(false);
                toast.warning(`data.message`);
                return;
            }
        } catch (err) {
            toast.warning("Error");
            setUploadingStarted(false);
            return;
        }
    };
    const handleVideoRemove = async () => {
        try {
            const { data } = await axios.post(
                "/api/instructor/course/delete-file",
                {
                    ...content,
                    course_id: course._id,
                }
            );

            if (data.success) {
                setContent({});
                setUploadingStarted(false);
                setProgressBar(0);
                toast.success("Video deleted successfully.");
            } else {
                setUploadingStarted(false);
                toast.warning(`data.message`);
                return;
            }
        } catch (err) {
            toast.warning("Error");
            setUploadingStarted(false);
            return;
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(
                "/api/instructor/course/sections/lessons",
                {
                    title,
                    description,
                    content_type: "Video",
                    content,
                    for_preview: preview,
                    course_id: course._id,
                    section_id: section._id,
                }
            );
            if (data.success === true) {
                setLoading(false);
                setCourse(data.course);
                toast.success("Lesson Created");
                setAddVideoOpen(false);
            } else {
                setLoading(false);
                toast.error("Couldn't create lesson");
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
            return;
        }
    };

    return (
        <form
            className="divide-y divide-gray-200 lg:col-span-9"
            onSubmit={handleFormSubmit}
        >
            {/* Video section */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Type: Video
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Please upload good quality videos.
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-start space-y-4">
                    <div className="w-full">
                        <label
                            htmlFor="lesson-title"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            name="lesson-title"
                            id="lesson-title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <label
                            htmlFor="lesson-description"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Description
                        </label>
                        <div id="lesson-description">
                            <ReactQuillComponent
                                value={description}
                                setValue={setDescription}
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-4/6">
                        <Listbox value={section} onChange={setSection}>
                            {({ open }) => (
                                <>
                                    <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                        Section
                                    </Listbox.Label>
                                    <div className="mt-1 relative">
                                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">
                                                {section.title}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <SelectorIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                {course.sections &&
                                                    course.sections.map(
                                                        (
                                                            singleSection,
                                                            index
                                                        ) => (
                                                            <Listbox.Option
                                                                key={index}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        active
                                                                            ? "text-white bg-brand-dark"
                                                                            : "text-gray-900",
                                                                        "cursor-default select-none relative py-2 pl-3 pr-9"
                                                                    )
                                                                }
                                                                value={
                                                                    singleSection
                                                                }
                                                            >
                                                                {({
                                                                    selected,
                                                                    active,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={classNames(
                                                                                selected
                                                                                    ? "font-semibold"
                                                                                    : "font-normal",
                                                                                "block truncate"
                                                                            )}
                                                                        >
                                                                            {index +
                                                                                1 +
                                                                                ". " +
                                                                                singleSection.title}
                                                                        </span>

                                                                        {selected ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active
                                                                                        ? "text-white"
                                                                                        : "text-indigo-600",
                                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                                )}
                                                                            >
                                                                                <CheckIcon
                                                                                    className="h-5 w-5"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        )
                                                    )}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div>
                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_thumbnail"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Video File
                        </label>
                        <div className="flex flex-row">
                            <div className="mt-1 relative rounded-md shadow-sm">
                                {progress_bar === 100 ? (
                                    <div>
                                        {!uploading_started &&
                                            content &&
                                            content.location && (
                                                <div className="flex flex-row">
                                                    {!uploading_started &&
                                                        content &&
                                                        content.location && (
                                                            <div className="flex flex-row">
                                                                <ReactPlayer
                                                                    config={{
                                                                        file: {
                                                                            attributes:
                                                                                {
                                                                                    controlsList:
                                                                                        "nodownload",
                                                                                },
                                                                        },
                                                                    }}
                                                                    onContextMenu={(
                                                                        e
                                                                    ) =>
                                                                        e.preventDefault()
                                                                    }
                                                                    url={
                                                                        content.location
                                                                    }
                                                                    width="100%"
                                                                    height="100%"
                                                                    controls={
                                                                        true
                                                                    }
                                                                />
                                                                {((!uploading_started &&
                                                                    content !==
                                                                        null) ||
                                                                    progress_bar ===
                                                                        100) && (
                                                                    <div className="-mt-4">
                                                                        <XCircleIcon
                                                                            className="h-5 w-5 text-red-400"
                                                                            aria-hidden="true"
                                                                            onClick={
                                                                                handleVideoRemove
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        name="video"
                                        id="video"
                                        required
                                        className="mt-1 mb-4 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                        onChange={handleVideoUpload}
                                        accept={"video/*"}
                                    />
                                )}
                            </div>
                        </div>

                        {uploading_started && (
                            <div>
                                <h4 className="sr-only">Status</h4>

                                <div
                                    className="mt-6 bg-gray-200 rounded-full overflow-hidden"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="h-2 bg-brand-dark rounded-full"
                                        style={{
                                            width: { progress_bar },
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full">
                        <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                        >
                            <span className="flex-grow flex flex-col">
                                <Switch.Label
                                    as="span"
                                    className="text-sm font-medium text-brand-super_dark"
                                    passive
                                >
                                    Want to set this lesson for preview? If
                                    enabled, it can be accessed without
                                    enrolling in the course.
                                </Switch.Label>
                                <Switch.Description
                                    as="span"
                                    className="text-sm text-gray-500"
                                >
                                    It is advised to keep some lessons for
                                    preview to attract larger audience.
                                </Switch.Description>
                            </span>
                            <Switch
                                checked={preview}
                                onChange={setPreview}
                                className={classNames(
                                    preview ? "bg-brand-dark" : "bg-gray-200",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        preview
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                />
                            </Switch>
                        </Switch.Group>
                    </div>
                </div>
            </div>
            <div className="pt-6 divide-y divide-gray-200">
                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                    <button
                        type="submit"
                        className="ml-5 bg-brand-dark border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
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
                            <span>Save</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};
export default AddVideoForm;
