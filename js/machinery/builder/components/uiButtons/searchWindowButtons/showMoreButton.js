var showMoreButton = (function () {
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
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
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
