var motifHandler = (function () {
    var _fileName = "motifHandler",

        _pValue,
        _requestedMotifs;


    var handleMotifs = function (event) {
        console.log(event);
        if (event === "clearTable" ) {
            motifTable.clearTable();
        } else {
            makeFullUpdate();
        }
    };


    var makeFullUpdate = function () {
        updatePvalue();
        updateMotifs();

        var tabsUpdate = updateAllResultTabs();

        if (getTableState() === "active") {
            updateTable(tabsUpdate);
        }
    };


    var updatePvalue = function () {
        _pValue = pValue = pSlider.getPValue();
    };


    var updateMotifs = function () {
        var userRequestedNames = motifPicker.getRequestedMotifNames();
        _requestedMotifs = motifLibrary.getUserRequestedMotifUnits(userRequestedNames);
    };


    var updateAllResultTabs = function () {
        var openedTabsIds = resultTabs.getIdsToHandle(),
            tabsUpdate = $.map(openedTabsIds, updateResultTab);

        return tabsUpdate;
    };


    var updateResultTab = function(tabId) {
        var sequence = sequenceLibrary.getItemById(tabId).seqValues.sequence,
            sites = getSitesForAllMotifs(sequence);

        resultTabs.updateTab(tabId,
            sequenceConstructor.markupSegmentation(sequence, sites, tabId));

        var tabUpdate = {
            "sites": sites,
            "tabId": tabId
        };

        return tabUpdate;
    };


    var getSitesForAllMotifs = function (sequence) {
        var sites = [],
            motifs = _requestedMotifs, pValue = _pValue;

        for(var i = 0; i < motifs.length; i++) {
            motif.setMotifValues(motifs[i]);

            if (sequence.length >= motif.getLength()) {
                sites = sites.concat(motif.findSites(sequence, pValue));
            }
        }

        return sites;
    };


    var updateTable = function (tabsUpdate) {
        motifTable.redrawTableWithUpdates(tabsUpdate);
    };


    var getTableState = function () {
        return ($("#motif-table-cmp").hasClass("disabled")) ? "disabled" : "active";
    };


    return {
        handleMotifs: handleMotifs
    };
}());