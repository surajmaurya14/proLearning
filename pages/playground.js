import { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
    require("codemirror/mode/xml/xml");
    require("codemirror/mode/javascript/javascript");
    require("codemirror/mode/css/css");
}

const Playground = () => {
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [srcDoc, setSrcDoc] = useState("");

    const handleSubmit = () => {
        setSrcDoc(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            <style>
            ${css}
            </style>
        </head>
        <body>
            ${html}
            <script type="text/javascript">
            ${js}
            </script>
        </body>
        </html>
        `);
    };

    const handleChange = (editor, data, value) => {
        if (file.name == "HTML") {
            setHtml(value);
        } else if (file.name == "CSS") {
            setCss(value);
        } else {
            setJs(value);
        }
    };

    const files = {
        "script.js": {
            name: "JS",
            language: "javascript",
            value: js,
        },
        "style.css": {
            name: "CSS",
            language: "css",
            value: css,
        },
        "index.html": {
            name: "HTML",
            language: "xml",
            value: html,
        },
    };

    const [fileName, setFileName] = useState("index.html");
    const file = files[fileName];

    return (
        <div>
            <div className="flex bg-slate-900 text-[#fafafa] h-14 items-center">
                <button
                    className="px-4 text-brand-super_dark disabled:text-brand"
                    disabled={fileName === "index.html"}
                    onClick={() => setFileName("index.html")}
                    type="button"
                >
                    HTML
                </button>
                <button
                    className="px-4 text-brand-super_dark disabled:text-brand"
                    disabled={fileName === "style.css"}
                    onClick={() => setFileName("style.css")}
                    type="button"
                >
                    CSS
                </button>
                <button
                    className="px-4 text-brand-super_dark disabled:text-brand"
                    disabled={fileName === "script.js"}
                    onClick={() => setFileName("script.js")}
                    type="button"
                >
                    JS
                </button>
                <button
                    className="px-4 text-brand-extra_light disabled:text-brand cursor-pointer active:text-brand"
                    onClick={handleSubmit}
                    type="button"
                >
                    Run
                </button>
            </div>

            <div className="flex flex-col lg:flex-row box-border border-4 h-full">
                <div className="w-full lg:w-7/12">
                    <CodeMirror
                        onBeforeChange={handleChange}
                        value={file.value}
                        className="h-[84vh]"
                        options={{
                            lineWrapping: true,
                            theme: "material",
                            mode: file.language,
                            lineNumbers: true,
                        }}
                    />
                </div>

                <div className="h-[84vh] w-full lg:w-5/12">
                    <iframe
                        className="w-full h-full"
                        title="output"
                        srcDoc={srcDoc}
                        sandbox="allow-scripts"
                        frameBorder="0"
                    />
                </div>
            </div>
        </div>
    );
};
export default Playground;
