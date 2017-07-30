var motifHandler = (function () {
    var _fileName = "motifHandler",

        _pValue,
        _requestedMotifs,

        //debug
        _timeStamp = 0,
        _timeString = "",

        _tableIsActive = false;


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
            sites = [];

        for(var i = 0; i < _requestedMotifs.length; i++) {
            motif.setMotifValues(_requestedMotifs[i]);

            if (sequence.length >= motif.getLength()) {
                sites = sites.concat(motif.findSites(sequence, _pValue));
            }
        }

        resultTabs.updateTab(tabId,
            sequenceConstructor.markupSegmentation(sequence, sites, tabId)
        );

        return sites;
    };


    var updateTable = function (sites) {
        motifTable.redrawTableWithSites(sites);
    };


    var updateAllResultTabs = function (event) {
        var openedTabsIds = resultTabs.getIdsToHandle(event),
            sites = $.map(openedTabsIds, updateResultTab);

        console.log(openedTabsIds, "updated id's\n");
        return sites;
    };


    var handleMotifs = function (event) {
        updatePvalue();
        updateMotifs();

        var sites = updateAllResultTabs(event),
            tableState = ($("#motif-table-cmp").hasClass("hidden")) ? "hidden" : "visible";

        if (tableState === "visible") {
            updateTable(sites);
        }
    };


    return {
        handleMotifs: handleMotifs
    };

}());