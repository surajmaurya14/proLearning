const CodeEditorQuestionShow = (props) => {
    return (
        <div className="p-2">
            <h2 className="bg-slate-200 text-brand-super_dark font-semibold text-lg p-2">
                Question: {props.title}
            </h2>
            <div className="mt-4">
                <label className="text-brand-super_dark font-bold">
                    Description
                </label>
                <div
                    className="bg-slate-100 p-2 break-words"
                    dangerouslySetInnerHTML={{ __html: props.description }}
                />
            </div>
            <div className="mt-4">
                <label className="text-brand-super_dark font-bold">
                    Examples
                </label>
                <div
                    className="bg-slate-100 p-2 break-words"
                    dangerouslySetInnerHTML={{ __html: props.examples }}
                />
            </div>
            <div className="mt-4">
                <label className="text-brand-super_dark font-bold">
                    Constraints
                </label>
                <div
                    className="bg-slate-100 p-2 break-words"
                    dangerouslySetInnerHTML={{ __html: props.constraints }}
                />
            </div>
            <div className="mt-4">
                <label className="text-brand-super_dark font-bold">
                    Test Cases
                </label>

                <div className="bg-slate-100 p-2 break-words">
                    {props.testcases &&
                        props.testcases.map((item, index) => (
                            <p
                                key={index}
                                className="bg-slate-100 p-2 break-words"
                            >
                                <p className="text-brand">
                                    <span className="text-red-400 font-semibold">
                                        Case:
                                    </span>{" "}
                                    <span className="text-brand-super_dark">
                                        {" "}
                                        {index + 1}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-brand-super_dark font-semibold">
                                        Input:
                                    </span>{" "}
                                    {item.input}
                                </p>
                                <p>
                                    <span className="text-brand-super_dark font-semibold">
                                        Output:
                                    </span>{" "}
                                    {item.output}
                                </p>
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
};
export default CodeEditorQuestionShow;
