var motifHandler = (function () {
    var _fileName = "motifHandler",

        _requestedPvalue,
        _requestedMotifs;


    var handleMotifs = function (event) {
        if (event === "clearTable" ) {
            motifTable.clearTable();
        } else {
            makeFullUpdate();
        }
    };


    var makeFullUpdate = function () {
        setRequestedPvalue();
        setRequestedMotifs();

        var tabsUpdate = updateResultTabs();

        updateTable(tabsUpdate);
    };


    var setRequestedPvalue = function () {
        _requestedPvalue = pSlider.getPValue();
    };


    var setRequestedMotifs = function () {
        var requestedNames = motifPicker.getRequestedMotifNames();
        _requestedMotifs = motifLibrary.getUserRequestedMotifUnits(requestedNames);
    };


    var updateResultTabs = function () {
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
            motifs = _requestedMotifs, pValue = _requestedPvalue;

        for(var i = 0; i < motifs.length; i++) {
            motif.setMotifValues(motifs[i]);

            if (sequence.length >= motif.getLength()) {
                sites = sites.concat(motif.findSites(sequence, pValue));
            }
        }

        return sites;
    };


    var updateTable = function (tabsUpdate) {
        if (getTableState() === "active") {
            motifTable.redrawTableWithUpdates(tabsUpdate);
        }
    };


    var getTableState = function () {
        return ($("#motif-table-cmp").hasClass("disabled")) ? "disabled" : "active";
    };


    return {
        handleMotifs: handleMotifs
    };
}());