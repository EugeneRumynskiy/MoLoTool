/**
 * Created by swm on 27.06.17.
 */
var resultTabs = (function () {
    var _fileName = "resultTabs",

        _tabStates,  //isOpened?

        _resultTabsObjects,

        _tabIdRange,

        _libraryIdCheck,
        _libraryIdDelete;


    var create = function (tabIdRange, libraryIdCheck, libraryIdDelete) {
        _tabIdRange = tabIdRange;
        _libraryIdCheck = libraryIdCheck;
        _libraryIdDelete= libraryIdDelete;

        _tabStates = initTabStates();
        _resultTabsObjects = {};

        comparisonMode.create("Multiply");
        digitGuidance.create(10000);

        clipboardCopy.create();
    };


    var getCurrentMode = function () {
        return comparisonMode.getCurrentMode();
    };


    var getIdsToHandle = function () {
        if (getCurrentMode() === "Single") {
            return getCurrentTabId();
        } else {
            return getOpenedIds();
        }
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
                $resultSequence = createResultSequence(tabId);

            $targetTab.append($resultTab);
            $targetSequence.append($resultSequence);

            /*var insertBeforeId = getNextHighestResultTabId(tabId);
            $resultTab.insertBefore($(".tab-result[data-tab=" + insertBeforeId + "]"));
            $resultSequence.insertBefore($(".tab-result-sequence[data-tab=" + insertBeforeId + "]"));*/

            if (getCurrentMode() === "Single") {
                $resultSequence.addClass("hidden full-screen");
                $resultSequence.removeClass("flattened");

                if ($.isEmptyObject(getOpenedIds())) {
                    setToCurrent(tabId);
                }
            } else if (getCurrentMode() === "Multiply") {
                $resultSequence.addClass("flattened");
            }

            if ($.isEmptyObject(getOpenedIds())) {
                $("#result-cmp").removeClass("empty");
            }

            makeOpened(tabId);
            updateHeight();
        }
    };


    var updateHeight = function () {
        var resultHeight = parseFloat($("#result-tabs").css("height")),
            sliderShift = 5;
        $("#result-sequences").height(resultHeight + sliderShift + "px");
    };


    var updateWidth = function (event) {
        var $tabs = $(".tab-result-sequence"),
            $sequences = $tabs.find(".sequence"),
            $digits = $tabs.find(".digits");

        if (event === "reset") {
            $tabs.css({"width": "unset"});

         /*   var widthForDigits = $(".tab-result-sequence").find(".sequence").css("width");
            $(".tab-result-sequence").find(".digits").css({
                "max-width": widthForDigits + "px"
            });*/

            //$tabs.find(".digits").css({"width": "unset"});
        } else if (event === "setToMaximum")  {
            for (var i = 0, max = -1; i < $sequences.length; i++) {
                if (max < $sequences[i].scrollWidth) {
                    max = $sequences[i].scrollWidth;
                }
            }

            $tabs.css({
                "width": max + 5 + "px"
            });

            /*$tabs.find(".digits").css({
                "width": max + 5 + "px"
            });*/
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "can't update with"});
        }
    };


    var createResultTab = function (tabId) {
        var lockMode = (getCurrentMode() === "Single") ? "hidden" : "",

            fullName = sequenceLibrary.getItemById(tabId).seqValues.title,
            tabName = (fullName.length <= 12) ? fullName : fullName.slice(0, 10) + "..",

            $resultTab = $(
                '<div class="tab-result" data-tab=' + tabId + '>' +
                '<a href="#" class="tab-result-name" data-tab=' + tabId + '>' + tabName + '</a>' +
                '<a href="#" class="close"></a>' +
                '<a href="#" class="lock '+ lockMode + '">' + '<i class="material-icons md-dark">lock_open</i>' + '</a>' +
                '<a href="#" class="copy-tab" data-tab=' + tabId + '>' +
                '<i class="material-icons md-dark">content_copy</i>' + '</a>' +
                '</div>'
            );

        $resultTab.on("click", function(event) {
            event.preventDefault();
            var $target = $(event.target);

            if ($target.hasClass("close")) {
                closeTab(this);
                motifHandler.handleMotifs();
            } else if ($target.parent().hasClass("lock")) {
                comparisonMode.switchLock($target);
            } else if (getCurrentMode() === "Single") {
                var tabId = $(this).attr('data-tab');
                if (getCurrentTabId()[0] !== tabId) {
                    setToCurrent(tabId);
                    motifHandler.handleMotifs();
                }
            }
        });

        return $resultTab;
    };


    var createResultSequence = function (tabId) {
        return  $('<div class="tab-result-sequence" data-tab=' + tabId + '>'
            + '<div class="digits"></div>'
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
            var seqLength = sequenceLibrary.getItemById(tabId).seqValues.sequence.length,
                digits = digitGuidance.getDigitsFor(seqLength),

                $resultLine = $(".tab-result-sequence[data-tab=" + tabId + "]"),
                $sequence = $resultLine.find(".sequence"),
                $digits = $resultLine.find(".digits");

            $sequence.empty().html(content);
            $digits.empty().html(digits);

            if (getCurrentMode() === "Single") {
                var digitsHeight = parseFloat($digits.css("height")),
                    shift = parseFloat($digits.css("line-height")) / 2,
                    marginTop = digitsHeight - shift;
                $sequence.css("margin-top", "-" + marginTop + "px");
            }
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

        if ($.isEmptyObject(getOpenedIds())) {
            $("#result-cmp").addClass("empty");
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
        addIdToResult: addIdToResult,

        getOpenedIds: getOpenedIds,
        getIdsToHandle: getIdsToHandle,
        getCurrentMode: getCurrentMode,

        updateTab: updateTab,
        updateWidth: updateWidth,

        //debug
        show: show
    };
}());