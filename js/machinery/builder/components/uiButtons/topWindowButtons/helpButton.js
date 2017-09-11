var helpButton = (function () {
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
            .html(uiButtons.generateContent(getSettingsFor[newMode]));

        return newMode;
    };

    var init = function () {
        $button = $("#help-button");
        $help = $("#help-cmp");
        $interface = $(".interface-area");

        setVisibilityToMode(defaultMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
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
