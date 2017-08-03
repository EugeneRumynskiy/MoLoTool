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
       /* $tabToLock = $(".tab-result-sequence[data-tab="+ tabId + "]"),
            shift = $("#result-sequences").width();

        $tabToLock.find(".sequence, .digits").css({
            "position": "absolute",
            "left": $tabToLock.position().left + "px",
            "clip": "rect(" +
            "0px," +
            (shift - $tabToLock.position().left + 88) + "px," +
            "100px," +
            ($tabToLock.position().left - 90) + "px" +
            ")"
        });*/


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
        var $sequencesToUnlock = $(".tab-result-sequence");

        $sequencesToUnlock
            .find(".sequence, .digits").css({
                    "left": "unset",
                    "clip": "unset"})
            .removeClass(".locked");


        $("#result-tabs").find(".lock .material-icons").html("lock_open");
    };


    var turnOnLocks = function () {
        var $sequencesToUnlock = $(".tab-result-sequence");

        $sequencesToUnlock.find(".sequence").css({
            "position": "static",
            "left": "unset",
            "clip": "unset"
        });

        $sequencesToUnlock.find(".digits").css({
            "position": "absolute",
            "left": "unset",
            "clip": "unset"
        });

        $("#result-tabs").find(".lock .material-icons").html("lock_open");
    };


    var switchLock = function ($target) {
        var currentState = $target.html();

        if (currentState === "lock") {
            unlock($target);
        } else {
            lock($target);
        }
    };


    var lock = function ($target) {
        var tabId = $target.parents(".tab-result").attr("data-tab"),
            $tabToLock = $(".tab-result-sequence[data-tab="+ tabId + "]"),
            shift = $("#result-sequences").width();

        $tabToLock
            .find(".sequence, .digits").css({
                "left": $tabToLock.position().left + "px",
                "clip": "rect(" +
                    "0px," +
                    (shift - $tabToLock.position().left + 88) + "px," +
                    "100px," +
                    ($tabToLock.position().left - 90) + "px" +
                ")"
            })
            .addClass("locked");

        $target.html("lock");
    };


    var unlock = function ($target) {
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
        switchLock: switchLock
    };
} ());