var submitButton = (function () {
    var getSettingsFor = {
            "default":   {"title":"Submit sequences ", "icon": "add"}
        },
        defaultMode = "default",

        $button,
        $textarea;


    var init = function (inputCallback) {
        $button = $("#manual-seq-input").find(".add-sequence");
        $textarea = $("#manual-seq-input").find("textarea");

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                showTextarea();
                addSequence(inputCallback);
            });
    };


    var showTextarea = function () {
        if ($textarea.hasClass("hidden")) {
            $textarea.removeClass("hidden");
        }
    };


    var addSequence = function (inputCallback) {
        var rewriteFlag = (uiButtons.getInputMethod() === "rewrite");
        inputCallback($textarea.val(), rewriteFlag);
    };


    return {
        init: init
    };
}());