/**
 * Created by swm on 27.06.17.
 */
var resultTabs = (function () {
    var _fileName = "resultTabs",

        _tabStates,  //isOpened
        _resultTabsObjects,
        _currentResultTabId,

        _features,
        _tabIdRange;


    var create = function () {
        _features = ["name", "seqTitle", "seqSequence"];
        _tabIdRange = sequenceTabs.getTabIdRange();

        _tabStates = initTabStates();
        _resultTabsObjects = {};
    };


    var initTabStates = function () {
        var initialState = {};
        for (var i = _tabIdRange.min; i <= _tabIdRange.max; i++) {
            initialState[i] = false;
        }
        return initialState;
    };


    var isOpened = function (tabId) {
        var tabState = _tabStates[tabId];

        if (tabState === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, isOpened"});
            tabState = false;
        }

        return tabState;
    };


    var makeOpened = function (tabId) {
        if (_tabStates[tabId] === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, makeOpened"});
        } else {
            _tabStates[tabId] = true;
            _resultTabsObjects[tabId] = $(".tab-result[data-tab=" + tabId + "]").children(".tab-result-sequence");
        }
    };


    var makeClosed = function (tabId) {
        if (_tabStates[tabId] === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, makeClosed"});
        } else {
            _tabStates[tabId] = false;
        }
    };


    var getOpenedTabsIds = function () {
        var openedTabsIds = [];

        if (_tabStates === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab _tabStates is undefined, getOpenedTabsIds"});
        } else {
            for (var key in _tabStates) {
                if (_tabStates.hasOwnProperty(key) && isOpened(key)) {
                    openedTabsIds.push(key);
                }
            }
        }

        return openedTabsIds;
    };


    var isCurrent = function (tabId) {
        console.log(parseInt(_currentResultTabId), parseInt(tabId));
        return parseInt(_currentResultTabId) === parseInt(tabId);
    };


    var getNextHighestResultTabId = function (tabId) {
        for (var i = _tabIdRange.min; i <= _tabIdRange.max; i++) {
            if (_tabStates[i] && (tabId < i)) {
                return i;
            }
        }
        return tabId;
    };


    var getNextCurrentTabId = function ($tab) {
        var $nextTab = $tab.prev(".tab-result");

        if ($nextTab.length === 0) {
            $nextTab = $tab.next(".tab-result");
        }

        if ($nextTab.length === 0) {
            errorHandler.logError({"fileName": _fileName, "message": "getNextCurrentTabId error"});
        } else {
            return $nextTab.attr('data-tab');
        }
    };


    var setToCurrent = function (tabId) {
        var $source = $(".tab-result[data-tab=" + tabId + "]");

        $('#result-cmp').children(".tab-result").removeClass('current-tab-result');
        $source.addClass('current-tab-result');

        _currentResultTabId = tabId;
    };


    var updateTab = function (tabId, content) {
        _resultTabsObjects[tabId].empty().html(content);
    };


    var addInterfaceTabToResult = function (tabId) {
        if (!sequenceTabs.isRecorded(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, id not in sequenceTabs"});
        } else if (isOpened(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, it's already in result"});

            var $seqTabToAnimate = $(".tab-link[data-tab=" + tabId + "]"),
                $resultTabToAnimate = $(".tab-result[data-tab=" + tabId + "]").children("a");

            startErrorAnimation($seqTabToAnimate);
            startErrorAnimation($resultTabToAnimate);
        } else {
            var $target = $("#result-cmp"),
                $resultTab = createTab(tabId),
                insertBeforeId = getNextHighestResultTabId(tabId);
            if (insertBeforeId === tabId) {
                $target.append($resultTab);
            } else {
                $resultTab.insertBefore($(".tab-result[data-tab=" + insertBeforeId + "]"))
            }
            makeOpened(tabId);
            setToCurrent(tabId);
            motifHandler.updateResultTab(tabId);
        }
    };


    var createTab = function (tabId) {
        var $resultTab = $(
            '<div class="tab-result" data-tab=' + tabId + '>' +
                '<a href="#" class="tab-result-name" data-tab=' + tabId + '>#' + tabId + '</a>' +
                '<a href="#" class="close"></a>' +
                '<div class="tab-result-sequence round flattened"></div>' +
            '</div>'
        );

        $resultTab.on("click", function(event) {
            event.preventDefault();

            if (event.target.className === "close") {
                var tabId = $(this).attr('data-tab'),
                    $target = $(".tab-link[data-tab=" + tabId + "]").children(".close");
                $target.siblings(".tab-name").click();
                $target.siblings(".add").css("display", "inherit");
                $target.css("display", "none");

                closeTab(this);
            } else {
                var tabId = $(event.target).parents(".tab-result").attr("data-tab");
                setToCurrent(tabId);
                sequenceTabs.setTabToCurrent($(".tab-link[data-tab=" + tabId + "]"));

                motifHandler.updateResultTab(tabId);
            }
        });

        return $resultTab;
    };


    var closeTab = function (source) {
        var $tab = $(source),
            notLastTab = $(".tab-result").length > 1;

        if ($tab.hasClass("current-tab-result") && notLastTab) {
            var nextCurrentTabId = getNextCurrentTabId($tab);
            setToCurrent(nextCurrentTabId);
        }

        var tabId = $tab.attr('data-tab');
        makeClosed(tabId);
        $tab.remove();
    };


    var startErrorAnimation = function (source) {
        return;
        var $source = $(source);
        console.log($source.css("backgroundColor"));


        $source.animate({backgroundColor: '#FA8072'}, "fast");
        $source.animate({backgroundColor: '#EDEDF2'}, "fast");
    };


    var show = function () {
        console.log(_tabStates);
        console.log(_resultTabsObjects);
        return _tabStates;
    };


    var showCurr = function () {
        console.log(_currentResultTabId);
        return _currentResultTabId;
    };


    return {
        create: create,
        closeTab: closeTab,

        setToCurrent: setToCurrent,
        addInterfaceTabToResult: addInterfaceTabToResult,
        getOpenedTabsIds: getOpenedTabsIds,
        isCurrent: isCurrent,
        isOpened: isOpened,

        updateTab: updateTab,

        //debug
        show: show,
        showCurr: showCurr
    };
}());