var motifPickerButtons = (function () {
    var _fileName = "motifPickerButtons",

        _currentState,
        _nextState;


    var create = function () {
        _currentState = {};
        _nextState = {};

        _nextState["textarea"] = getStatesObject(["sequence-input", "title-input"]);
        _nextState["inputView"] = getStatesObject(["hidden", "flattened", "full-screen"]);

        setButtons();
    };


    var getStatesObject = function (states) {
        var statesObject = {};

        if ((states === undefined) || (states.length < 2)) {
            errorHandler.logError({"fileName": _fileName, "message": "getStatesObject are undefined"});
        } else {
            for (var i = 0; i < states.length - 1; i++) {
                statesObject[states[i]] = states[i + 1];
            }

            i = states.length - 1;
            statesObject[states[i]] = states[0];
        }

        return statesObject;
    };


    var getCurrentState = function (target) {
        return _currentState[target];
    };


    var setCurrentStateTo = function (newState, target) {
        _currentState[target] = newState;
    };


    var getNextState = function (currentState, target) {
        if (!(currentState in _nextState[target])) {
            errorHandler.logError({"fileName": _fileName, "message": "getNextState, currentState not in _nextState"});
        }
        return _nextState[target][currentState];
    };


    var setButtons = function () {
        setSwitchViewButton();
        setSwitchInputButton();
    };


    var setSwitchViewButton = function () {
        var $button = $("#change-sequence-view"),
            currentState = "flattened";

        setCurrentStateTo(currentState, "inputView");
        $button.children(".icon").html("View: " + currentState);

        $button.on('click', function(event) {
            event.preventDefault();
            switchViewToNextState($(this));
        });
    };


    var switchViewToNextState = function ($button) {
        var currentInputState = getCurrentState("textarea"),
            $target = $("#" + currentInputState),

            currentViewState = getCurrentState("inputView"),
            nextState = getNextState(currentViewState, "inputView");

        $target.removeClass(currentViewState);
        $target.addClass(nextState);

        setCurrentStateTo(nextState, "inputView");
        $button.children(".icon").html("View: " + nextState);
    };


    var setSwitchInputButton = function () {
        var $button = $("#show-title-button"),
            currentState = "sequence-input";

        setCurrentStateTo(currentState, "textarea");
        $("#title-input").addClass("hidden");
        $button.children(".icon").html("Input: " + currentState);


        $button.on('click', function(event) {
            event.preventDefault();
            switchInputToNextState($(this));
        });
    };


    var switchInputToNextState = function ($button) {
        var currentInputState = getCurrentState("textarea"),
            $target = $("#" + currentInputState);
        $target.addClass("hidden");

        var nextInputState = getNextState(currentInputState, "textarea");
        $target = $("#" + nextInputState);
        $target.removeClass("hidden flattened full-screen");
        $target.addClass(getCurrentState("inputView"));

        setCurrentStateTo(nextInputState, "textarea");

        $button.children(".icon").html("Input: " + nextInputState);
    };


    return {
        create: create
    };
}());
/**
 * Created by swm on 06.07.17.
 */
