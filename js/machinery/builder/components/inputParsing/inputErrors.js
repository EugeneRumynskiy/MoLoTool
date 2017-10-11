var inputErrors = (function () {
    var _fileName = "inputErrors",

        _errorLog,
        _commonErrors,

        _seqRegExp,

        _maxUnexpectedCharToShow;


    var create = function (regExp) {
        _errorLog = {
            "sequenceCountExceeded": 0,
            "motifListIsEmpty": false,
            "checkSequenceIsFalse": false
        };

        _commonErrors = {
            "motifListIsEmpty": "The TFBS model list is empty. Please pre-select a desired set" +
                " of TFBS models by searching the interactive catalogue.<br><br>",
            "sequenceCountExceeded": "Too many sequences (" +
                getRedundantSequenceCount() + ") submitted, please input " +
                resultTabsStates.getTabIdRange().max + " or less.<br><br>",
            "checkSequenceIsFalse": "Invalid characters.<br><br>"
        };

        _seqRegExp = regExp;

        _maxUnexpectedCharToShow = 5;
    };


    var getErrorOutput = function () {
        var errorOutput = "",
            errorStack = getStack();

        for(var i = 0; i < errorStack.length; i++) {
            errorOutput += getErrorString(errorStack[i], i);
        }

        return errorOutput;
    };


    var getErrorString = function (errorCase, errorIndex) {
        return "<p>"
            + errorIndex + ". "
            + "Unexpected sequence characters: '" +  getUnexpectedCharactersToShow(errorCase[0]) + "'"
            + ". At position: " + errorCase.index
            + "</p>";
    };


    var getUnexpectedCharactersToShow = function (rawUnexpectedCharacters) {
        if (rawUnexpectedCharacters.length > _maxUnexpectedCharToShow) {
            return rawUnexpectedCharacters.slice(0, _maxUnexpectedCharToShow) + "...";
        } else {
            return rawUnexpectedCharacters;
        }
    };


    var getCommonErrors = function () {
        return _commonErrors;
    };


    var clearLog = function () {
        _errorLog["sequenceCountExceeded"] = 0;
        _errorLog["motifListIsEmpty"] = false;
        _errorLog["checkSequenceIsFalse"] = false;
    };


    var addToLog = function (event) {
        if (event === "sequenceCountExceeded") {
            increaseRedundantSequenceCount();
        } else if (event === "motifListIsEmpty") {
            setMotifListError();
        } else if (event.title === "checkSequenceIsFalse") {
            setCheckSequenceError(event);
        }
    };


    var increaseRedundantSequenceCount = function () {
        _errorLog["sequenceCountExceeded"] += 1;
    };


    var getRedundantSequenceCount = function () {
        return _errorLog["sequenceCountExceeded"];
    };


    var setMotifListError = function () {
        _errorLog["motifListIsEmpty"] = true;
    };


    var getMotifListError = function () {
        return _errorLog["motifListIsEmpty"];
    };


    var setCheckSequenceError = function (event) {
        if (_errorLog["checkSequenceIsFalse"] === false) {
            _errorLog["checkSequenceIsFalse"] = event.sequence;
        }
    };


    var getCheckSequenceError = function () {
        return _errorLog["checkSequenceIsFalse"];
    };


    var getErrorState = function (errorName) {
        if (errorName === "sequenceCountExceeded") {
            return (getRedundantSequenceCount() !== 0) ? getMessageToShow(errorName) : "";
        } else if (errorName === "motifListIsEmpty") {
            return (getMotifListError() !== false) ? getMessageToShow(errorName) : "";
        } else if (errorName === "checkSequenceIsFalse") {
            return (getCheckSequenceError() !== false) ? "getMessageToShow(errorName)" : "";
        }

    };


    var getMessageToShow = function (event) {
        if (event === "sequenceCountExceeded") {
            _commonErrors["sequenceCountExceeded"] = "Too many sequences (" +
                (getRedundantSequenceCount() + resultTabsStates.getTabIdRange().max) + ") submitted, please input " +
                resultTabsStates.getTabIdRange().max + " or less.<br><br>";
        }

        var commonErrors = getCommonErrors();

        if (commonErrors.hasOwnProperty(event)) {
            return commonErrors[event];
        }   else {
            return "Undefined error";
        }
    };


    var checkErrors = function () {
        return getErrorState("sequenceCountExceeded") +
            getErrorState("motifListIsEmpty") +
            getErrorState("checkSequenceIsFalse");
    };



    var showErrors = function () {
        console.log(_errorLog);

        var content = checkErrors().trim();

        if (content !== "") {
            $(".nav #motif-search").qtip({
                //overwrite: false, // Make sure the tooltip won't be overridden once created
                content: {
                    text: content,
                    title: {
                        text: 'Warning.'
                    }
                },
                style: {
                    tip: {
                        corner: true
                    },
                    classes: 'qtip-dark qtip-rounded'

//                    classes: 'qtip-tipsy qtip-shadow'
                },
                position: {
                    my: 'top left',  // Position my top left...
                    at: 'bottom left', // at the bottom right of...
                    adjust: {
                        y: 5,
                        x: -25
                    }
                },
                show: {
                    event: false,
                    delay: 100,
                    //event: event.type, // Use the same show event as the one that triggered the event handler
                    ready: true // Show the tooltip as soon as it's bound, vital so it shows up the first time you hover!
                },
                hide: {
                    event: "click unfocus"
                }
            });
        }

        return ((getErrorState("sequenceCountExceeded") + getErrorState("checkSequenceIsFalse")) === "");
    };


    return {
        create: create,

        clearLog: clearLog,
        addToLog: addToLog,
        showErrors: showErrors
    }
}());