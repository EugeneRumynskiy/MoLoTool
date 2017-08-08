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
        //buildOpenInputButton();

        buildAddSequenceButton(inputCallback);
        buildInputMethodButton();
        buildOpenSequenceButton();
        buildZoomButton("23px", {"top": 50, "bottom": 10});

        buildClearButton();
        buildDemoButton(inputCallback);
        buildHelpButton();

        buildShowMoreButton();
    };


    var resetButtons = function () {
        buildZoomButton("23px", {"top": 50, "bottom": 10});
    };


    ///Sequence-Input Buttons

    var buildOpenInputButton = function () {
        var getSettingsFor = {
                "hidden":   {"title":"Show input ", "icon": "visibility_off"},
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
                    if ($(event.target).html() === "Show input ") {
                        window.scrollTo(0, 0);
                    }
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
            $textarea = $("#manual-seq-input").find("textarea");


        var showTextarea = function () {
            if ($textarea.hasClass("hidden")) {
                $textarea.removeClass("hidden")
            }
        };


        var init = function () {
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();

                    showTextarea();

                    var rewriteFlag = (getInputMethod() === "rewrite");
                    inputCallback($textarea.val(), rewriteFlag);
                });
        };

        init();
    };


    var buildInputMethodButton = function () {
        var getSettingsFor = {
                "rewrite": {"title":"Mode: overwrite ", "icon": "autorenew"},
                "stack":   {"title":"Mode: stack ", "icon": "add"}
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
                    if ($(event.target).html() === "Show sequences ") {
                        window.scrollTo(0, 0);
                    }
                    switchMode();
                });
        };

        init();
    };


    var buildZoomButton = function (defaultFontSizeToSet, thresholds) {
        var $button = $("#manual-seq-input").find(".zoom-button"),
            $target = $("#result-sequences").add($("#manual-seq-input").find("textarea")),

            getSettingsFor = {
                "default":   {"title":"Font size: ", "zoomIn": "zoom_in", "zoomOut": "zoom_out"},
                "threshold": thresholds
            },
            defaultFontSize = defaultFontSizeToSet;


        var zoom = function (eventType) {
            var newFontSize = (eventType === "zoom_in") ? getNewFontSize("1px") : getNewFontSize("-1px");
            $target.css("font-size", newFontSize);
            $button
                .find("span")
                .empty()
                .html(getSettingsFor.default.title + newFontSize);
        };

        var getNewFontSize = function (deltaSize) {
            var newFontSize = calculateNewFontSize(deltaSize);
            return cutWithThresholds(newFontSize);
        };

        var calculateNewFontSize = function (deltaSize) {
            return parseFloat($target.css("font-size")) + parseFloat(deltaSize) + "px";
        };

        var cutWithThresholds = function (fontSize) {
            var value = parseFloat(fontSize),
                top = getSettingsFor.threshold.top,
                bottom = getSettingsFor.threshold.bottom;

            if (value > top)
                value =  top;
            else if (value < bottom)
                value = bottom;

            return value + "px";
        };

        var init = function () {
            defaultFontSize = cutWithThresholds(defaultFontSizeToSet);
            $target.css("font-size", defaultFontSize);

            var content =  "<span class=\"icon icon-medium\">"+ getSettingsFor.default.title + defaultFontSize + "</span>" +
                "<i class=\"material-icons md-dark\">" + getSettingsFor.default.zoomIn + "</i>\n" +
                "<i class=\"material-icons md-dark\">" + getSettingsFor.default.zoomOut + "</i>\n";

            $button
                .empty()
                .html(content)
                .on('click', function(event) {
                    event.preventDefault();

                    var eventType = $(event.target).html();
                    if (eventType === "zoom_in" || eventType === "zoom_out") {
                        zoom(eventType);
                    }
                });
        };

        init();
    };


    ///Top-Nav Buttons

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
                "disabled":   {"title":"Show table ", "icon": "visibility_off"},
                "active":   {"title":"Hide table ", "icon": "visibility"}
            },
            defaultMode = "active",

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

                    resetButtons();
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

            $("#motif-search").val("coe1");
            motifSearch.applySearch();
            $("#motif-list").children().first().children().first().children().first().click();

            clearSearchInput();
            motifSearch.applySearch();

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




    //Search Buttons

    var buildShowMoreButton = function () {
        var getSettingsFor = {
                "default":   {"title":"", "icon": "keyboard_arrow_left", "size": motifPicker.getDefaultMaxResultCount()},
                "spread":   {"title":"", "icon": "keyboard_arrow_down", "size": 100}
            },
            defaultMode = "default",

            $button = $("#show-more-button");

        var switchMode = function () {
            var newMode = (motifPicker.getMaxResultCount() === motifPicker.getDefaultMaxResultCount())
                ? "spread" : "default";
            motifPicker.setMaxResultCount(getSettingsFor[newMode].size);

            $button
                .find("i")
                .empty()
                .html(getSettingsFor[newMode].icon);

            motifSearch.applySearch();
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