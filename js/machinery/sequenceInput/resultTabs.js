/**
 * Created by swm on 27.06.17.
 */
var resultTabs = (function () {
    var _fileName = "resultTabs",

        _tabStates,  //isOpened?
        _resultTabsObjects,

        _tabIdRange;


    var create = function (tabIdRange) {
        _tabIdRange = tabIdRange;

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

    //
    var isOpened = function (tabId) {
        var tabState = _tabStates[tabId];

        if (tabState === undefined) {
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
    var deleteTab = function (tabId) {
        if (_tabStates[tabId] === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "tab state is undefined, deleteTab"});
        } else {
            _tabStates[tabId] = false;
        }
    };

    //
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


    var addTabToResultById = function (tabId) {
        if (!sequenceLibrary.isRecorded(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, id not in sequenceLibrary"});
        } else if (isOpened(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, it's already in result"});
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
            //motifHandler.updateResultTab(tabId);
        }
    };


    var createTab = function (tabId) {
        var $resultTab = $(
            '<div class="tab-result" data-tab=' + tabId + '>' +
                '<a href="#" class="tab-result-name" data-tab=' + tabId + '>#' + tabId + '</a>' +
                '<a href="#" class="close"></a>' +
                '<div class="tab-result-sequence round flattened">'
                    + '<div class="sequence"></div>' +
                '</div>' +
            '</div>'
        );

        $resultTab.on("click", function(event) {
            event.preventDefault();

            if (event.target.className === "close") {
                closeTab(this);
            }
        });

        return $resultTab;
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
        _resultTabsObjects[tabId].empty().html(content);
    };


    var startErrorAnimation = function (source) {
        var $source = $(source);
        console.log($source.css("backgroundColor"));


        $source.animate({backgroundColor: '#FA8072'}, "fast");
        $source.animate({backgroundColor: '#EDEDF2'}, "fast");
    };



    var closeTab = function (source) {
        var $tab = $(source),
            tabId = $tab.attr('data-tab');

        deleteTab(tabId);
        sequenceLibrary.deleteTabContentById(tabId);
        $tab.remove();
    };


    var show = function () {
        console.log(_tabStates);
        console.log(_resultTabsObjects);
        return _tabStates;
    };


    return {
        create: create,
        closeTab: closeTab,

        addTabToResultById: addTabToResultById,
        getOpenedTabsIds: getOpenedTabsIds,

        updateTab: updateTab,
        //debug
        show: show,
    };
}());