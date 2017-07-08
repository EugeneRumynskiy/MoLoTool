/**
 * Created by swm on 20.06.17.
 */
var sequenceTabs = (function () {
    var _fileName = "sequenceTabs",

        _openedTabsIds,
        _features,
        _tabIdRange;


    var create = function () {
        _openedTabsIds = {};

        _features = ["name", "seqTitle", "seqSequence"];
        _tabIdRange = {"min": 1, "max": 10};
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
        for(var tabId = _tabIdRange.min; tabId <= _tabIdRange.max; tabId++) {
            if (!(tabId in _openedTabsIds)) {
                return tabId;
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


    var getTabIdRange = function () {
        return _tabIdRange;
    };


    var isRecorded = function(tabId) {
        return tabId in _openedTabsIds;
    };


    var createInterfaceTab = function (newTab) {
        var $interfaceTab = $(
            '<li class="tab-link interface-button" data-tab=' + newTab["name"] + '>' +
            '<a class="tab-name" href="#">' +"Tab#" + newTab["name"] + '</a>' +
            '<a href="#" class="add"></a>' +
            '<a href="#" class="close"></a>' +
            '</li>'
        );

        $interfaceTab.on("click", function(event) {
            event.preventDefault();

            if (event.target.className == "add") {
                //deleteTab(this);
            } else {
                var tabId = $(this).attr("data-tab");
                setTabToCurrent(this);
                //resultTabs.setToCurrent($(".tab-result[data-tab=" + tabId + "]"));
                resultTabs.setToCurrent(tabId);

                if (resultTabs.isOpened(tabId)) {
                    motifHandler.updateResultTab(tabId);
                }
            }
        });

        return $interfaceTab;
    };


    var switchButton = function ($target) {
        console.log($target);
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
        if (isRecorded(tabId)) {
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


    var startErrorAnimation = function (source) {
        var $source = $(source);
        console.log($source);

        $source.animate({backgroundColor: '#FA8072'}, "fast");
        $source.animate({backgroundColor: '#EDEDF2'}, "fast");
    };


    //debug
    var show = function () {
        console.log(_openedTabsIds);
    };


    return {
        create: create,
        addTab: addTab,

        getTabIdRange: getTabIdRange,
        getTabContentById: getTabContentById,
        isRecorded: isRecorded,

        updateSeqInputWithTabContent: updateSeqInputWithTabContent,
        updateCurrentTabSequence: updateCurrentTabSequence,

        setTabToCurrent: setTabToCurrent,
        switchButton: switchButton,
        //debug
        show: show
    };
}());
