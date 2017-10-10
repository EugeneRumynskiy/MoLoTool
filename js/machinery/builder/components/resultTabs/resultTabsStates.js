var resultTabsStates = (function () {
    var _fileName = "resultTabsStates",

        _tabStates = {},  //idIsOpened?
        _tabIdRange;


    var setTabIdRange = function (tabIdRange) {
        _tabIdRange = tabIdRange;
    };


    var getTabIdRange = function () {
        checkTabIdRange();
        return _tabIdRange;
    };


    var checkTabIdRange = function () {
        if (_tabIdRange === undefined) {
            var defaultTabIdRange = {"min": 1, "max": 10};
            setTabIdRange(defaultTabIdRange);

            errorHandler.logError({"fileName": _fileName, "message": "checkTabIdRange," +
            " defaultTabIdRange is set (min:1, max:10)"});
        }
    };


    var setTabState = function (tabId, val) {
        if (ifValidTabId(tabId)) {
            _tabStates[tabId] = val;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "setTabState, invalid tabId value"});
        }
    };


    var getTabState = function (tabId) {
        if (ifValidTabId(tabId)) {
            if (_tabStates.hasOwnProperty(tabId)){
                var tabState = _tabStates[tabId];

                if (ifValidTabState(tabState)) {
                    return tabState;
                } else {
                    errorHandler.logError({"fileName": _fileName, "message": "getTabState, invalid tabState value"});
                    return undefined;
                }
            } else {
                errorHandler.logError({"fileName": _fileName, "message": "getTabState," +
                " _tabStates.hasOwnProperty(tabId) is false "});
                return undefined;
            }
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "getTabState, invalid tabId value"});
            return undefined;
        }
    };


    var ifValidTabId = function (tabId) {
        var tabIdRange = getTabIdRange();
        return (tabId >= tabIdRange.min && tabId <= tabIdRange.max);
    };


    var ifValidTabState = function (tabState) {
        return (tabState === false || tabState === true);
    };


    var initTabStates = function () {
        var tabIdRange = getTabIdRange();

        for (var tabId = tabIdRange.min; tabId <= tabIdRange.max; tabId++) {
            setTabState(tabId, false);
        }
    };


    var idIsOpened = function (tabId) {
        var tabState = getTabState(tabId);
        return (tabState === true);
    };


    var create = function (tabIdRange) {
        setTabIdRange(tabIdRange);
        initTabStates();
    };


    var openId = function (tabId) {
        if (getTabState(tabId) === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "openId, tab state is undefined"});
        } else {
            setTabState(tabId, true);
        }
    };


    var closeId = function (tabId) {
        if (getTabState(tabId) === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "closeId, tab state is undefined"});
        } else {
            setTabState(tabId, false);
        }
    };


    var getOpenedIds = function () {
        var openedTabsIds = [];

        for (var key in _tabStates) {
            if (idIsOpened(key)) {
                openedTabsIds.push(key);
            }
        }

        return openedTabsIds;
    };


    var show = function () {
        console.log(_tabStates);
        return _tabStates;
    };


    return {
        create: create,

        idIsOpened: idIsOpened,
        openId: openId,
        closeId: closeId,
        getOpenedIds: getOpenedIds,
        getTabIdRange: getTabIdRange,

        //debug
        show: show
    };
}());