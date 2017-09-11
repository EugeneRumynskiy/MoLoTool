var switchComparisonModeButton = (function () {
    var getSettingsFor = {
            "Single":   {"title":"Mode ", "icon": "vertical_align_center"}, //select_all
            "Multiply":   {"title":"Mode ", "icon": "view_headline"} //format_list_bulleted
        },
        defaultMode,
        $button;


    var switchMode = function () {
        var newMode = comparisonMode.switchComparisonMode();

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[newMode]));
    };


    var init = function () {
        defaultMode = comparisonMode.getDefaultComparisonMode();
        $button = $("#change-mode-button");

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
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
