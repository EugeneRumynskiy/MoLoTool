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

        turnOffLocks();
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


    var turnOffLocks = function () {
        var $locks = $(".lock .material-icons");
            $locks.each(function () {
                unlockLine($(this));
            });
    };


    var switchLock = function ($target) {
        var currentState = $target.html();
        if (currentState === "lock") {
            unlockLine($target);
        } else {
            lockLine($target);
        }
    };


    var lockLine = function ($target) {
        var tabId = $target.parents(".tab-result").attr("data-tab"),
            $tabToLock = $(".tab-result-sequence[data-tab="+ tabId + "]"),
            seqShift = $("#result-sequences").width(),
            tabShift = parseFloat($("#result-tabs").css("width")),
            tabHeight = $(".tab-result").css("height");

        $tabToLock
            .find(".sequence").css({
                "left": $tabToLock.position().left + "px",
                "clip": "rect(" +
                    "0px," +
                    (seqShift - $tabToLock.position().left + tabShift - 2) + "px," +
                    tabHeight + "," +
                    ($tabToLock.position().left - tabShift) + "px" +
                ")"
            })
            .addClass("locked");

        $tabToLock
            .find(".digits").css({
                "left": $tabToLock.position().left + "px",
                "clip": "rect(" +
                    "0px," +
                    (seqShift - $tabToLock.position().left + tabShift - 2) + "px," +
                    "23px" + "," +
                    ($tabToLock.position().left - tabShift) + "px" +
                ")"
            })
            .addClass("locked");

        $target.html("lock");
    };


    var unlockLine = function ($target) {
        var tabId = $target.parents(".tab-result").attr("data-tab"),
            $tabToUnlock = $(".tab-result-sequence[data-tab="+ tabId + "]");

        $tabToUnlock
            .find(".sequence, .digits").css({
               "left": "unset",
               "clip": "unset"})
            .removeClass("locked");

        $target.html("lock_open");
    };


    return {
        create: create,

        getCurrentMode: getCurrentMode,
        getDefaultComparisonMode: getDefaultComparisonMode,

        switchComparisonMode: switchComparisonMode,
        switchLock: switchLock,

        turnOffLocks: turnOffLocks
    };
} ());