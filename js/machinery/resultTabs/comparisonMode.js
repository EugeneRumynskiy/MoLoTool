var comparisonMode = (function () {
    var _fileName = "comparisonMode",

        _defaultComparisonMode,
        _comparisonMode;


    var create = function (defaultComparisonMode) {
        setDefaultComparisonModeTo(defaultComparisonMode);
        setCurrentModeTo(getDefaultComparisonMode());
    };


    var getDefaultComparisonMode = function () {
        return _defaultComparisonMode;
    };


    var setDefaultComparisonModeTo = function (newDefaultComparisonMode) {
        _defaultComparisonMode = newDefaultComparisonMode;
    };
    

    var getCurrentMode = function () {
        return _comparisonMode;
    };
    
    
    var setCurrentModeTo = function (newComparisonMode) {
        _comparisonMode = newComparisonMode;
    };


    var switchComparisonMode = function () {
        var newMode = "";

        if (getCurrentMode() === "Single"){
            newMode = switchToMultiplyMode();
        } else if (getCurrentMode() === "Multiply") {
            newMode = switchToSingleMode();
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "comparisonMode is undefined"});
        }

        motifHandler.handleMotifs(); //needed to update table for single sequence

        return newMode;
    };


    var switchToSingleMode = function () {
        setCurrentModeTo("Single");

        $(".tab-result").removeClass("current-tab");
        $(".tab-result").first().addClass("current-tab");

        $(".tab-result-sequence").removeClass("flattened");
        $(".tab-result-sequence").addClass("hidden full-screen");
        $(".tab-result-sequence").first().removeClass("hidden");

        $(".lock").addClass("hidden");

        resultTabs.updateWidth("reset");

        return "Single";
    };


    var switchToMultiplyMode = function () {
        setCurrentModeTo("Multiply");

        $(".tab-result").removeClass("current-tab");

        $(".tab-result-sequence").removeClass("hidden full-screen");
        $(".tab-result-sequence").addClass("flattened");

        $(".lock").removeClass("hidden");

        resultTabs.updateWidth("setToMaximum");

        return "Multiply";
    };


    return {
        create: create,

        getCurrentMode: getCurrentMode,
        getDefaultComparisonMode: getDefaultComparisonMode,

        switchComparisonMode: switchComparisonMode
    };
} ());