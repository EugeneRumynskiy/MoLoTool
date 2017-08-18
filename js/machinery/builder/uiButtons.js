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
        buildSwitchComparisonModeButton.init();
        buildShowTableButton.init();

        buildAddSequenceButton.init(inputCallback);

        buildInputMethodButton.init();
        buildOpenSequenceButton.init();
        buildZoomButton.init("18px", {"top": 40, "bottom": 10});

        buildClearButton.init();
        buildDemoButton.init(inputCallback);
        buildHelpButton.init();

        buildShowMoreButton.init();
    };


    var resetButtons = function () {
        buildShowTableButton.reset();
        buildSwitchComparisonModeButton.reset();

        buildInputMethodButton.reset();
        buildOpenSequenceButton.reset();
        buildZoomButton.reset();

        buildHelpButton.reset();

        buildShowMoreButton.reset();
    };


    var resetInterface = function () {
        clearTabsList();
        clearChosenMotifList();
        clearSearchInput();
        clearSequenceInput();

        resetButtons();
    };


    ///Sequence-Input Buttons

    var buildAddSequenceButton = (function () {
        var getSettingsFor = {
                "default":   {"title":"Submit sequences ", "icon": "add"}
            },
            defaultMode = "default",

            $button,
            $textarea;

        var showTextarea = function () {
            if ($textarea.hasClass("hidden")) {
                $textarea.removeClass("hidden")
            }
        };

        var init = function (inputCallback) {
            $button = $("#manual-seq-input").find(".add-sequence");
            $textarea = $("#manual-seq-input").find("textarea");

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

        return {
            init: init
        };
    }());


    var buildInputMethodButton = (function () {
        var getSettingsFor = {
                "rewrite": {"title":"Rewrite: Yes ", "icon": "autorenew"},
                "stack":   {"title":"Rewrite: No ", "icon": "add"}
            },
            defaultMode = "stack",

            $button;


        var switchMode = function () {
            var newMode = (getInputMethod() === "rewrite") ? "stack" : "rewrite";
            setInputMethodTo(newMode);

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };


        var init = function () {
            $button = $("#manual-seq-input").find(".input-method");

            setInputMethodTo(defaultMode);

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        var reset = function () {
            var newMode = (getInputMethod() === "rewrite") ? "stack" : "rewrite";
            if (newMode === defaultMode) {
                switchMode();
            }
        };

        return {
            init: init,
            reset: reset
        };
    }());


    var buildOpenSequenceButton = (function () {
        var getSettingsFor = {
                "hidden":   {"title":"Show sequences ", "icon": "visibility_off"},
                "visible":   {"title":"Hide sequences ", "icon": "visibility"}
            },
            defaultMode = "visible",

            $button,
            $target;

        var switchMode = function () {
            var newMode = ($target.hasClass("hidden")) ? "visible" : "hidden";
            setVisibility(newMode, $target);

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };

        var init = function () {
            $button = $("#manual-seq-input").find(".open-sequence");
            $target = $("#manual-seq-input").find("textarea");

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

        var reset = function () {
            var newMode = ($target.hasClass("hidden")) ? "visible" : "hidden";
            if (newMode === defaultMode) {
                switchMode();
            }
        };

        return {
            init: init,
            reset: reset
        };
    } ());


    var buildZoomButton = (function () {
        var $button,
            $target,

            getSettingsFor = {
                "default":   {"title":"Font size: ", "zoomIn": "zoom_in", "zoomOut": "zoom_out"},
                "threshold": ""
            },
            defaultFontSize,
            lineHeightConst = 1.6;

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
            if (value > top) {
                value = top;
            } else if (value < bottom) {
                value = bottom;
            }

            return value + "px";
        };

        var getLineHeight = function (fontSize) {
            return parseFloat(fontSize) * lineHeightConst + "px";
        };

        var zoom = function (eventType) {
            var newFontSize = (eventType === "zoom_in") ? getNewFontSize("1px") : getNewFontSize("-1px");
            $target.css({"font-size": newFontSize, "line-height": getLineHeight(newFontSize)});
            resultTabs.updateMarginForCurrentTab();
            $button
                .find("span")
                .empty()
                .html(getSettingsFor.default.title + newFontSize);
        };

        var init = function (defaultFontSizeToSet, thresholds) {
            $button = $("#manual-seq-input").find(".zoom-button");
            $target = $("#result-sequences").add($("#manual-seq-input").find("textarea"));
            getSettingsFor["threshold"] = thresholds;
            defaultFontSize = cutWithThresholds(defaultFontSizeToSet);

            $target.css({"font-size": defaultFontSize, "line-height": getLineHeight(defaultFontSize)});
            resultTabs.updateMarginForCurrentTab();

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

        var reset = function () {
            $target.css({"font-size": defaultFontSize, "line-height": getLineHeight(defaultFontSize)});
            resultTabs.updateMarginForCurrentTab();
            $button
                .find("span")
                .empty()
                .html(getSettingsFor.default.title + defaultFontSize);
        };

        return {
            init: init,
            reset: reset
        }
    }());


    ///Top-Nav Buttons

    var buildSwitchComparisonModeButton = (function () {
        var getSettingsFor = {
                "Single":   {"title":"Change mode ", "icon": "select_all"},
                "Multiply":   {"title":"Change mode ", "icon": "format_list_bulleted"}
            },
            defaultMode,
            $button;


        var switchMode = function () {
            var newMode = comparisonMode.switchComparisonMode();

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };


        var init = function () {
            defaultMode = comparisonMode.getDefaultComparisonMode();
            $button = $("#change-mode-button");

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        var reset = function () {
            if (comparisonMode.getCurrentMode() !== defaultMode) {
                switchMode();
            }
        };

        return {
            init: init,
            reset: reset
        };
    }());


    var buildShowTableButton = (function () {
        var getSettingsFor = {
                "disabled":   {"title":"Show table ", "icon": "visibility_off"},
                "active":   {"title":"Hide table ", "icon": "visibility"}
            },
            defaultMode = "active",

            $button,
            $target;


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
            $button = $("#open-table-button");
            $target = $("#motif-table-cmp");

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

        var reset = function () {
            var newMode = ($target.hasClass("disabled")) ? "active" : "disabled";
            if (newMode === defaultMode) {
                switchMode();
            }
        };

        return {
            init: init,
            reset: reset
        };
    } ());


    var buildClearButton = (function () {
        var getSettingsFor = {
                "default":   {"title":"Reset ", "icon": "delete_sweep"}
            },
            defaultMode = "default",
            $button;

        var init = function () {
            $button = $("#clear-button");
            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    resetInterface();
                });
        };

        return {
            init: init
        };
    }());


    var buildDemoButton = (function () {
        var getSettingsFor = {
                "showDemo":   {"title":"Demo ", "icon": "insert_emoticon"}
            },
            defaultMode = "showDemo",
            $button,
            withInputCallback;


        var showDemo = function () {
            $("#motif-search").val("coe1");
            motifSearch.applySearch();
            $("#motif-list").children().first().children().first().children().first().click();

            clearSearchInput();
            motifSearch.applySearch();

            var test = inputParsing.inputTest();
            withInputCallback(test, true);
        };

        var init = function (inputCallback) {
            $button = $("#demo-button");
            withInputCallback = inputCallback;

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    resetInterface();
                    showDemo();
                });
        };

        return {
            init:init
        };
    }());


    var buildHelpButton = (function () {
        var getSettingsFor = {
                "hidden":   {"title":"Help ", "icon": "info_outline"},
                "visible":   {"title":"Help ", "icon": "info_outline"}
            },
            defaultMode = "hidden",

            $button,
            $help,
            $interface;

        var setVisibilityToMode = function (newMode) {
            if (newMode === "hidden") {
                $help.addClass("hidden");
                $interface.removeClass("hidden");
            } else {
                $help.removeClass("hidden");
                $interface.addClass("hidden");
            }
        };

        var switchMode = function () {
            var newMode = ($help.hasClass("hidden")) ? "visible" : "hidden";

            setVisibilityToMode(newMode);

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));

            return newMode;
        };

        var init = function () {
            $button = $("#help-button");
            $help = $("#help-cmp");
            $interface = $(".interface-area");

            setVisibilityToMode(defaultMode);

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        var reset = function () {
            var newMode = ($help.hasClass("hidden")) ? "visible" : "hidden";
            if (newMode === defaultMode) {
                switchMode();
            }
        };

        return {
            init: init,
            reset: reset
        };
    } ());


    //Search Buttons

    var buildShowMoreButton = (function () {
        var getSettingsFor = {
                "default":   {"title":"", "icon": "expand_more", "size": 0},
                "spread":   {"title":"", "icon": "expand_less", "size": 100}
            },
            defaultMode = "default",

            $button,
            $target;

        var switchMode = function () {
            var newMode = (motifPicker.getMaxResultCount() === motifPicker.getDefaultMaxResultCount())
                ? "spread" : "default";
            $button
                .find("i")
                .empty()
                .html(getSettingsFor[newMode].icon);

            if (newMode === "spread") {
                $target.addClass("spread");
            } else {
                $target.removeClass("spread");
            }

            motifPicker.setMaxResultCount(getSettingsFor[newMode].size);
            motifSearch.applySearch();
        };

        var init = function () {
            getSettingsFor["default"].size = motifPicker.getDefaultMaxResultCount();
            $button = $("#show-more-button");
            $target = $("#motif-list");

            $button
                .empty()
                .html(generateContent(getSettingsFor[defaultMode]))
                .on('click', function(event) {
                    event.preventDefault();
                    switchMode();
                });
        };

        var reset = function () {
            var newMode = (motifPicker.getMaxResultCount() === motifPicker.getDefaultMaxResultCount())
                ? "spread" : "default";
            if (newMode === defaultMode) {
                switchMode()
            }
        };

        return {
            init: init,
            reset: reset
        }
    }());

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


    return {
        create: create
    };
} ());