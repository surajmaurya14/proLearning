const TestcasesIO = ({ ioValues = [], setIoValues = () => {} }) => {
    const values = ioValues;
    const onChange = setIoValues;
    const handleChange = (i, e) => {
        let newValues = [...values];
        newValues[i][e.target.name] = e.target.value;
        onChange(newValues);
    };

    const addFields = () => {
        onChange([...values, { input: "", output: "" }]);
    };

    const removeFields = (i) => {
        let newValues = [...values];
        newValues.splice(i, 1);
        onChange(newValues);
    };
    return (
        <div>
            {values.map((element, index) => (
                <div
                    className="p-2 mt-2 border-2 border-zinc-500 grid grid-cols-9 gap-3"
                    key={index}
                >
                    <h3 className="col-span-9 lg:col-span-1 flex items-center text-zinc-500 font-bold m-2">
                        Test Case {index + 1}
                    </h3>
                    <div className="col-span-4">
                        <label className="text-zinc-500 font-bold m-2">
                            Input
                        </label>
                        <textarea
                            className="p-2 border-2 border-zinc-300 outline-none resize-none w-full"
                            rows="2"
                            cols="10"
                            name="input"
                            value={element.input || ""}
                            onChange={(e) => handleChange(index, e)}
                            required
                        />
                    </div>
                    <div className="col-span-4">
                        <label className="text-zinc-500 font-bold m-2">
                            Output
                        </label>
                        <textarea
                            className="p-2 border-2 border-zinc-300 outline-none resize-none w-full"
                            rows="2"
                            cols="10"
                            name="output"
                            value={element.output || ""}
                            onChange={(e) => handleChange(index, e)}
                            required
                        />
                    </div>
                    {index ? (
                        <div className="col-end-6">
                            <button
                                className="p-2 bg-red-600 text-white font-bold rounded-md"
                                type="button"
                                onClick={() => removeFields(index)}
                            >
                                Remove
                            </button>{" "}
                        </div>
                    ) : null}
                </div>
            ))}
            <div className="mt-2">
                <button
                    className="px-4 py-2 bg-green-600 text-white font-bold rounded-md"
                    type="button"
                    onClick={() => addFields()}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default TestcasesIO;
