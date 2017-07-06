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

    var getResultTabsSequences = function () {
        return $.map(
            resultTabs.getOpenedTabsIds(),
            sequenceTabs.getTabContentById
        );
    };

    var updatePvalue = function () {
        _pValue = pValue = pSlider.getPValue();
    };


    var updateMotifs = function () {
        var userRequestedNames = motifPicker.getRequestedMotifNames();
        _requestedMotifs = motifLibrary.getUserRequestedMotifUnits(userRequestedNames);
    };


    var updateResultTab = function(tabId) {
        var sequence = sequenceTabs.getTabContentById(tabId).seqValues.sequence,
            sites = [];

        for(var i = 0; i < _requestedMotifs.length; i++) {
            motif.setMotifValues(_requestedMotifs[i]);

            if (sequence.length >= motif.getLength()) {
                sites = sites.concat(motif.findSites(sequence, _pValue));
            }
        }

        resultTabs.updateTab(tabId,
            sequenceConstructor.markupSegmentation(sequence, sites)
        );

        if (resultTabs.isCurrent(tabId)) {
            if (!$("#motif-table-cmp").hasClass("hidden")) {
                motifTable.redrawTableWithSites(sites);
            }
        }
    };


    var updateAllResultTabs = function () {
        var openedTabsIds = resultTabs.getOpenedTabsIds();
        $.map(openedTabsIds, updateResultTab);
    };


    var handleMotifs = function () {
        /*var sequence = inputParsing.parseInput()[0]["sequence"],
            sites = [];*/

       /* for(var i = 0; i < _requestedMotifs.length; i++) {
            motif.setMotifValues(_requestedMotifs[i]);

            if (sequence.length >= motif.getLength()) {
                sites = sites.concat(motif.findSites(sequence, _pValue));
            }
        }

        resultContainer.updateWith(sequenceConstructor.markupSegmentation(sequence, sites));*/

        updatePvalue();
        updateMotifs();
        updateAllResultTabs();
    };


    var handleTab = function () {

    };


    return {
        handleMotifs: handleMotifs,
        getResultTabsSequences: getResultTabsSequences,

        updatePvalue: updatePvalue,
        updateMotifs: updateMotifs,

        updateResultTab: updateResultTab,
        updateAllResultTabs: updateAllResultTabs
    };

}());