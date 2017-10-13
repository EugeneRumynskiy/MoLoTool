var submitButton = (function () {
    var getSettingsFor = {
            "default":   {"title":"Submit ", "icon": "add"}
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

                if (textareaIsHidden()) {
                    triggerOpenSequenceButton();
                } else {
                    var noSequenceErrors = addSequence(inputCallback);
                    if (noSequenceErrors === true) {
                        triggerOpenSequenceButton();
                    }
                }
            });
    };


    var textareaIsHidden = function () {
        return $textarea.hasClass("hidden");
    };


    var triggerOpenSequenceButton = function () {
        $(".open-sequence").trigger("click");
    };


    var addSequence = function (inputCallback) {
        var rewriteFlag = (uiButtons.getInputMethod() === "rewrite");
        return inputCallback($textarea.val(), rewriteFlag);
    };


    return {
        init: init
    };
}());