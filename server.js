require("dotenv").config({ path: "config.env" });
const express = require("express");
const next = require("next");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const csrf = require("csurf");
const serverAdapter = require("./utils-server/bull-board");
const { getUser, isAdmin } = require("./middlewares/verification");

require("./utils-server/dbConnect");

const app = express();
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());

const logger = require("./utils-server/logger");
morgan.token("message", (req, res) => res.locals.errorMessage || "");

const getIpFormat = () =>
    process.env.NODE_ENV === "production" ? ":remote-addr - " : "";

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => logger.error(message.trim()) },
});

app.use(successHandler);
app.use(errorHandler);

// const csrfProtection = csrf({ cookie: true });

nextApp.prepare().then(() => {
    app.use(
        "/admin/redis-manager",
        getUser,
        isAdmin,
        serverAdapter.getRouter()
    );

    app.use("/api", require("./api"));

    app.all("*", (req, res) => {
        return handle(req, res);
    });

    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on ${process.env.NEXT_PUBLIC_DOMAIN}`);
    });
});
