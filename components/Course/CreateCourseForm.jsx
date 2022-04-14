import { Fragment } from "react";
import { Switch } from "@headlessui/react";
import { Listbox, Transition } from "@headlessui/react";
import ReactQuillComponent from "../ReactQuillComponent";

import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Resizer from "react-image-file-resizer";

import {
    CheckIcon,
    SelectorIcon,
    XCircleIcon,
    PlusSmIcon as PlusSmIconOutline,
} from "@heroicons/react/solid";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};
const languageData = require("../../data-sets/language");
const categoryData = require("../../data-sets/category");
const currencyData = require("../../data-sets/currency");

const levelData = ["Beginner", "Intermediate", "Expert", "All Levels"];

const CreateCourseForm = ({ user, router }) => {
    const [course_title, setCourseTitle] = useState("");
    const [course_subtitle, setCourseSubtitle] = useState("");
    const [course_description, setCourseDescription] = useState("");
    const [course_objectives, setCourseObjective] = useState([""]);
    const [course_requirements, setCourseRequirement] = useState([""]);
    const [paid, setPaid] = useState(false);
    const [price, setPrice] = useState(199);
    const [currency_type, setCurrencyType] = useState(currencyData[25]);

    const [access_to_domain, setAccessToDomain] = useState(false);
    let domainValue = (user !== null && user.email.split("@")[1]) || "";
    domainValue = domainValue === "gmail.com" ? "" : domainValue;
    const [domain, setDomain] = useState(domainValue);
    const [image_data, setImageData] = useState({});

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [category, setCategory] = useState(categoryData[0]);
    const [language, setLanguage] = useState(languageData[37]);
    const [level, setLevel] = useState(levelData[3]);

    const handleObjectiveChange = (e, index) => {
        const objectiveList = [...course_objectives];
        objectiveList[index] = e.target.value;
        setCourseObjective(objectiveList);
    };

    const handleObjectiveRemove = (index) => {
        const objectiveList = [...course_objectives];
        objectiveList.splice(index, 1);
        setCourseObjective(objectiveList);
    };

    const handleObjectiveAdd = () => {
        setCourseObjective([...course_objectives, ""]);
    };

    const handleRequirementChange = (e, index) => {
        const requirementList = [...course_requirements];
        requirementList[index] = e.target.value;
        setCourseRequirement(requirementList);
    };

    const handleRequirementRemove = (index) => {
        const requirementList = [...course_requirements];
        requirementList.splice(index, 1);
        setCourseRequirement(requirementList);
    };

    const handleRequirementAdd = () => {
        setCourseRequirement([...course_requirements, ""]);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImagePreview(URL.createObjectURL(file));
        setUploading(true);
        try {
            Resizer.imageFileResizer(
                file, // Is the file of the image which will resized.
                1280, // Is the maxWidth of the resized new image.
                720, // Is the maxHeight of the resized new image.
                "JPEG", // Is the compressFormat of the resized new image.
                100, // Is the quality of the resized new image.
                0, // Is the degree of clockwise rotation to apply to uploaded image.
                async (uri) => {
                    try {
                        let { data } = await axios.post(
                            "/api/instructor/course/upload-image",
                            {
                                image: uri,
                            }
                        );
                        if (data.success === true) {
                            toast.success("Image Uploaded");
                            setImageData(data.about);
                        } else {
                            toast.warning("Couldn't upload image");
                        }
                        setUploading(false);
                    } catch (err) {
                        // console.error(`Error: ${err}`);
                        toast.error("Error");
                        setUploading(false);
                        return;
                    }
                }, // Is the callBack function of the resized new image URI.
                "base64", // Is the output type of the resized new image.
                "200", // Is the minWidth of the resized new image.
                "200" // Is the minHeight of the resized new image.
            );
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const handleImageRemove = async (req, res) => {
        try {
            setUploading(true);
            const { data } = await axios.post(
                "/api/instructor/course/delete-image",
                {
                    image_data,
                }
            );
            setImagePreview("");
            setImageData({});
            setUploading(false);
        } catch (err) {
            setUploading(false);
            // console.error(`Error: ${err}`);
            toast.error("Error");
            return;
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post("/api/instructor/course", {
                title: course_title,
                subtitle: course_subtitle,
                description: course_description,
                objectives: course_objectives,
                requirements: course_requirements,
                category,
                language,
                level,
                domain_restriction: access_to_domain,
                domain,
                paid,
                price,
                currency_type,
                thumbnail: image_data,
            });
            if (data.success === true) {
                toast.success("Course created");
                setLoading(false);
                router.push("/instructor");
            } else {
                toast.warning(`Couldn't create course: ${data.message}`);
                setLoading(false);
            }
        } catch (err) {
            // console.error(`Error: ${err}`);
            toast.error("Error");
            setLoading(false);
        }
    };

    return (
        <form className="" onSubmit={handleFormSubmit}>
            {/* Course section */}
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                        Course Details
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Please fill correct details for each fields to have a
                        successful course creation.
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-start space-y-8">
                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_title"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Title of your Course
                        </label>
                        <input
                            type="text"
                            name="course_title"
                            id="course_title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={course_title}
                            onChange={(e) => {
                                setCourseTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_subtitle"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Sub-title of your Course
                        </label>

                        <input
                            type="text"
                            name="course_subtitle"
                            id="course_subtitle"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            value={course_subtitle}
                            onChange={(e) => {
                                setCourseSubtitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_description"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Description of your Course
                        </label>

                        <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                            <ReactQuillComponent
                                value={course_description}
                                setValue={setCourseDescription}
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_objective"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Objectives of your Course.
                        </label>
                        {course_objectives.map((singleObjective, index) => (
                            <div key={index} className="objectives">
                                <div className="first-division">
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                        name="course_objective"
                                        type="text"
                                        value={singleObjective}
                                        onChange={(e) =>
                                            handleObjectiveChange(e, index)
                                        }
                                        required
                                    />
                                    {course_objectives.length !== 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleObjectiveRemove(index)
                                            }
                                        >
                                            <span className="block text-sm font-medium text-brand-dark">
                                                Remove
                                            </span>
                                        </button>
                                    )}
                                </div>

                                <div className="second-division">
                                    {course_objectives.length - 1 === index &&
                                        course_objectives.length < 4 && (
                                            <button
                                                type="button"
                                                onClick={handleObjectiveAdd}
                                                className="mt-4 p-3 border border-transparent rounded-full shadow-sm text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <PlusSmIconOutline
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_requirement"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Requirements of your Course.
                        </label>
                        {course_requirements.map((singleRequirement, index) => (
                            <div key={index} className="requirements">
                                <div className="first-division">
                                    <input
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                        name="course_requirement"
                                        type="text"
                                        value={singleRequirement}
                                        onChange={(e) =>
                                            handleRequirementChange(e, index)
                                        }
                                        required
                                    />
                                    {course_requirements.length !== 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRequirementRemove(index)
                                            }
                                            className=""
                                        >
                                            <span className="block text-sm font-medium text-brand-dark">
                                                Remove
                                            </span>
                                        </button>
                                    )}
                                </div>

                                <div className="second-division">
                                    {course_requirements.length - 1 === index &&
                                        course_requirements.length < 4 && (
                                            <button
                                                type="button"
                                                onClick={handleRequirementAdd}
                                                className="mt-4 p-3 border border-transparent rounded-full shadow-sm text-white bg-brand-dark hover:bg-brand-super_dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <PlusSmIconOutline
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-4/6">
                        <Listbox value={category} onChange={setCategory}>
                            {({ open }) => (
                                <>
                                    <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                        Category of your Course
                                    </Listbox.Label>
                                    <div className="mt-1 relative">
                                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">
                                                {category}
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
                                                {categoryData.map(
                                                    (typeOfCategory, index) => (
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
                                                                typeOfCategory
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
                                                                        {
                                                                            typeOfCategory
                                                                        }
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
                        <Listbox value={language} onChange={setLanguage}>
                            {({ open }) => (
                                <>
                                    <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                        Language of your Course
                                    </Listbox.Label>
                                    <div className="mt-1 relative">
                                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">
                                                {language.English}
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
                                                {languageData.map(
                                                    (typeOfLanguage, index) => (
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
                                                                typeOfLanguage
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
                                                                        {
                                                                            typeOfLanguage.English
                                                                        }
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
                        <Listbox value={level} onChange={setLevel}>
                            {({ open }) => (
                                <>
                                    <Listbox.Label className="block text-sm font-medium text-brand-super_dark">
                                        {" "}
                                        Level of your Course
                                    </Listbox.Label>
                                    <div className="mt-1 relative">
                                        <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">
                                                {level}
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
                                                {levelData.map(
                                                    (typeOfLevel, index) => (
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
                                                            value={typeOfLevel}
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
                                                                        {
                                                                            typeOfLevel
                                                                        }
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
                                    Availability to your institution only?
                                </Switch.Label>
                                <Switch.Description
                                    as="span"
                                    className="text-sm text-gray-500"
                                >
                                    Turn on only if you want your course to be
                                    accessibe to only your institution students.
                                    You need to have a institutional email
                                    address.
                                </Switch.Description>
                            </span>
                            <Switch
                                checked={access_to_domain}
                                onChange={() => {
                                    if (domainValue === "") {
                                        return;
                                    } else {
                                        setAccessToDomain(!access_to_domain);
                                    }
                                }}
                                className={classNames(
                                    access_to_domain
                                        ? "bg-brand-dark"
                                        : "bg-gray-200",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        access_to_domain
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                />
                            </Switch>
                        </Switch.Group>
                    </div>
                    {access_to_domain && (
                        <>
                            <div className="w-full lg:w-4/6">
                                <label
                                    htmlFor="domain"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Domain of your college
                                </label>
                                <input
                                    type="text"
                                    name="domain"
                                    id="domain"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-brand-extra_light"
                                    placeholder="Institutional email address mandatory"
                                    value={domain}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setDomain(e.target.value);
                                    }}
                                    disabled
                                />
                            </div>
                        </>
                    )}

                    <div className="w-full lg:w-4/6">
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
                                    Want to charge certain amount for your
                                    course?
                                </Switch.Label>
                                <Switch.Description
                                    as="span"
                                    className="text-sm text-gray-500"
                                >
                                    Turn on only if you want your course to be
                                    paid. 50% of taxed amount is given to
                                    instructors for each purchase.
                                </Switch.Description>
                            </span>
                            <Switch
                                checked={paid}
                                onChange={setPaid}
                                className={classNames(
                                    paid ? "bg-brand-dark" : "bg-gray-200",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        paid
                                            ? "translate-x-5"
                                            : "translate-x-0",
                                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                />
                            </Switch>
                        </Switch.Group>
                    </div>
                    {paid && (
                        <>
                            <div className="w-full lg:w-4/6">
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Price
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">
                                            ₹
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        min={199}
                                        max={9999}
                                        step={10}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                        placeholder="0.00"
                                        required
                                        value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                        }}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <label
                                            htmlFor="currency"
                                            className="sr-only"
                                        >
                                            Currency
                                        </label>
                                        <select
                                            id="currency"
                                            disabled
                                            name="currency_type"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                        >
                                            <option selected>INR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="w-full lg:w-4/6">
                        <label
                            htmlFor="course_thumbnail"
                            className="block text-sm font-medium text-brand-super_dark"
                        >
                            Thumbnail of your course
                        </label>
                        <input
                            type="file"
                            name="course_thumbnail"
                            id="course_thumbnail"
                            required
                            className="mt-1 mb-4 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            onChange={handleImageUpload}
                            accept={"image/*"}
                        />

                        {imagePreview && (
                            <>
                                <div className="ml-80">
                                    <XCircleIcon
                                        className="h-5 w-5 text-red-400"
                                        aria-hidden="true"
                                        onClick={handleImageRemove}
                                    />
                                </div>
                                <img
                                    className="inline-block rounded-md w-[320px] h-[180px]"
                                    id="course_thumbnail_selected"
                                    src={imagePreview}
                                    alt=""
                                />
                            </>
                        )}
                        {uploading && (
                            <>
                                <svg
                                    className="animate-spin h-8 w-8 text-black"
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
                            </>
                        )}
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

export default CreateCourseForm;
