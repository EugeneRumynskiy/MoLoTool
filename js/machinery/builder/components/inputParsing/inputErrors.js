var inputErrors = (function () {
    var _fileName = "inputErrors",
        _errorStack,
        _seqRegExp,

        _maxUnexpectedCharToShow,
        _dialog;


    var create = function (regExp) {
        _errorStack = [];

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
                maxHeight: 500
            });
    };


    var getErrorStack = function () {
        return _errorStack;
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


    var getUnexpectedCharactersToShow = function (rawUnexpectedCharacters) {
        if (rawUnexpectedCharacters.length > _maxUnexpectedCharToShow) {
            return rawUnexpectedCharacters.slice(0, _maxUnexpectedCharToShow) + "...";
        } else {
            return rawUnexpectedCharacters;
        }
    };


    var clearStack = function () {
        _errorStack.length = 0;
    };


    var addToStack = function (sequence) {
        console.log(sequence.match(_seqRegExp));
        _errorStack.push(sequence.match(_seqRegExp));
    };


    var showErrors = function (event) {
        if (event === "motifListIsEmpty") {
            _dialog
                .html("The model list is empty. Please select TFBS models" +
                    " using the search field in the top left corner.")
                .dialog( "open" );
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