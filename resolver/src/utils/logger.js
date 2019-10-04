const util = require('util');

global.logInfo = (operation, data) => {
    log(operation, data, "info");
};

global.logError = (operation, error) => {
    log(operation, error, "error");
};

function log(operation, params, arg) {
    if (process.env.LOG === "NO_LOG")
        return;

    switch (arg) {
        case "info":
            console.info(util.inspect({operation, params}, {showHidden: true, depth: null}));
            break;
        case "error":
            console.error(util.inspect({operation, params}, {showHidden: true, depth: null}));
            break;
    }
}