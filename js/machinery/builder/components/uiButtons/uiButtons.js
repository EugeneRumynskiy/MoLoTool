var uiButtons = (function () {
    var _fileName = "uiButtons",

        _eventHandler = function() {},
        _inputMethod = "";


    var create = function (eventHandler, inputCallback, collectionSwitchCallback) {
        setEventHandlerTo(eventHandler);
        setupButtons(inputCallback, collectionSwitchCallback);
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function (event) {
        _eventHandler(event);
    };


    var setInputMethod = function (newInputMethod) {
        _inputMethod = newInputMethod
    };


    var getInputMethod = function () {
        return _inputMethod;
    };


    var setupButtons = function (inputCallback, collectionSwitchCallback) {
        switchComparisonModeButton.init();
        showTableButton.init();

        submitButton.init(inputCallback);

        inputMethodButton.init();
        showInputButton.init();
        zoomButton.init("18px", {"top": 40, "bottom": 10});

        clearButton.init();
        demoButton.init(inputCallback);
        tutorialButton.init();
        helpButton.init();
        homeButton.init();

        showMoreButton.init();
        collectionSettingsButton.init(collectionSwitchCallback);
    };


    var resetInterface = function (keep) {
        clearTabsList();
        clearChosenMotifList();
        clearSearchInput();
        clearSequenceInput();

        if (keep.scrollPosition !== true) {
            setScrollPosition("top");
        }

        pSlider.setDefaultValues();

        resetButtons(keep);
    };


    var resetButtons = function (keep) {
        showTableButton.reset();
        switchComparisonModeButton.reset();

        inputMethodButton.reset();
        if (keep.buttons["showInputButton"] !== true) {
            showInputButton.reset();
        }
        zoomButton.reset();

        tutorialButton.reset();
        helpButton.reset();

        showMoreButton.reset();
        collectionSettingsButton.reset();
    };

    ///Support Functions

    var generateContent = function (mode) {
        var content = "<span class=\"icon icon-medium\">"+ mode.title + "</span>" +
            "<i class=\"material-icons md-dark\">" + mode.icon + "</i>\n";

      /*  if (mode.hasOwnProperty("tooltip") && mode["tooltip"] !== undefined) {
            content = '<span class="tooltiptext">' + mode["tooltip"] + '</span>' + content;
        }*/

        return content;
    };


    var setVisibility = function (newMode, $target) {
        if (newMode === "hidden") {
            $target.addClass("hidden");
        } else {
            $target.removeClass("hidden");
        }
    };


    var clearChosenMotifList = function () {
        $(".chosen-motif").find(".close").trigger("click");
    };


    var clearTabsList = function () {
        $("#result-tabs").find(".close").trigger("click");
    };


    var clearSearchInput = function () {
        $("#motif-search").val("");
    };


    var clearSequenceInput = function () {
        $("#manual-seq-input").find("textarea").val("");
    };


    var setScrollPosition = function (scrollTo) {
        if (scrollTo === "top") {
            scrollTop();
        } else if (scrollTo === "bottom") {
            scrollBottom();
        }
    };


    var scrollTop = function () {
        var $window = $("html");
        $window.scrollTop(0);
    };


    var scrollBottom = function () {
        var $window = $("html"),
            height = $window.scrollTop() + $window.height();
        $window.scrollTop(height);
    };




    return {
        setScrollPosition: setScrollPosition,
        clearSearchInput: clearSearchInput,
        resetInterface: resetInterface,
        setVisibility: setVisibility,
        setInputMethod: setInputMethod,
        getInputMethod: getInputMethod,
        handleEvent: handleEvent,

        generateContent: generateContent,

        create: create
    };
} ());