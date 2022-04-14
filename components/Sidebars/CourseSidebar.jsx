import { Disclosure } from "@headlessui/react";
import { CheckIcon, ChevronUpIcon } from "@heroicons/react/outline";

const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const CourseSidebar = ({
    router,
    course,
    tab,
    setTab,
    setSelectedSection,
    setSelectedLesson,
    completedLessons,
}) => {
    return (
        <div className="flex flex-col flex-grow lg:w-2/6 lg:flex-grow-0 border-gray-200 bg-white lg:h-screen overflow-y-scroll">
            <div className="flex-grow flex flex-col">
                <nav className="flex-1 bg-white space-y-1" aria-label="Sidebar">
                    <div className="flex flex-row justify-between">
                        <h1 className="text-brand-super_dark text-xl font-semibold px-4 py-2">
                            Syllabus
                        </h1>
                        <h1 className="text-brand-super_dark text-xl font-semibold px-4 py-2">
                            {completedLessons.length}/{course.lesson_count}
                        </h1>
                    </div>

                    <ul>
                        {course.sections &&
                            course.sections.map((section, sectionIndex) => (
                                <li key={sectionIndex}>
                                    <Disclosure>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-brand-extra_light hover:bg-brand-extra_light focus:outline-none focus-visible:ring focus-visible:ring-brand-dark focus-visible:ring-opacity-75">
                                                    <span>
                                                        {sectionIndex +
                                                            1 +
                                                            ". "}
                                                        {section.title}
                                                    </span>
                                                    <div className="flex flex-row space-x-4">
                                                        <p className="text-brand">
                                                            {section.lessons
                                                                .length === 1 ||
                                                            section.lessons
                                                                .length === 0
                                                                ? section
                                                                      .lessons
                                                                      .length +
                                                                  " lesson"
                                                                : section
                                                                      .lessons
                                                                      .length +
                                                                  " lessons"}
                                                        </p>
                                                        <ChevronUpIcon
                                                            className={`${
                                                                open
                                                                    ? "transform rotate-180"
                                                                    : ""
                                                            } w-5 h-5 text-purple-500`}
                                                        />
                                                    </div>
                                                </Disclosure.Button>
                                                <ul key={sectionIndex}>
                                                    {section.lessons &&
                                                        section.lessons.map(
                                                            (
                                                                lesson,
                                                                lessonIndex
                                                            ) => (
                                                                <li
                                                                    className="bg-brand-bg_light"
                                                                    key={
                                                                        lessonIndex
                                                                    }
                                                                    onClick={() => {
                                                                        setTab({
                                                                            section:
                                                                                sectionIndex,
                                                                            lesson: lessonIndex,
                                                                        });
                                                                        setSelectedSection(
                                                                            section
                                                                        );
                                                                        setSelectedLesson(
                                                                            lesson
                                                                        );
                                                                        router.push(
                                                                            `${course.slug}?section=${sectionIndex}&lesson=${lessonIndex}`,
                                                                            undefined,
                                                                            {
                                                                                shallow: true,
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <Disclosure.Panel
                                                                        className={classNames(
                                                                            tab &&
                                                                                tab.section ===
                                                                                    sectionIndex.toString() &&
                                                                                tab.lesson ===
                                                                                    lessonIndex.toString()
                                                                                ? "text-indigo-500 bg-brand-super_light"
                                                                                : "text-gray-400 group-hover:text-gray-500",
                                                                            "px-4 pt-4 pb-2 text-sm"
                                                                        )}
                                                                    >
                                                                        <div className="flex flex-row justify-between">
                                                                            <span className="hover:cursor-pointer">
                                                                                {lessonIndex +
                                                                                    1 +
                                                                                    ". "}
                                                                                {
                                                                                    lesson.title
                                                                                }
                                                                            </span>
                                                                            {completedLessons.includes(
                                                                                lesson._id
                                                                            ) && (
                                                                                <div>
                                                                                    <CheckIcon
                                                                                        className="-ml-1 mr-2 h-5 w-5"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </Disclosure.Panel>
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </>
                                        )}
                                    </Disclosure>
                                </li>
                            ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
export default CourseSidebar;
