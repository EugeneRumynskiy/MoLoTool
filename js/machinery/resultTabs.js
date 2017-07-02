/**
 * Created by swm on 27.06.17.
 */
var resultTabs = (function () {
    var _fileName = "resultTabs",

        _tabStates,

        _features,
        _maxTabCount;


    var create = function () {
        _tabStates = initTabStates(sequenceTabs.getMaxTabCount());

        _features = ["name", "seqTitle", "seqSequence"];
        _maxTabCount = 10;
    };


    var initTabStates = function (maxTabCount) {
        var initialState = {};
        for (var i = 1; i <= maxTabCount; i++) {
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
        }
    };


    var makeClosed = function (tabId) {
        if (_tabStates[tabId] === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, makeClosed"});
        } else {
            _tabStates[tabId] = false;
        }
    };


    var setToCurrent = function (tabId) {
        var $source = $(".tab-result[data-tab=" + tabId + "]");

        $('#result-cmp').children(".tab-result").removeClass('current-tab-result');
        $source.addClass('current-tab-result');
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
            if (insertBeforeId == tabId) {
                $target.append($resultTab);
            } else {
                $resultTab.insertBefore($(".tab-result[data-tab=" + insertBeforeId + "]"))
            }
            makeOpened(tabId);
            setToCurrent(tabId);
        }
    };


    var getNextHighestResultTabId = function (tabId) {
        for (var i = 1; i <= _maxTabCount; i++) {
            if (_tabStates[i] && (tabId < i)) {
                return i;
            }
        }
        return tabId;
    };


    var createTab = function (tabId) {
        //'<a href="#" class="close"></a>' +
        var $resultTab = $(
            '<div class="tab-result" data-tab=' + tabId + '>' +
                '<a href="#" class="tab-result-name" data-tab=' + tabId + '>#' + tabId + '</a>' +
                '<a href="#" class="close"></a>' +
                '<div class="tab-result-sequence round"></div>' +
            '</div>'
        );

        $resultTab.on("click", function(event) {
            event.preventDefault();

            if (event.target.className == "close") {
                var tabId = $(this).attr('data-tab'),
                    $target = $(".tab-link[data-tab=" + tabId + "]").children(".close");
                console.log($target);
                $target.siblings(".tab-name").click();
                $target.siblings(".add").css("display", "inherit");
                $target.css("display", "none");

                closeTab(this);
            } else {
                var tabId = $(event.target).attr("data-tab");
                setToCurrent(tabId);
                sequenceTabs.setTabToCurrent($(".tab-link[data-tab=" + tabId + "]"));
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


    var getNextCurrentTabId = function ($tab) {
        var $nextTab = $tab.prev(".tab-result");

        if ($nextTab.length == 0) {
            $nextTab = $tab.next(".tab-result");
        }

        if ($nextTab.length == 0) {
            errorHandler.logError({"fileName": _fileName, "message": "getNextCurrentTabId error"});
        } else {
            return $nextTab.attr('data-tab');
        }
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
        return _tabStates;
    };


    return {
        create: create,
        closeTab: closeTab,

        setToCurrent: setToCurrent,
        addInterfaceTabToResult: addInterfaceTabToResult,

        //debug
        show: show
    };
}());