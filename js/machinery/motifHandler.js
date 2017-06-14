var motifHandler = (function () {
    var _fileName = "motifHandler",
        _motifNameList = [];

    var setup = function (motifNameList) {
        //Todo
    };
    
    
    var handleMotifs = function () {
        //ToDo: add pValue into inputParsing
        var sequence = inputParsing.parseInput()[0]["sequence"], title = inputParsing.parseInput()[0]["title"],
            primarySequence = inputParsing.parseInput()[0],
            pValue = $("#linearSlider-input").val(),

            userRequestedNames = motifPicker.getRequestedMotifNames(),
            userRequestedMotifs = motifLibrary.getUserRequestedUnits(userRequestedNames),

            sites = [];

        for(var i = 0; i < userRequestedMotifs.length; i++) {
            motif.setMotifValues(userRequestedMotifs[i]);
            sites = sites.concat(motif.findSites(sequence, pValue));
        }

        motifTable.redrawTableWithSites(sites, primarySequence);

        resultContainer.updateWith(sequenceConstructor.markupSegmentation(sequence, sites));
    };


    return {
        handleMotifs: handleMotifs
    };

}());