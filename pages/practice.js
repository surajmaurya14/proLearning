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

const Practice = () => {
    const [c, setC] = useState("");
    const [cpp, setCpp] = useState("");
    const [java, setJava] = useState("");
    const [python, setPython] = useState("");
    const [javascript, setJavascript] = useState("");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [check, setCheck] = useState(false);
    const [cpl, setCpl] = useState(false);
    const inputFile = useRef(null);
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

    const Submit = async () => {
        setCpl(true);
        if (!check) {
            input = "";
        }
        const { data } = await axios.post("/api/user/practice/compile", {
            code: file.value,
            input: input,
            language: language,
        });
        if (data.success === true) {
            setOutput(data.output);
        } else {
            setOutput(data.message);
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
        <div className="px-2 py-2 lg:px-8 lg:py-6 bg-zinc-50">
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

            <div className="flex flex-row items-center py-3">
                <input
                    className="hidden"
                    onChange={Changefile}
                    type="file"
                    ref={inputFile}
                />
                <button
                    className="mt-2 bg-brand-dark hover:bg-brand-super_dark text-white py-2 px-5 rounded-md"
                    onClick={() => inputFile.current.click()}
                    type="button"
                >
                    Open File
                </button>
                <button
                    disabled={cpl}
                    className="mt-2 bg-brand-dark hover:bg-brand-super_dark text-white py-2 px-5 mx-8 disabled:bg-brand-light rounded-md"
                    onClick={Submit}
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
                {check ? (
                    <div>
                        <h3 className="text-brand-super_dark p-1">
                            Custom Input
                        </h3>
                        <textarea
                            className="w-full p-2 border-2 border-zinc-300 outline-none resize-none"
                            rows="5"
                            cols="10"
                            name="input"
                            onChange={(e) => setInput(e.target.value)}
                        ></textarea>
                    </div>
                ) : (
                    <div className="hidden"></div>
                )}
            </div>

            {output ? (
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
                        <h3 className="text-zinc-500 p-1 font-bold">Ouput</h3>
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
            ) : (
                <div className="hidden"></div>
            )}
        </div>
    );
};

export default Practice;
