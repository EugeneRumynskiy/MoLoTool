/**
 * Created by HOME on 04.02.2017.
 */
var motifLibrary = (function () {
    var _fileName = "motifLibrary", _library = [];

    //Array of promises is returned
    var setPromisesForSelectedMotifs = function(motifNameList) {
        var promisesList = [];
        globalMotifLibrary = {"allMotifsSaved": false, "motifs": []};

        promisesList = $.map(motifNameList, promiseMotif);
        return promisesList;
    };


    var promiseMotif = function (motifName) {
        var data;
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/motif/" + motifName + ".json?with_matrices=true&with_thresholds=true",
            data: data
        }).then(function(result){
            globalMotifLibrary["motifs"].push(result);
            //console.log(JSON.stringify(result) + "\n");
        });
    };


    var setupMotifs = function (motifNameList) {
        var promises = setPromisesForSelectedMotifs(motifNameList);

        $.when.apply(this, promises)
            .then(function(){
                globalMotifLibrary["allMotifsSaved"] = true;
                for(var i = 0; i < globalMotifLibrary["motifs"].length; i++) {
                    motif.setMotifValues(globalMotifLibrary["motifs"][i]);
                }
                console.log('done, all motifs saved and here they are<\n', globalMotifLibrary, '\n>\n');
            });
    };


    var addToLibrary = function (motifName) {
    };



    return {
        setupMotifs: setupMotifs
    };

}());