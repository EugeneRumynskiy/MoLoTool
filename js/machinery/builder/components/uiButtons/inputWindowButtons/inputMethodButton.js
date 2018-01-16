var inputMethodButton = (function () {
    var getSettingsFor = {
            "rewrite": {"title":"Rewrite: Yes ", "icon": "autorenew"},
            "stack":   {"title":"Rewrite: No ", "icon": "add"}
        },
        defaultMode = "rewrite",

        $button;


    var getTooltip = function () {
        return (uiButtons.getInputMethod() === "rewrite") ?
            "The input replaces sequences" : "The input is appended to sequences";
    };


    var switchMode = function () {
        var newMode = (uiButtons.getInputMethod() === "rewrite") ? "stack" : "rewrite";
        uiButtons.setInputMethod(newMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[newMode]));
    };


    var init = function () {
        $button = $("#manual-seq-input").find(".input-method");

        uiButtons.setInputMethod(defaultMode);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                switchMode();
            });
    };


    var reset = function () {
        var newMode = (uiButtons.getInputMethod() === "rewrite") ? "stack" : "rewrite";
        if (newMode === defaultMode) {
            switchMode();
        }
    };


    return {
        init: init,
        reset: reset,
        getTooltip: getTooltip
    };
}());