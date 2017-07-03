var motifHandler = (function () {
    var _fileName = "motifHandler",
        _motifNameList = [],

        //debug
        _timeStamp = 0,
        _timeString = "";

    var setup = function (motifNameList) {
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


    var updateResultTab = function (tabId) {
        sequenceTabs.getTabContentById
    };

    
    var handleMotifs = function () {
        //ToDo: add pValue into inputParsing

        var sequence = inputParsing.parseInput()[0]["sequence"],
            //title = inputParsing.parseInput()[0]["title"],
            //primarySequence = inputParsing.parseInput()[0],
            pValue = pSlider.getPValue(),

            userRequestedNames = motifPicker.getRequestedMotifNames(),
            userRequestedMotifs = motifLibrary.getUserRequestedMotifUnits(userRequestedNames),

            sites = [];


        for(var i = 0; i < userRequestedMotifs.length; i++) {
            motif.setMotifValues(userRequestedMotifs[i]);

            if (sequence.length >= motif.getLength()) {
                sites = sites.concat(motif.findSites(sequence, pValue));
            }
        }

        resultContainer.updateWith(sequenceConstructor.markupSegmentation(sequence, sites));

        if (!$("#motif-table-cmp").hasClass("hidden")) {
            motifTable.redrawTableWithSites(sites);
        }


        var openedTabsIds = resultTabs.getOpenedTabsIds();
        for(var g = 0; g < openedTabsIds.length; g++) {
            tabId = openedTabsIds[g];
            sequence = sequenceTabs.getTabContentById(tabId).seqValues.sequence;
            sites = [];

            for(var i = 0; i < userRequestedMotifs.length; i++) {
                motif.setMotifValues(userRequestedMotifs[i]);

                if (sequence.length >= motif.getLength()) {
                    sites = sites.concat(motif.findSites(sequence, pValue));
                }
            }

            resultTabs.updateTab(tabId,
                sequenceConstructor.markupSegmentation(sequence, sites)
            );
        }



    };


    return {
        handleMotifs: handleMotifs,
        getResultTabsSequences: getResultTabsSequences
    };

}());