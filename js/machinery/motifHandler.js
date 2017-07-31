var motifHandler = (function () {
    var _fileName = "motifHandler",

        _pValue,
        _requestedMotifs,

        //debug
        _timeStamp = 0,
        _timeString = "";


    var create = function (motifNameList) {
        //Todo
    };


    //debug
    var getThenSetTime = function () {
        var result = performance.now() - _timeStamp;
        _timeStamp = performance.now();
        _timeString += result + " ";
        return result;
    };
    //

    var updatePvalue = function () {
        _pValue = pValue = pSlider.getPValue();
    };


    var updateMotifs = function () {
        var userRequestedNames = motifPicker.getRequestedMotifNames();
        _requestedMotifs = motifLibrary.getUserRequestedMotifUnits(userRequestedNames);
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


    var updateAllResultTabs = function (event) {
        var openedTabsIds = resultTabs.getIdsToHandle(event),
            tabsUpdate = $.map(openedTabsIds, updateResultTab);

        return tabsUpdate;
    };


    var handleMotifs = function (event) {
        updatePvalue();
        updateMotifs();

        var tabsUpdate = updateAllResultTabs(event),
            tableState = ($("#motif-table-cmp").hasClass("hidden")) ? "hidden" : "visible";

        if (tableState === "visible") {
            updateTable(tabsUpdate);
        }
    };


    return {
        handleMotifs: handleMotifs
    };

}());