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
        var $interfaceTab = $(
                '<li class="tab-link interface-button" data-tab=' + newTab["name"] + '>' +
                    '<a href="#" class="close"></a>' +
                    '<a class="tab-name" href="#">' +"Tab#" + newTab["name"] + '</a>' +
                '</li>'
        );


        $interfaceTab.on("click", function(event) {
            if (event.target.className == "close") {
                deleteTab(this);
            } else {
                setTabToCurrent(this);
            }
        });


        return $interfaceTab;
    };


    var deleteTab = function (source) {
        var $tab = $(source),
            tabId = $tab.attr('data-tab'),
            notLastTab = Object.keys(_openedTabsIds).length > 1;

        if (notLastTab) {
            deleteTabContentById(tabId);
            $tab.remove();
            if ($tab.hasClass("current-tab")) {
                var lastTab = $("li.tab-link").last();
                setTabToCurrent(lastTab);
            }
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "last tab cannot be deleted"});
        }

    };


    var setTabToCurrent = function (source) {
        var $source = $(source),
            tabId = $source.attr('data-tab'),
            tabContent = getTabContentById(tabId);

        updateSeqInputWithTabContent(tabContent);

        $('.tab-link').removeClass('current-tab');
        $source.addClass('current-tab');

        motifHandler.handleMotifs();
    };

    var getTabContentById = function (tabId) {
        if ($.isEmptyObject(_openedTabsIds[tabId])) {
            return {};
        } else {
            return _openedTabsIds[tabId];
        }
    };


    var updateSeqInputWithTabContent = function (tabContent) {
        var $seqInput = $("#sequence-input");
        $seqInput.val(tabContent["seqValues"]["sequence"]);
    };


    var deleteTabContentById = function (tabId) {
        if (tabId in _openedTabsIds) {
            delete _openedTabsIds[tabId];
            return true;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be deleted"});
            return false;
        }
    };


    var updateCurrentTabSequence = function (newSequence) {
        var currentTabId = $("li.current-tab").attr("data-tab");

        if($.isEmptyObject(_openedTabsIds[currentTabId])) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be updated because not exists"});
        } else {
            _openedTabsIds[currentTabId]["seqValues"]["sequence"] = newSequence;
        }
    };


    //debug
    var show = function () {
        console.log(_openedTabsIds);
    };


    return {
        create: create,
        deleteTab: deleteTabContentById,
        addTab: addTab,

        getTabContentById: getTabContentById,

        updateSeqInputWithTabContent: updateSeqInputWithTabContent,
        updateCurrentTabSequence: updateCurrentTabSequence,

        //debug
        show: show
    };
}());
