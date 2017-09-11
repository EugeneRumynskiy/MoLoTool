var clearButton = (function () {
    var getSettingsFor = {
            "default":   {"title":"Reset ", "icon": "delete_sweep"}
        },
        defaultMode = "default",
        $button;


    var init = function () {
        $button = $("#clear-button");
        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                uiButtons.resetInterface();
            });
    };


    return {
        init: init
    };
}());
