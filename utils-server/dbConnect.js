const mongoose = require("mongoose");

const connection = async () => {
    try {
        const db = mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });

        console.log("Mongoose has established connection with Database");
        return db;
    } catch (err) {
        // console.error(`Error: ${err}`);
        toast.error("Error");
        return;
    }
};
const db = connection();
module.exports = db;
