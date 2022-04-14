const Queue = require("bull");
const compileRequestQueue = new Queue("Compile", process.env.REDIS_CONNECTION);
const Compile = require("../utils-server/compiler");

compileRequestQueue.process(async (job, done) => {
    try {
        const data = await Compile(job.data);
        done(null, data);
    } catch (err) {
        done(err);
    }
});

module.exports = compileRequestQueue;
