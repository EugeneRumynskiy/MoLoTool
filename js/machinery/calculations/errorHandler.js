/**
 * Created by Sing on 12.11.2016.
 */

var errorHandler = (function () {
    var _fileName = "errorHandler";

    var logError = function(error) {
        console.log("fileName: " + error["fileName"] + "   err: " + error["message"] + "   line: " + error.lineNumber + "\n");
        return 0;
    };

    return {
        logError: logError
    };
}());