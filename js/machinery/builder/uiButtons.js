var uiButtons = (function () {
    var _fileName = "uiButtons",

        _eventHandler = function() {},
        _inputMethod = "";


    var create = function (eventHandler, inputCallback) {
        setEventHandlerTo(eventHandler);
        setEventHandlerTo(eventHandler);
        setupButtons(inputCallback);
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function () {
        _eventHandler();
    };


    var setInputMethodTo = function (newInputMethod) {
        _inputMethod = newInputMethod
    };


    var getInputMethod = function () {
        return _inputMethod;
    };


    var setupButtons = function (inputCallback) {
        buildSwitchComparisonModeButton();
        buildShowTableButton();
        buildOpenInputButton();

        buildAddSequenceButton(inputCallback);
        buildInputMethodButton();

        buildClearButton();
        buildDemoButton(inputCallback);
        buildAboutButton();
    };


    var buildSwitchComparisonModeButton = function () {
        var getSettingsFor = {
                "Single":   {"title":"Change mode ", "icon": "select_all"},
                "Multiply":   {"title":"Change mode ", "icon": "format_list_bulleted"}
            },
            defaultMode = comparisonMode.getDefaultComparisonMode(),

            $button = $("#change-mode-button");


        var switchMode = function () {
            var newMode = comparisonMode.switchComparisonMode();

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };


        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        init();
    };


    var buildShowTableButton = function () {
        var getSettingsFor = {
                "hidden":   {"title":"Open table ", "icon": "visibility_off"},
                "visible":   {"title":"Close table ", "icon": "visibility"}
            },
            defaultMode = "hidden",

            $button = $("#open-table-button"),
            $target = $("#motif-table-cmp");


        var switchMode = function () {
            var newMode = ($target.hasClass("hidden")) ? "visible" : "hidden";

            if (newMode === "hidden") {
                $target.addClass("hidden");
            } else {
                $target.removeClass("hidden");
                handleEvent();
            }

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));

            return newMode;
        };


        var init = function () {
            setVisibility(defaultMode, $target);

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        init();
    };


    var buildOpenInputButton = function () {
        var getSettingsFor = {
                "hidden":   {"title":"Open input ", "icon": "visibility_off"},
                "visible":   {"title":"Close input ", "icon": "visibility"}
            },
            defaultMode = "hidden",

            $button = $("#open-input-button"),
            $target = $("#manual-seq-input");


        var switchMode = function () {
            var newMode = ($target.hasClass("hidden")) ? "visible" : "hidden";
            setVisibility(newMode, $target);

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };

        var init = function () {
            setVisibility(defaultMode, $target);

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        init();
    };


    var buildAddSequenceButton = function (inputCallback) {
        var getSettingsFor = {
                "default":   {"title":"Add sequences ", "icon": "add"}
            },
            defaultMode = "default",

            $button = $("#manual-seq-input").find(".add-sequence"),
            $target = $("#manual-seq-input").find("textarea");


        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();

                    var replaceCurrent = (getInputMethod() === "rewrite");
                    inputCallback($target.val(), replaceCurrent);
                });
        };

        init();
    };


    var buildInputMethodButton = function () {
        var getSettingsFor = {
                "rewrite": {"title":"Mode:overwrite", "icon": "autorenew"},
                "stack":   {"title":"Mode:add", "icon": "add"}
            },
            defaultMode = "stack";

            $button = $("#manual-seq-input").find(".input-method");


        var switchMode = function () {
            var newMode = (getInputMethod() === "rewrite") ? "stack" : "rewrite";
            setInputMethodTo(newMode);

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };


        var init = function () {
            setInputMethodTo(defaultMode);

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        init();
    };


    var buildClearButton = function () {
        var getSettingsFor = {
                "default":   {"title":"Clear ", "icon": "delete_sweep"}
            },
            defaultMode = "default",
            $button = $("#clear-button");

        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    clearTabsList();
                    clearChosenMotifList();
                    clearSearchInput();
                });
        };

        init();
    };


    var buildDemoButton = function (inputCallback) {
        var getSettingsFor = {
                "showDemo":   {"title":"Show demo ", "icon": "insert_emoticon"}
            },
            defaultMode = "showDemo",
            $button = $("#demo-button");


        var showDemo = function () {
            clearChosenMotifList();

            $("#motif-search").val("a");
            motifSearch.applySearch();
            $("#motif-list").children().first().children().first().children().first().click();

            clearSearchInput();

            var test = inputParsing.inputTest();
            inputCallback(test, true);
        };


        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    showDemo();
                });
        };

        init();
    };


    var buildAboutButton = function () {
        var getSettingsFor = {
                "default":   {"title":"About ", "icon": "info_outline"}
            },
            defaultMode = "default",
            $button = $("#about-button");

        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    console.log("about\n");
                });
        };

        init();
    };


    var generateContent = function (mode) {
        return "<span class=\"icon icon-medium\">"+ mode.title + "</span>" +
            "<i class=\"material-icons md-dark\">" + mode.icon + "</i>\n";
    };


    var setVisibility = function (defaultMode, $target) {
        if (defaultMode === "hidden") {
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


    return {
        create: create
    };
} ());