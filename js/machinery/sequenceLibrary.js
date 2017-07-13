/**
 * Created by swm on 20.06.17.
 */
var sequenceLibrary = (function () {
    var _fileName = "sequenceLibrary",

        _tabLibrary,
        _tabIdRange;


    var create = function () {
        _tabLibrary = {};

        _tabIdRange = {"min": 1, "max": 10};
    };


    var addTab = function (seqValues) {
        var newTab = createTab(seqValues);

        if ($.isEmptyObject(newTab)) {
            errorHandler.logError({"fileName": _fileName, "message": "can't create add new newTab"});
        } else {
            addTabToLibrary(newTab);
        }
    };


    var createTab = function (seqValues) {
        if (seqValues === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "can't create new newTab"});
            return undefined
        } else {
            return {
                "seqValues": {
                    "title": seqValues["title"],
                    "sequence": seqValues["sequence"]
                }
            };
        }
    };


    var addTabToLibrary = function (newTab) {
        var nextTabId = getNextTabId();

        if (nextTabId !== -1) {
            _tabLibrary[nextTabId] = newTab;
            resultTabs. addTabToResultById(nextTabId);
            return true;
        } else {
            return false;
        }
    };


    var getNextTabId = function () {
        for(var tabId = _tabIdRange.min; tabId <= _tabIdRange.max; tabId++) {
            if (!(tabId in _tabLibrary)) {
                return tabId;
            }
        }
        errorHandler.logError({"fileName": _fileName, "message": "maximum tabs count exceeded, delete one of current tabs"});
        return -1;
    };


    var getTabIdRange = function () {
        return _tabIdRange;
    };


    var isRecorded = function(tabId) {
        return tabId in _tabLibrary;
    };


    var getTabContentById = function (tabId) {
        if ($.isEmptyObject(_tabLibrary[tabId])) {
            return {};
        } else {
            return _tabLibrary[tabId];
        }
    };


    var updateSeqInputWithTabContent = function (tabContent) {
        var $seqInput = $("#sequence-input");
        $seqInput.val(tabContent["seqValues"]["sequence"]);
    };


    var deleteTabContentById = function (tabId) {
        if (isRecorded(tabId)) {
            delete _tabLibrary[tabId];
            return true;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be deleted"});
            return false;
        }
    };


    var updateCurrentTabSequence = function (newSequence) {
        var currentTabId = $("li.current-tab").attr("data-tab");

        if($.isEmptyObject(_tabLibrary[currentTabId])) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be updated because not exists"});
        } else {
            _tabLibrary[currentTabId]["seqValues"]["sequence"] = newSequence;
        }
    };



    //debug
    var show = function () {
        console.log(_tabLibrary);
    };


    return {
        create: create,
        addTab: addTab,

        getTabIdRange: getTabIdRange,
        getTabContentById: getTabContentById,
        isRecorded: isRecorded,

        updateCurrentTabSequence: updateCurrentTabSequence,

        //debug
        show: show
    };
}());
