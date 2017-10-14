var demoButton = (function () {
    var getSettingsFor = {
            "showDemo":   {"title":"Demo ", "icon": "insert_emoticon"}
        },
        defaultMode = "showDemo",
        searchInput = "coe1",

        $button;


    var showDemo = function (inputCallback) {
        $("#motif-search").val(searchInput);
        motifSearch.applySearch();
        $("#motif-list").children().first().children().first().children().first().click();

        uiButtons.clearSearchInput();
        motifSearch.applySearch();

        inputCallback(inputDemo.getDemoInput(), true);
    };


    var init = function (inputCallback) {
        $button = $("#demo-button");

        $button.prop("disabled", false);

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();

                //disabled while collection is under uploading after selecting
                if (!$(this).prop("disabled")) {
                    var keep = {
                        scrollPosition: true,
                        buttons : {
                            "showInputButton": true
                        }
                    };

                    uiButtons.resetInterface(keep);
                    showDemo(inputCallback);

                    if (showInputButton.isHidden() === false) {
                        triggerOpenSequenceButton();
                    }
                }
            });
    };


    var triggerOpenSequenceButton = function () {
        $(".open-sequence").trigger("click");
    };


    return {
        init:init
    };
}());
