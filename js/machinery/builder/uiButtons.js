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

            $button = $("#cmp-mode-button");

        $button.empty();
        $button.html('<span class="icon icon-medium">Change Mode ' + getModeIcon[resultTabs.getCurrentMode()] + '</span>\n');

        $button.on('click', function(){
            var newMode = resultTabs.switchComparisonMode();
            console.log(newMode, "MODE\n");

            $button.empty();
            $button.html('<span class="icon icon-medium">Change Mode ' + getModeIcon[newMode] + '</span>\n');
        });
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

            $button.empty();
            $button.html('<span class="icon icon-medium">Generate table ' + getIconForMode[newMode] + '</span>\n');

            return newMode;
        };


        if (defaultMode === "hidden") {
            $target.addClass("hidden");
        } else {
            $target.removeClass("hidden");
        }
        $button.empty();
        $button.html('<span class="icon icon-medium">Generate table ' + getIconForMode[defaultMode] + '</span>\n');
        $button.on('click', function(){
            switchMode();
        });
    };


    return {
        create: create
    };
} ());