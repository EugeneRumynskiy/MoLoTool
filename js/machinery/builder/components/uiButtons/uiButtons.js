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
        helpButton.init();

        showMoreButton.init();
        collectionSettingsButton.init(collectionSwitchCallback);
    };


    var resetInterface = function () {
        clearTabsList();
        clearChosenMotifList();
        clearSearchInput();
        clearSequenceInput();
        clearScrollPosition();

        pSlider.setDefaultValues();

        resetButtons();
    };


    var resetButtons = function () {
        showTableButton.reset();
        switchComparisonModeButton.reset();

        inputMethodButton.reset();
        showInputButton.reset();
        zoomButton.reset();

        helpButton.reset();

        showMoreButton.reset();
        collectionSettingsButton.reset();
    };

    ///Support Functions

    var generateContent = function (mode) {
        return "<span class=\"icon icon-medium\">"+ mode.title + "</span>" +
            "<i class=\"material-icons md-dark\">" + mode.icon + "</i>\n";
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


    var clearScrollPosition = function () {
        $("html").scrollTop(0);
    };


    return {
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