var inputErrors = (function () {
    var _fileName = "inputErrors",
        _parsingErrorsStack,
        _commonErrors,

        _seqRegExp,

        _maxUnexpectedCharToShow,
        _dialog;


    var create = function (regExp) {
        _parsingErrorsStack = [];
        _commonErrors = {
            "motifListIsEmpty": "The model list is empty. Please select TFBS models" +
                " using the search field.",
            "sequenceCountExceeded": "Maximum sequence count (10) exceeded."
        };

        _seqRegExp = regExp;

        _maxUnexpectedCharToShow = 5;

        _dialog = $( "#error-dialog" );
        _dialog.dialog({
                autoOpen: false,
                closeOnEscape: true,
                resizable: false,

                title: "Input warning",
                minWidth: 580,
                minHeight: 200,
                maxHeight: 500,
            buttons: [
                {
                    text: "ok",
                    click: function() {
                        $( this ).dialog( "close" );
                    }

                    // Uncommenting the following line would hide the text,
                    // resulting in the label being used as a tooltip
                    //showText: false
                }
            ]
            });
    };


    var getErrorStack = function () {
        return _parsingErrorsStack;
    };


    var getCommonErrors = function () {
        return _commonErrors;
    };


    var getErrorOutput = function () {
        var errorOutput = "",
            errorStack = getErrorStack();

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


    var getMessageToShow = function (event) {
        var commonErrors = getCommonErrors();

        if (commonErrors.hasOwnProperty(event)) {
            return commonErrors[event];
        }   else {
            return "Undefined error";
        }
    };


    var getUnexpectedCharactersToShow = function (rawUnexpectedCharacters) {
        if (rawUnexpectedCharacters.length > _maxUnexpectedCharToShow) {
            return rawUnexpectedCharacters.slice(0, _maxUnexpectedCharToShow) + "...";
        } else {
            return rawUnexpectedCharacters;
        }
    };


    var clearStack = function () {
        _parsingErrorsStack.length = 0;
    };


    var addToStack = function (sequence) {
        console.log(sequence.match(_seqRegExp));
        _parsingErrorsStack.push(sequence.match(_seqRegExp));
    };


    var showErrors = function (event) {
        if (event !== undefined) {
            var content = getMessageToShow(event);

            console.log(event);
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
                    classes: 'qtip-tipsy qtip-shadow'
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
                hide: 'unfocus'
            });
        } else {
            if (getErrorStack().length !== 0) {
                showStack();
            }
        }
    };


    var showStack = function () {
        var errorString = getErrorOutput();

        _dialog
            .html(errorString)
            .dialog( "open" );
    };


    return {
        create: create,

        clearStack: clearStack,
        addToStack: addToStack,
        showErrors: showErrors
    }
}());