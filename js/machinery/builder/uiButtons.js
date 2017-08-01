var uiButtons = (function () {
    var _fileName = "uiButtons",

        _eventHandler = function() {};


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


    var setupButtons = function (inputCallback) {
        buildSwitchComparisonModeButton();
        buildShowTableButton();
        buildOpenInputButton();

        buildAddSequenceButton(inputCallback);
        buildInputMethodButton();
    };


    var buildSwitchComparisonModeButton = function () {
        var getSettingsFor = {
                "Single":   {"title":"Change Mode ", "icon": "select_all"},
                "Multiply":   {"title":"Change Mode ", "icon": "format_list_bulleted"}
            },
            defaultMode = resultTabs.getDefaultComparisonMode(),

            $button = $("#cmp-mode-button");


        var switchMode = function () {
            var newMode = resultTabs.switchComparisonMode();

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

            $button = $(".controls").find(".to-hidden-button"),
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

            $button = $(".controls").find(".open-input"),
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
                    inputCallback($target.val());
                });
        };

        init();
    };


    var buildInputMethodButton = function () {
        var getSettingsFor = {
                "rewrite": {"title":"Mode:rewrite", "icon": "autorenew"},
                "stack":   {"title":"Mode:stack", "icon": "add"}
            },
            defaultMode = "stack",
            currentMode,

            $button = $("#manual-seq-input").find(".input-method");


        var switchMode = function () {
            var newMode = (currentMode === "rewrite") ? "stack" : "rewrite";
            currentMode = newMode;

            $button
                .empty()
                .html(generateContent(getSettingsFor[newMode]));
        };


        var init = function () {
            currentMode = defaultMode;

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


    return {
        create: create
    };
} ());