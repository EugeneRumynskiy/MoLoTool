/**
 * Created by swm on 27.06.17.
 */
var resultTabs = (function () {
    var _fileName = "resultTabs",

        _tabStates,  //isOpened?

        _resultTabsObjects,

        _tabIdRange,

        _libraryIdCheck,
        _libraryIdDelete,

        _comparisonMode;


    var create = function (tabIdRange, libraryIdCheck, libraryIdDelete) {
        _tabIdRange = tabIdRange;
        _libraryIdCheck = libraryIdCheck;
        _libraryIdDelete= libraryIdDelete;

        _tabStates = initTabStates();
        _resultTabsObjects = {};
        _comparisonMode = getDefaultComparisonMode();
    };


    ////Comparison Mode
    var getDefaultComparisonMode = function () {
        return "Multiply";
    };


    var getCurrentMode = function () {
        return _comparisonMode;
    };


    var switchComparisonMode = function () {
        var newMode = "";
        if (_comparisonMode === "Single"){
            switchToMultiplyMode();
            newMode = "Multiply";
        } else if (_comparisonMode === "Multiply") {
            switchToSingleMode();
            newMode = "Single";
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "comparisonMode is undefined"});
        }

        motifHandler.handleMotifs(); //needed to update table for single sequence
        return newMode;
    };
    
    
    var switchToSingleMode = function () {
        _comparisonMode = "Single";

        $(".tab-result").removeClass("current-tab");
        $(".tab-result").first().addClass("current-tab");

        $(".tab-result-sequence").removeClass("flattened");
        $(".tab-result-sequence").addClass("hidden full-screen");
        $(".tab-result-sequence").first().removeClass("hidden");

        $(".lock").addClass("hidden");

        updateWidth("reset");
    };

    
    var switchToMultiplyMode = function () {
        _comparisonMode = "Multiply";

        $(".tab-result").removeClass("current-tab");

        $(".tab-result-sequence").removeClass("hidden full-screen");
        $(".tab-result-sequence").addClass("flattened");

        $(".lock").removeClass("hidden");

        updateWidth("setToMaximum");
    };
    ////Comparison Mode End


    var getIdsToHandle = function (event) {
        if (getCurrentMode() === "Single") {
            return getCurrentTabId();
        } else {
            return getOpenedIds();
        }

        /*if ((getCurrentMode() !== "Single") || event === "fileUpload") {
            return getOpenedIds();
        } else {
            return getCurrentTabId();
        }*/
    };



    var getCurrentTabId = function () {
        if ($.isEmptyObject(getOpenedIds())) {
            return []
        }

        var $currentTab = $(".tab-result.current-tab"),
            currentTabId = $currentTab.attr("data-tab");

        if (($currentTab.length !== 1) || currentTabId === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "currentTab Id is undefined"});
            return [];
        } else {
            return [currentTabId];
        }
    };


    var initTabStates = function () {
        var initialState = {};
        for (var i = _tabIdRange.min; i <= _tabIdRange.max; i++) {
            initialState[i] = false;
        }
        return initialState;
    };

    //
    var isOpened = function (tabId) {
        var tabState = _tabStates[tabId];

        if ((tabState === undefined) || (!_tabStates.hasOwnProperty(tabId))) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, isOpened"});
            tabState = false;
        }

        return tabState;
    };

    //
    var makeOpened = function (tabId) {
        if (_tabStates[tabId] === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, makeOpened"});
        } else {
            _tabStates[tabId] = true;
            _resultTabsObjects[tabId] = $(".tab-result[data-tab=" + tabId + "]").children(".tab-result-sequence").children(".sequence");
        }
    };

    //
    var makeClosed = function (tabId) {
        if (_tabStates[tabId] === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, makeClosed"});
        } else {
            _tabStates[tabId] = false;
        }
    };

    //
    var getOpenedIds = function () {
        var openedTabsIds = [];

        if (_tabStates === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab _tabStates is undefined, getOpenedIds"});
        } else {
            for (var key in _tabStates) {
                if (_tabStates.hasOwnProperty(key) && isOpened(key)) {
                    openedTabsIds.push(key);
                }
            }
        }

        return openedTabsIds;
    };


    var addIdToResult = function (tabId) {
        if (!_libraryIdCheck(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, id not in sequenceLibrary"});
        } else if (isOpened(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, it's already in result"});
        } else {
            var $targetTab = $("#result-tabs"),
                $resultTab = createResultTab(tabId),

                $targetSequence = $("#result-sequences"),
                $resultSequence = createResultSequence(tabId),

                insertBeforeId = getNextHighestResultTabId(tabId);


            if (true) { //insertBeforeId === tabId) {
                $targetTab.append($resultTab);
                $targetSequence.append($resultSequence);
            } else {
                $resultTab.insertBefore($(".tab-result[data-tab=" + insertBeforeId + "]"));
                $resultSequence.insertBefore($(".tab-result-sequence[data-tab=" + insertBeforeId + "]"));
            }

            if (getCurrentMode() === "Single") {
                $resultSequence.addClass("hidden full-screen");
                $resultSequence.removeClass("flattened");

                if ($.isEmptyObject(getOpenedIds())) {
                    setToCurrent(tabId);
                }
            } else if (getCurrentMode() === "Multiply") {
            }

            makeOpened(tabId);
            updateHeight();
        }
    };


    var updateHeight = function () {
        $(".tab-result-sequence").height(getOpenedIds().length * 80 + 12 + "px");
    };


    var updateWidth = function (event) {
        var $tabs = $(".tab-result-sequence"),
            $sequences = $tabs.find(".sequence");

        if (event === "reset") {
            $tabs.css({
                "width": "unset"
            })
        } else if (event === "setToMaximum")  {
            var max = -1;

            for (var i = 0; i < $sequences.length; i++) {
                if (max < $sequences[i].scrollWidth) {
                    max = $sequences[i].scrollWidth;
                }
            }

            $tabs.css({
                "width": max + 5 + "px"
            })
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "can't update with"});
        }
    };


    var createResultTab = function (tabId) {
        var lockMode = (getCurrentMode() === "Single") ? "hidden" : "",
            tabName = sequenceLibrary.getItemById(tabId).seqValues.title.slice(0, 3) + "..",
            $resultTab = $(
                '<div class="tab-result" data-tab=' + tabId + '>' +
                '<a href="#" class="tab-result-name" data-tab=' + tabId + '>' + tabName + '</a>' +
                '<a href="#" class="close"></a>' +
                '<a href="#" class="lock '+ lockMode + '">' + '<i class="material-icons md-dark">lock_open</i>' + '</a>' +
                '</div>'
            );

        $resultTab.on("click", function(event) {
            event.preventDefault();
            var $target = $(event.target);

            if ($target.hasClass("close")) {
                closeTab(this);
                motifHandler.handleMotifs();
            } else if ($target.hasClass("material-icons")) {
                lockTab($target);
            } else {
                if (getCurrentMode() === "Single") {
                    var tabId = $(this).attr('data-tab');
                    setToCurrent(tabId);
                    motifHandler.handleMotifs();
                }
            }
        });

        $resultTab.find("")

        return $resultTab;
    };


    var lockTab = function ($target) {
        var currentState = $target.html(),
            tabId = $target.parents(".tab-result").attr("data-tab"),
            $seqToLock = $(".tab-result-sequence[data-tab="+ tabId + "]");


        if (currentState === "lock") {
            $target.html("lock_open");

            $seqToLock.find(".sequence").css({
                "position": "static",
                "left": "unset",
                "clip": "unset"
            });
        } else {
            var shift = $("#result-sequences").width();
            console.log(shift);

            $target.html("lock");

            $seqToLock.find(".sequence").css({
                "position": "absolute",
                "left": $seqToLock.position().left + "px",
                "clip": "rect(0px," + (shift - $seqToLock.position().left + 88)
                + "px," + "70px," + ($seqToLock.position().left - 90) + "px)"
            });
        }
    };


    var createResultSequence = function (tabId) {
        return  $('<div class="tab-result-sequence round flattened" data-tab=' + tabId + '>'
            + '<div class="sequence"></div>'
            + '</div>');
    };


    var getNextHighestResultTabId = function (tabId) {
        for (var i = _tabIdRange.min; i <= _tabIdRange.max; i++) {
            if (_tabStates[i] && (tabId < i)) {
                return i;
            }
        }
        return tabId;
    };


    var updateTab = function (tabId, content) {
        if (isOpened(tabId)) {
            $(".tab-result-sequence[data-tab=" + tabId + "]").find(".sequence").empty().html(content);
        } else {
            console.log(tabId);
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be updated it's not opened"});
        }
    };


    var closeTab = function (source) {
        var $tab = $(source),
            tabId = $tab.attr('data-tab');

        makeClosed(tabId);
        _libraryIdDelete(tabId);

        $tab.remove();
        $(".tab-result-sequence[data-tab=" + tabId + "]").remove();
        updateHeight();

        if (getCurrentMode() === "Multiply" ) {
            updateWidth("reset");
            updateWidth("setToMaximum");
        } else if (getCurrentMode() === "Single" &&
            !$.isEmptyObject(getOpenedIds()) ) {

            var newCurrentTabId = $(".tab-result").first().attr("data-tab");
            setToCurrent(newCurrentTabId);
        }
    };


    var setToCurrent = function (tabId) {
        $(".tab-result").removeClass("current-tab");
        $(".tab-result[data-tab=" + tabId + "]").addClass("current-tab");

        $(".tab-result-sequence").addClass("hidden");
        $(".tab-result-sequence[data-tab=" + tabId + "]").removeClass("hidden");
    };


    var show = function () {
        console.log(_tabStates);
        console.log(_resultTabsObjects);
        return _tabStates;
    };


    return {
        create: create,
        switchComparisonMode: switchComparisonMode,

        addIdToResult: addIdToResult,
        getOpenedIds: getOpenedIds,
        getIdsToHandle: getIdsToHandle,
        getCurrentMode: getCurrentMode,
        getDefaultComparisonMode: getDefaultComparisonMode,

        updateTab: updateTab,
        updateWidth: updateWidth,
        //debug
        show: show
    };
}());