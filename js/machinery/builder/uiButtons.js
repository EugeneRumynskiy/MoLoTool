var uiButtons = (function () {
    var _fileName = "uiButtons",

        _eventHandler = function() {};


    var create = function (eventHandler) {
        setEventHandlerTo(eventHandler);
        setupButtons();
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function () {
        _eventHandler();
    };


    var setupButtons = function () {
        buildSwitchComparisonModeButton();
        buildGenerateTableButton();
    };


    var buildSwitchComparisonModeButton = function () {
        var getModeIcon = {
                "Single": "<i class=\"material-icons md-dark\">select_all</i>",
                "Multiply": "<i class=\"material-icons md-dark\">format_list_bulleted</i>"
            },
            defaultMode = resultTabs.getDefaultComparisonMode(),

            $button = $("#cmp-mode-button");


        var switchMode = function () {
            var newMode = resultTabs.switchComparisonMode();

            $button
                .empty()
                .html('<span class="icon icon-medium">Change Mode ' + getModeIcon[newMode] + '</span>\n');
        };


        var init = function () {
            $button
                .empty()
                .html('<span class="icon icon-medium">Change Mode ' + getModeIcon[defaultMode] + '</span>\n')
                .on('click', function() {
                    console.log(this);
                    switchMode();
                });
        };

        init();
    };


    var buildGenerateTableButton = function () {
        var getIconForMode = {
                "hidden": "<i class=\"material-icons md-dark\">visibility_off</i>",
                "visible": "<i class=\"material-icons md-dark\">visibility</i>"
            },
            defaultMode = "hidden",

            $button = $(".to-hidden-button"),
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
                .html('<span class="icon icon-medium">Generate table ' + getIconForMode[newMode] + '</span>\n');

            return newMode;
        };


        var init = function () {
            if (defaultMode === "hidden") {
                $target.addClass("hidden");
            } else {
                $target.removeClass("hidden");
            }

            $button
                .empty()
                .html('<span class="icon icon-medium">Generate table ' + getIconForMode[defaultMode] + '</span>\n')
                .on('click', function() {
                    switchMode();
                });
        };

        init();
    };


    return {
        create: create
    };
} ());