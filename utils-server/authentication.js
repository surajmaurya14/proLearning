const bcrypt = require("bcrypt");
const saltRounds = 12;

exports.hashPassword = async (password) => {
    try {
        let salt = await bcrypt.genSalt(saltRounds);
        let hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        // console.error(`Error: ${err}`);
        toast.error("Error");
        return;
    }
};

exports.comparePassword = async (password, hash) => {
    try {
        return bcrypt.compare(password, hash);
    } catch (err) {
        // console.error(`Error: ${err}`);
        toast.error("Error");
        return;
    }
};
