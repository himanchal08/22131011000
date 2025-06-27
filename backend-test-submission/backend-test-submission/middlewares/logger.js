const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../request.log");

module.exports = (req, res, next) => {
    const entry = `[${new Date().toISOString()}] ${req.method} ${req.url} ${req.headers["user-agent"]}\n`;
    fs.appendFile(logFile, entry, () => {});
    next();
};
