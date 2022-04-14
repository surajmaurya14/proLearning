const fs = require("fs");
const ejs = require("ejs");

const readHTML = async (path, options) => {
    try {
        const str = await ejs.renderFile(path, options);
        return str;
    } catch (err) {
        // console.error(`Error: ${err}`);
        toast.error("Error");
        return;
    }
};

module.exports = readHTML;
