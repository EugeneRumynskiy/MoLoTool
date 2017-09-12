var collectionSettingsButton = (function () {
    var getSettingsFor = {
            "default":   {"title":" ", "icon": "chrome_reader_mode"}
        },
        defaultMode = "default",

        $button,
        $collectionDialog;


    var init = function (collectionSwitchCallback) {
        $button = $("#collection-settings-button");
        $collectionDialog = $(".collection-dialog");

        $button
            .empty()
            .html(uiButtons.generateContent(getSettingsFor[defaultMode]))
            .on('click', function(event) {
                event.preventDefault();
                $collectionDialog.toggleClass("hidden");
            });

        collectionSettingsSwitcher.init(collectionSwitchCallback);
    };


    var reset = function () {
        $collectionDialog.addClass("hidden");
        collectionSettingsSwitcher.reset();
    };


    return {
        init: init,
        reset: reset
    };
}());


var collectionSettingsSwitcher = (function () {
    var optionsNames = [".model-species", ".model-collection"],

        defaultOptionsActiveInputID = {
            ".model-species":"#Human",
            ".model-collection":"#Core"
        },

        optionsInputs = {
            ".model-species": undefined,
            ".model-collection": undefined
        },

        $optionsSupportInfoBox,

        switchCallback = function () {};


    var init = function (collectionSwitchCallback) {
        switchCallback = collectionSwitchCallback;

        $optionsSupportInfoBox = $(".search-container .support-info .option-values");

        setOptionsInputs();
        setDefaultValues();
    };


    var setOptionsInputs = function () {
        var $options = $(".collection-dialog .option"),
            $option, name;

        for (var i = 0; i < optionsNames.length; i++) {
            name = optionsNames[i];
            $option = $options.filter(name);

            optionsInputs[name] = $option.find("input");

            $option.on("change", function () {
                var optionName = $(this).attr("data-class");
                setSupportInfo(optionName);
                setNewCollectionSource();
            });
        }
    };


    var setSupportInfo = function (optionName) {
        var optionActiveInputValue = getOptionValue(optionName);
        $optionsSupportInfoBox.find(optionName).html(optionActiveInputValue);
    };


    var getOptionValue = function (optionName) {
        return optionsInputs[optionName].filter(":checked").val();
    };


    var setDefaultValues = function () {
        var activeInputID, name;
        for(var i = 0; i < optionsNames.length; i++) {
            name = optionsNames[i];

            activeInputID = defaultOptionsActiveInputID[name];
            optionsInputs[name].filter(activeInputID).prop('checked', true);

            setSupportInfo(name);
        }

        setNewCollectionSource();
    };


    var getNewCollectionSource = function () {
        var species = getOptionValue(".model-species"),
            collectionIfFull = (getOptionValue(".model-collection") === "Full") ? true : false;

        return "http://hocomoco11.autosome.ru/" + species +
            "/mono.json?summary=true&full=" + collectionIfFull;
    };


    var setNewCollectionSource = function () {
        uiButtons.clearSearchInput();

        var newCollectionSource = getNewCollectionSource();
        switchCallback(newCollectionSource);
    };



    var reset = function () {
        setDefaultValues();
    };


    return {
        init: init,
        reset: reset
    };
}());
