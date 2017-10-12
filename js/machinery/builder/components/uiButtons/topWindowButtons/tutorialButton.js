var tutorialButton = (function () {
    var getSettingsFor = {
            "hidden":   {"title":"Guide ", "icon": "help_outline"},
            "visible":   {"title":"Guide ", "icon": "help"}
        },
        defaultMode = "hidden",

        $button,
        $tutorial,
        $interface,
        $help,

        _scrollPosStorageKey;


    var switchVisibility = function (newMode) {
        if (newMode === "hidden") {
            scrollPositionStorage.save(_scrollPosStorageKey);

            $tutorial.addClass("hidden");
            $interface.removeClass("hidden");
        } else {
            if (!$help.hasClass("hidden")) {
                helpButton.switchMode();
            }

            $tutorial.removeClass("hidden");
            $interface.addClass("hidden");

            scrollPositionStorage.restore(_scrollPosStorageKey);
        }
    };


    var switchMode = function () {
        var newMode = ($tutorial.hasClass("hidden")) ? "visible" : "hidden";

        switchVisibility(newMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[newMode]));

        return newMode;
    };


    var init = function () {
        $button = $("#tutorial-button");
        $tutorial = $("#tutorial-cmp");
        $interface = $(".interface-area");
        $help = $("#help-cmp");

        _scrollPosStorageKey = 'tutorialScrollPos';
        scrollPositionStorage.add(_scrollPosStorageKey, "0");

        switchVisibility(defaultMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                switchMode();
            });
    };


    var reset = function () {
        var newMode = ($tutorial.hasClass("hidden")) ? "visible" : "hidden";
        if (newMode === defaultMode) {
            switchMode();
        }
    };


    return {
        init: init,
        reset: reset,
        switchMode: switchMode
    };
} ());
