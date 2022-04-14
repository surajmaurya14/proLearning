import dynamic from "next/dynamic";
import hljs from "highlight.js";

import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/monokai.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
    syntax: { highlight: (text) => hljs.highlightAuto(text).value },
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
};
const ReactQuillComponent = ({ value = "", setValue = () => {} }) => {
    return (
        <ReactQuill
            modules={modules}
            theme="snow"
            onChange={setValue}
            value={value}
        />
    );
};

export default ReactQuillComponent;
