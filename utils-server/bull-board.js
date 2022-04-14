const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const serverAdapter = new ExpressAdapter();
const compileRequestQueue = require("../workers/compileRequestQueue");
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullAdapter(compileRequestQueue)],
    serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/admin/redis-manager");

module.exports = serverAdapter;
