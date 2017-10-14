var helpButton = (function () {
    var getSettingsFor = {
            "hidden":   {"title":"About ", "icon": "info_outline"},
            "visible":   {"title":"About ", "icon": "info"}
        },
        defaultMode = "hidden",

        $button,
        $help,
        $interface,
        $tutorial,

        _scrollPosStorageKey;


    var switchVisibility = function (newMode) {
        if (newMode === "hidden") {
            scrollPositionStorage.save(_scrollPosStorageKey);

            $help.addClass("hidden");
            $interface.removeClass("hidden");
        } else {
            if (!$tutorial.hasClass("hidden")) {
                tutorialButton.switchMode();
            }

            $help.removeClass("hidden");
            $interface.addClass("hidden");

            scrollPositionStorage.restore(_scrollPosStorageKey);
        }
    };


    var switchMode = function () {
        var newMode = ($help.hasClass("hidden")) ? "visible" : "hidden";

        switchVisibility(newMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[newMode]));

        return newMode;
    };


    var init = function () {
        $button = $("#help-button");
        $help = $("#help-cmp");
        $interface = $(".interface-area");
        $tutorial = $("#tutorial-cmp");

        _scrollPosStorageKey = 'helpScrollPos';
        scrollPositionStorage.add(_scrollPosStorageKey, "0");

        switchVisibility(defaultMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                switchMode();
            });

        $("#help-cmp .close").on("click", function(event) {
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
        reset: reset,
        switchMode: switchMode,
    };
} ());
