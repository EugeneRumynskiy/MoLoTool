var collectionSettingsButton = (function () {
    var getSettingsFor = {
            "default":   {"title":" ", "icon": "settings"}
        },
        defaultMode = "default",

        $button,
        $collectionDialog;


    var init = function () {
        $button = $("#collection-settings-button");
        $collectionDialog = $(".collection-dialog");

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                $collectionDialog.toggleClass("hidden");
            });

        collectionDialog.init();
    };


    var hideDialog = function () {
        $collectionDialog.addClass("hidden");
    };


    var reset = function () {
        $collectionDialog.addClass("hidden");
        collectionDialog.reset();
    };


    return {
        init: init,
        reset: reset
    };
}());


var collectionDialog = (function () {
    var defaultOrigin = "#Human",
        defaultQuality = "#Core",

        $originSource,
        $qualitySource;


    var init = function () {
        $originSource = $(".collection-dialog .model-origin").find(".cases input");
        $qualitySource = $(".collection-dialog .model-quality").find(".cases input");

        $originSource.filter(defaultOrigin).prop('checked', true);
        $qualitySource.filter(defaultQuality).prop('checked', true);
    };


    var reset = function () {
        $originSource.filter(defaultOrigin).prop('checked', true);
        $qualitySource.filter(defaultQuality).prop('checked', true);
    };


    return {
        init: init,
        reset: reset
    };
}());
