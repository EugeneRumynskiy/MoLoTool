var clearButton = (function () {
    var getSettingsFor = {
            "default":   {"title":"Reset ", "icon": "delete_sweep"}
        },
        defaultMode = "default",
        $button;


    var init = function () {
        $button = $("#clear-button");

        $button.prop("disabled", false);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();

                if (!$(this).prop("disabled")) {
                    uiButtons.resetInterface();
                }
            });
    };


    return {
        init: init
    };
}());
