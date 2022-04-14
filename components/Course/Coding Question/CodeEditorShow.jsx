import { useState, useRef } from "react";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/material.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/material-ocean.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/theme/monokai.css";

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
    require("codemirror/mode/python/python");
    require("codemirror/mode/cmake/cmake");
    require("codemirror/mode/clike/clike");
    require("codemirror/mode/javascript/javascript");
}

const CodeEditorShow = ({ io, course_id }) => {
    const [c, setC] = useState("");
    const [cpp, setCpp] = useState("");
    const [java, setJava] = useState("");
    const [python, setPython] = useState("");
    const [javascript, setJavascript] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [check, setCheck] = useState(false);
    const [cpl, setCpl] = useState(false);
    const [one, setOne] = useState();
    const [testCase, setTestCase] = useState();
    const inputOutput = io;
    const inputFile = useRef();

    const themeArray = [
        "default",
        "cobalt",
        "darcula",
        "dracula",
        "eclipse",
        "material",
        "material-darker",
        "material-ocean",
        "material-palenight",
        "monokai",
    ];
    const languageArray = [
        { name: "C", type: "text/x-csrc" },
        { name: "C++", type: "text/x-c++src" },
        { name: "Java", type: "text/x-java" },
        { name: "Python", type: "text/x-cython" },
        { name: "Javascript", type: "text/javascript" },
    ];
    const [language, setLanguage] = useState(languageArray[1].type);
    const [theme, setTheme] = useState(themeArray[4]);

    const Run = async () => {
        setCpl(true);
        if (!check) {
            input = "";
        }
        const { data } = await axios.post("/api/user/course/compile", {
            code: file.value,
            input: input,
            language: language,
            course_id: course_id,
        });

        if (data.success === true) {
            setOutput(data.output);
        } else {
            setOutput(data.message);
        }
        setCpl(false);
    };

    const Test = async () => {
        setCpl(true);
        const { data } = await axios.post("/api/user/course/compile", {
            code: file.value,
            input: inputOutput,
            language: language,
            course_id: course_id,
        });

        if (data.success === true) {
            setTestCase(data.output);
        } else {
            setTestCase(data.message);
        }
        setCpl(false);
    };

    const handleChange = (editor, data, value) => {
        if (language == "text/x-csrc") {
            setC(value);
        } else if (language == "text/x-c++src") {
            setCpp(value);
        } else if (language == "text/x-java") {
            setJava(value);
        } else if (language == "text/x-cython") {
            setPython(value);
        } else if (language == "text/javascript") {
            setJavascript(value);
        }
    };

    const files = {
        "text/x-csrc": {
            value: c,
        },
        "text/x-c++src": {
            value: cpp,
        },
        "text/x-java": {
            value: java,
        },
        "text/x-cython": {
            value: python,
        },
        "text/javascript": {
            value: javascript,
        },
    };

    const Changefile = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            if (language == "text/x-csrc") {
                setC(e.target.result);
            } else if (language == "text/x-c++src") {
                setCpp(e.target.result);
            } else if (language == "text/x-java") {
                setJava(e.target.result);
            } else if (language == "text/x-cython") {
                setPython(e.target.result);
            } else if (language == "text/javascript") {
                setJavascript(e.target.result);
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    const [fileName, setFileName] = useState("text/x-c++src");
    const file = files[fileName];

    return (
        <div className="p-2 bg-zinc-50 h-full">
            <div className="flex flex-row bg-zinc-100">
                <div className="pl-1.5 py-2">
                    <label className="text-brand-super_dark mx-2">
                        Language{" "}
                    </label>
                    <select
                        className="border-2"
                        name="option"
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            setFileName(e.target.value);
                        }}
                    >
                        {languageArray.map((item, index) => (
                            <option
                                key={index}
                                value={item.type}
                                selected={item.type === language}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="pl-1.5 py-2">
                    <label className="text-brand-super_dark mx-2">Theme </label>
                    <select
                        name="theme"
                        className="border-2"
                        onChange={(e) => {
                            setTheme(e.target.value);
                        }}
                    >
                        {themeArray.map((item, index) => (
                            <option
                                key={index}
                                value={item}
                                selected={theme === item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <CodeMirror
                    onBeforeChange={handleChange}
                    value={file.value}
                    className="h-[72vh]"
                    options={{
                        lineWrapping: true,
                        theme: theme,
                        mode: language,
                        lineNumbers: true,
                    }}
                />
            </div>
            <div className="py-3">
                <input
                    onChange={Changefile}
                    className="hidden"
                    type="file"
                    ref={inputFile}
                />
                <button
                    className="mt-2 bg-brand-dark text-white py-2 px-5 hover:bg-brand-super_dark rounded-md"
                    onClick={() => inputFile.current.click()}
                    type="button"
                >
                    Open File
                </button>
                <button
                    disabled={cpl}
                    className="mt-2 bg-brand-dark text-white py-2 px-5 mx-8 hover:bg-brand-super_dark disabled:bg-brand-light rounded-md"
                    onClick={Test}
                    type="button"
                >
                    Submit
                </button>
                <button
                    disabled={cpl}
                    className="mt-2 bg-brand-dark text-white py-2 px-5 mr-8 hover:bg-brand-super_dark disabled:bg-brand-light rounded-md"
                    onClick={Run}
                    type="button"
                >
                    Run
                </button>
                <input
                    type="checkbox"
                    name="input"
                    onChange={() => setCheck(!check)}
                />
                <label htmlFor="input" className="mx-2 text-brand-super_dark">
                    Custom Input
                </label>
            </div>
            <div>
                {check && (
                    <div>
                        <h3 className="text-zinc-600 p-1">Custom Input</h3>
                        <textarea
                            value={input}
                            className="w-full p-2 border-2 border-zinc-300 outline-none resize-none"
                            rows="5"
                            cols="10"
                            name="input"
                            onChange={(e) => setInput(e.target.value)}
                        ></textarea>
                    </div>
                )}
            </div>
            <div>
                {output && (
                    <div className="border-2 border-zinc-300 mt-5">
                        <div className="p-2 border-b-2 border-zinc-300 flex justify-end bg-zinc-100">
                            <button
                                className="px-2 border-2 border-zinc-300 font-bold text-zinc-500 hover:bg-zinc-400"
                                onClick={() => setOutput("")}
                                type="button"
                            >
                                x
                            </button>
                        </div>
                        <div className="p-3">
                            <h3 className="text-zinc-500 p-1 font-bold">
                                Output
                            </h3>

                            <textarea
                                value={output}
                                className="w-full p-2 border-2 border-zinc-300 outline-none resize-none bg-slate-100"
                                rows="5"
                                cols="10"
                                name="output"
                                disabled
                            />
                        </div>
                    </div>
                )}
            </div>
            <div>
                {testCase && (
                    <div className="border-2 border-zinc-300 mt-5">
                        <div className="p-2 border-b-2 border-zinc-300 flex justify-end bg-zinc-100">
                            <button
                                className="px-2 border-2 border-zinc-300 font-bold text-zinc-500 hover:bg-zinc-400"
                                onClick={() => setTestCase()}
                                type="button"
                            >
                                x
                            </button>
                        </div>
                        <div className="grid grid-cols-6 border-2 border-zinc-300">
                            <div className="col-span-2 border-r-2 border-zinc-300 p-2 bg-zinc-50">
                                {inputOutput.map((data, i) => {
                                    return (
                                        <div key={i}>
                                            {data.output === testCase[i] ? (
                                                <button
                                                    className="bg-gray-50 hover:bg-white text-green-400 font-extrabold w-full p-2  border border-gray-200"
                                                    onClick={() => {
                                                        setOne({ ...data, i });
                                                    }}
                                                    type="button"
                                                >
                                                    Test case {i + 1}
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-gray-50 hover:bg-white text-rose-400 font-extrabold w-full p-2  border border-gray-200"
                                                    onClick={() => {
                                                        setOne({ ...data, i });
                                                    }}
                                                    type="button"
                                                >
                                                    Test case {i + 1}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {one && (
                                <div className="col-span-4">
                                    <div className="p-3">
                                        <h3 className="text-zinc-500 p-1 font-bold">
                                            Input
                                        </h3>
                                        <textarea
                                            value={one.input}
                                            className="w-full p-2 border-2 border-zinc-300 outline-none resize-none bg-slate-100"
                                            rows="3"
                                            cols="10"
                                            name="output"
                                            disabled
                                        >
                                            {one.input}
                                        </textarea>
                                    </div>
                                    <div className="p-2">
                                        <h3 className="text-zinc-500 p-1 font-bold">
                                            Expected Output
                                        </h3>
                                        <textarea
                                            value={one.output}
                                            className="w-full p-2 border-2 border-zinc-300 outline-none resize-none bg-slate-100"
                                            rows="3"
                                            cols="10"
                                            name="output"
                                            disabled
                                        >
                                            {one.output}
                                        </textarea>
                                    </div>
                                    <div className="p-2">
                                        <h3 className="text-zinc-500 p-1 font-bold">
                                            Your Output
                                        </h3>
                                        <textarea
                                            value={testCase[one.i]}
                                            className="w-full p-2 border-2 border-zinc-300 outline-none resize-none bg-slate-100"
                                            rows="3"
                                            cols="10"
                                            name="output"
                                            disabled
                                        >
                                            {testCase[one.i]}
                                        </textarea>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeEditorShow;
