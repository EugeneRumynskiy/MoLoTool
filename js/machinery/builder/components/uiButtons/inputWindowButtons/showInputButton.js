var showInputButton = (function () {
    var getSettingsFor = {
            "hidden":   {"title":"Show sequences ", "icon": "visibility"},
            "visible":   {"title":"Hide sequences ", "icon": "visibility_off"}
        },
        defaultMode = "visible",

        $button,
        $target;

    var switchMode = function () {
        var newMode = ($target.hasClass("hidden")) ? "visible" : "hidden";
        uiButtons.setVisibility(newMode, $target);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[newMode]));
    };

    var init = function () {
        $button = $("#manual-seq-input").find(".open-sequence");
        $target = $("#manual-seq-input").find("textarea");

        uiButtons.setVisibility(defaultMode, $target);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
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
