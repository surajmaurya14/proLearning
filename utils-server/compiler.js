const { c, cpp, node, python, java } = require("compile-run");

const Compile = async (options) => {
    const code = options.code;
    const input = options.input;
    const language = options.language;
    if (language == "text/x-c++src") {
        return new Promise((resolve, reject) => {
            cpp.runSource(code, { stdin: input }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }).catch((error) => {
            return error;
        });
    } else if (language == "text/x-csrc") {
        return new Promise((resolve, reject) => {
            c.runSource(code, { stdin: input }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }).catch((error) => {
            return error;
        });
    } else if (language == "text/x-java") {
        return new Promise((resolve, reject) => {
            java.runSource(code, { stdin: input }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }).catch((error) => {
            return error;
        });
    } else if (language == "text/x-cython") {
        return new Promise((resolve, reject) => {
            python.runSource(code, { stdin: input }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }).catch((error) => {
            return error;
        });
    } else if (language == "text/javascript") {
        return new Promise((resolve, reject) => {
            node.runSource(code, { stdin: input }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }).catch((error) => {
            return error;
        });
    }
};

module.exports = Compile;
