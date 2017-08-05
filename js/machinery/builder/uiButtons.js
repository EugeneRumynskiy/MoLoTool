var uiButtons = (function () {
    var _fileName = "uiButtons",

        _eventHandler = function() {},
        _inputMethod = "";


    var create = function (eventHandler, inputCallback) {
        setEventHandlerTo(eventHandler);
        setupButtons(inputCallback);
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function (event) {
        _eventHandler(event);
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
        buildOpenSequenceButton();

        buildClearButton();
        buildDemoButton(inputCallback);
        buildHelpButton();
    };


    ///Controls Buttons

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
                "disabled":   {"title":"Open table ", "icon": "visibility_off"},
                "active":   {"title":"Hide table ", "icon": "visibility"}
            },
            defaultMode = "disabled",

            $button = $("#open-table-button"),
            $target = $("#motif-table-cmp");


        var switchMode = function () {
            var newMode = ($target.hasClass("disabled")) ? "active" : "disabled";
            if (newMode === "disabled") {
                $target.addClass("disabled");
                handleEvent("clearTable");
            } else {
                $target.removeClass("disabled");
                handleEvent();
            }

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));

            return newMode;
        };


        var init = function () {
            if (defaultMode === "disabled") {
                $target.addClass("disabled");
            } else {
                $target.removeClass("disabled");
            }

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


    ///Sequence-Input Buttons

    var buildOpenInputButton = function () {
        var getSettingsFor = {
                "hidden":   {"title":"Open input ", "icon": "visibility_off"},
                "visible":   {"title":"Hide input ", "icon": "visibility"}
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
                "rewrite": {"title":"Mode:overwrite ", "icon": "autorenew"},
                "stack":   {"title":"Mode:add ", "icon": "add"}
            },
            defaultMode = "stack",

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


    var buildOpenSequenceButton = function () {
        var getSettingsFor = {
                "hidden":   {"title":"Show sequences ", "icon": "visibility_off"},
                "visible":   {"title":"Hide sequences ", "icon": "visibility"}
            },
            defaultMode = "visible",

            $button = $("#manual-seq-input").find(".open-sequence"),
            $target = $("#manual-seq-input").find("textarea");


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


    ///Top-Nav Buttons

    var buildClearButton = function () {
        var getSettingsFor = {
                "default":   {"title":"Reset ", "icon": "delete_sweep"}
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
                    clearSequenceInput();
                });
        };

        init();
    };


    var buildDemoButton = function (inputCallback) {
        var getSettingsFor = {
                "showDemo":   {"title":"Demo ", "icon": "insert_emoticon"}
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


    var buildHelpButton = function () {
        var getSettingsFor = {
                "default":   {"title":"Help ", "icon": "info_outline"}
            },
            defaultMode = "default",
            $button = $("#help-button");

        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    console.log("Help\n");
                });
        };

        init();
    };


    ///Support Functions

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


    var clearSequenceInput = function () {
        $("#manual-seq-input").find("textarea").val("");
    };


    return {
        create: create
    };
} ());