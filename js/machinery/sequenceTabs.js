/**
 * Created by swm on 20.06.17.
 */
var sequenceTabs = (function () {
    var _fileName = "sequenceTabs",
        _openedTabsIds,
        _features,
        _maxTabs;


    var create = function () {
        _openedTabsIds = {};
        _features = ["name", "seqTitle", "seqSequence"];
        _maxTabs = 10;
    };


    var addTab = function (seqValues, makeCurrent) {
        var newTab = addTabValues(seqValues);
        makeCurrent = (typeof makeCurrent !== 'undefined') ?  makeCurrent : false;

        if ($.isEmptyObject(newTab)) {
            errorHandler.logError({"fileName": _fileName, "message": "can't create new newTab"});
        } else {
            addTabToInterface(newTab, makeCurrent);
        }
    };


    var addTabValues = function (seqValues) {
        var nextTabId = getNextTabId(), tab = {};

        if (nextTabId != -1) {
            tab = {
                "name": nextTabId,
                "seqValues": {
                    "title": seqValues["title"],
                    "sequence": seqValues["sequence"]
                }
            };
            _openedTabsIds[nextTabId] = tab;
        }

        return tab;
    };


    var getNextTabId = function () {
        for(var i = 1; i <= _maxTabs; i++) {
            if (!(i in _openedTabsIds)) {
                return i;
            }
        }
        errorHandler.logError({"fileName": _fileName, "message": "maximum tabs count exceeded, delete one of current tabs"});
        return -1;
    };


    var addTabToInterface = function (newTab, makeCurrent) {
        var $target = $("ul.tabs"),
            $interfaceTab = createInterfaceTab(newTab);
        $target.append($interfaceTab);

        if (makeCurrent) {
            $interfaceTab.click();
        }
    };


    var createInterfaceTab = function (newTab) {
        var $interfaceTab = $('<li class="tab-link interface-button" data-tab=' + newTab["name"] + '>'
            + "Tab#" + newTab["name"] +
            '</li>');

        $interfaceTab.on("click", function() {
            var tabId = $(this).attr('data-tab'),
                tabContent = sequenceTabs.getTabContentById(tabId);
            sequenceTabs.setSeqInputToTabContent(tabContent);

            $('.tab-link').removeClass('current-tab');
            $(this).addClass('current-tab');
        });

        return $interfaceTab;
    };


    var getTabContentById = function (tabId) {
        if ($.isEmptyObject(_openedTabsIds[tabId])) {
            return {};
        } else {
            return _openedTabsIds[tabId];
        }
    };


    var setSeqInputToTabContent = function (tabContent) {
        var $seqInput = $("#sequence-input");
        $seqInput.val(tabContent["seqValues"]["sequence"]);
    };


    var deleteTab = function (tabId) {
        if (tabId in _openedTabsIds) {
            delete _openedTabsIds[tabId];
            return true;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be deleted"});
            return false;
        }
    };


    var show = function () {
        console.log(_openedTabsIds);
    };


    var getCurrentSequence = function () {
        console.log($(".current"));
    };

    return {
        create: create,
        deleteTab: deleteTab,
        addTab: addTab,

        getTabContentById: getTabContentById,

        setSeqInputToTabContent: setSeqInputToTabContent,

        //debug
        getCurrentSequence: getCurrentSequence,
        show: show
    };
}());
