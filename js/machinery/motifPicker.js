var motifPicker = (function () {
    var _fileName = "motifPicker",
        _nameLibrary = [];


    var getNames = function () {
        console.log("getNames");
        $.when(promisedNames())
            .then(function(){
                var motifContainers = $.map(_nameLibrary, createContainer).join('');
                $('#motif-list').html(motifContainers);
            });
    };


    var promisedNames = function () {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/human/mono.json"
        }).then(function(nameLibrary){
            _nameLibrary = nameLibrary;
        });
    };


    var createContainer = function (motifName) {
        return '<div class="motif-container"' + 'id="' + inputParsing.removeSeparators(motifName, ".") + '">' +
            '<div class="motif-title">'+ motifName +'</div>' +
            '</div>';
    };


    //Array of promises is returned
    var setPromisesForSelectedMotifs = function(motifNameList) {
        var data, promisesList = [];
        globalMotifLibrary = {"allMotifsSaved": false, "motifs": []};

        promisesList = $.map(motifNameList, function(motifName){
            return $.ajax({
                dataType: "json",
                url: "http://hocomoco.autosome.ru/motif/" + motifName + ".json?with_matrices=true&with_thresholds=true",
                data: data
            }).then(function(result){
                globalMotifLibrary["motifs"].push(result);
                //console.log(JSON.stringify(result) + "\n");
            });
        });
        return promisesList;
    };


    var myPrivateFunction = function () {
        return something
    };


    return {
        getNames: getNames
    };
}());/**
 * Created by HOME on 02.02.2017.
 */
