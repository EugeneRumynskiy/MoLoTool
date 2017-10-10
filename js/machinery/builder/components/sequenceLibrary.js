/**
 * Created by swm on 20.06.17.
 */
var sequenceLibrary = (function () {
    var _fileName = "sequenceLibrary",

        _tabLibrary,
        _tabIdRange;


    var create = function (tabIdRange) {
        _tabLibrary = {};
        _tabIdRange = tabIdRange;
    };


    var addTab = function (seqValues) {
        var newTab = createTab(seqValues),
            newItemId = undefined;

        if (! $.isEmptyObject(newTab)) {
            newItemId = addTabToLibrary(newTab);
        }

        return newItemId;
    };


    var createTab = function (seqValues) {
        var newSequence = {};

        if (seqValuesNotEmpty(seqValues)) {
            newSequence = {
                "seqValues": {
                    "title": seqValues["title"],
                    "sequence": seqValues["sequence"]
                }
            };
        }

        return newSequence;
    };


    var seqValuesNotEmpty = function (seqValues) {
        if ($.isEmptyObject(seqValues) || $.isEmptyObject(seqValues["sequence"]))  {
            errorHandler.logError({"fileName": _fileName, "message": "can't create new newTab: SeqValues undefined"});
            return false;
        } else if  (seqValues["sequence"] === "None") {
            errorHandler.logError({"fileName": _fileName, "message": "can't create new newTab: SeqValues are None"});
            return false;
        }
        return true
    };


    var addTabToLibrary = function (newTab) {
        var nextTabId = getNextTabId();

        if (nextTabId !== -1) {
            _tabLibrary[nextTabId] = newTab;
            return nextTabId;
        } else {
            return undefined;
        }
    };


    var getNextTabId = function () {
        for(var tabId = _tabIdRange.min; tabId <= _tabIdRange.max; tabId++) {
            if (!(tabId in _tabLibrary)) {
                return tabId;
            }
        }

        inputErrors.addToLog("sequenceCountExceeded");
        errorHandler.logError({"fileName": _fileName, "message": "sequenceCountExceeded"});
        return -1;
    };


    var isRecorded = function(tabId) {
        return _tabLibrary.hasOwnProperty(tabId);
    };


    var getItemById = function (tabId) {
        var item = {};

        if (isRecorded(tabId)) {
            item = _tabLibrary[tabId];
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "getItemById error, empty _tabLibrary item"});
        }

        return item;
    };


    var getAllItems = function () {
        return $.map(Object.keys(_tabLibrary), getItemById);
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


    var clear = function () {
        $(".tab-result .close").trigger("click");
    };


    //debug
    var show = function () {
        console.log(_tabLibrary);
    };


    return {
        create: create,
        addTab: addTab,

        getItemById: getItemById,
        isRecorded: isRecorded,
        clear: clear,

        deleteTabContentById:deleteTabContentById,
        //debug
        show: show
    };
}());
