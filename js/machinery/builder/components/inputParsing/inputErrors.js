var inputErrors = (function () {
    var _fileName = "inputErrors",

        _commonErrors,

        _errors,

        _seqRegExp,

        _maxUnexpectedCharToShow;


    var create = function (regExp) {
        initErrors();

        _seqRegExp = regExp;
        _maxUnexpectedCharToShow = 5;
    };


    var initErrors = function () {
        _errors = {
            "motifListIsEmpty" : {
                "status": false,
                "value": false,
                "message": "The TFBS model list is empty. Please pre-select a desired set" +
                " of TFBS models by searching the interactive catalogue.<br><br>"
            },
            "sequenceListIsEmpty" : {
                "status": false,
                "value": false,
                "message": "No sequences found.<br><br>"
            },
            "checkSequenceIsFalse" : {
                "status": false,
                "value": false,
                "message": "Invalid characters.<br><br>"
            },
            "sequenceCountExceeded" : {
                "status": false,
                "value": false,
                "message": ["Too many sequences submitted (", "), please input ", " or less.<br><br>"]
            }
        };

        console.log(_errors);
    };

    
    var clearErrorStatus = function () {
        for (var error in _errors) {
            if (_errors.hasOwnProperty(error)) {
                _errors[error].status = false;
            }
        }
    };


    var addToLog = function (event) {
        if (event === "sequenceListIsEmpty") {
            _errors["sequenceListIsEmpty"].status = true;
        } else if (event === "motifListIsEmpty") {
            _errors["motifListIsEmpty"].status = true;
        } else if (event.title === "checkSequenceIsFalse") {
            if (_errors["checkSequenceIsFalse"].status === false) {
                _errors["checkSequenceIsFalse"].status = true;
                _errors["checkSequenceIsFalse"].value = event;
            }
        } else if (event === "sequenceCountExceeded") {
            if (_errors["sequenceCountExceeded"].status === false) {
                _errors["sequenceCountExceeded"].status = true;
                _errors["sequenceCountExceeded"].value = 1;
            } else {
                _errors["sequenceCountExceeded"].value += 1;
            }
        }
    };


    var checkErrors = function () {
        var errorSequence = ["sequenceListIsEmpty", "sequenceCountExceeded",
            "motifListIsEmpty", "checkSequenceIsFalse"],
            errorString = "";

        for(var i = 0, error; i < errorSequence.length; i++) {
            error = _errors[errorSequence[i]];
            if (error.status === true) {
                errorString += getMessageToShow(errorSequence[i]);
            }
        }
        return errorString;
    };


    var getMessageToShow = function (errorName) {
        if (_errors.hasOwnProperty(errorName)) {
            var error = _errors[errorName];

            if (errorName === "sequenceCountExceeded") {
                console.log((error.value + resultTabsStates.getTabIdRange().max));
                return error.message[0] +
                    (error.value + resultTabsStates.getTabIdRange().max) +
                    error.message[1] + (resultTabsStates.getTabIdRange().max) +
                    error.message[2];
            } else if (errorName === "checkSequenceIsFalse"){
                return getCheckSequenceIsFalseMessage(error.value);
            } else {
                return error.message;
            }

        }   else {
            return "Undefined error";
        }
    };


    var getCheckSequenceIsFalseMessage = function (errorValue) {
        return "Invalid characters " + getUnexpectedCharactersToShow(errorValue.sequence[0]) +
            " in sequence #" + errorValue.sequenceNo + ".<br><br>";
    };


    var getUnexpectedCharactersToShow = function (rawUnexpectedCharacters) {
        if (rawUnexpectedCharacters.length > _maxUnexpectedCharToShow) {
            return '"' + rawUnexpectedCharacters.slice(0, _maxUnexpectedCharToShow) + "..." + '"';
        } else {
            return '"' + rawUnexpectedCharacters + '"';
        }
    };



    var showErrors = function () {
        console.log(_errors);

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
                    classes: 'qtip-dark qtip-rounded qtip-shadow'

                //classes: 'qtip-tipsy qtip-shadow'
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

        return ((_errors["sequenceCountExceeded"].status || _errors["checkSequenceIsFalse"]) === false);
    };


    return {
        create: create,

        clearErrorStatus: clearErrorStatus,
        addToLog: addToLog,
        showErrors: showErrors
    }
}());