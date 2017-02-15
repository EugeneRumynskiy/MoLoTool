/**
 * Created by HOME on 04.02.2017.
 */
var motifLibrary = (function () {
    var _fileName = "motifLibrary", _library = {},
        _eventHandler = function() {};


    var create = function (eventHandler) {
        _library = {};
        setEventHandlerTo(eventHandler);
    };


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };

    var handleEvent = function () {
        _eventHandler();
    };


    var addUnit = function (motifName) {
        if (motifIn(motifName)) {
            handleEvent();
            errorHandler.logError({"fileName": _fileName, "message": "motif already in the library"});
        } else {
            _library[motifName] = {status: "promised"};
            promiseMotif(motifName).then(
                function(result){
                    result.status = "resolved";
                    _library[result["full_name"]] = result;
                    handleEvent();
                    //console.log(JSON.stringify(result) + "\n");
                });
        }
    };


    var motifIn = function (motifName) {
        return ("undefined" !== typeof(_library[motifName]));
    };


    var promiseMotif = function (motifName) {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/motif/" + motifName + ".json?with_matrices=true&with_thresholds=true"
        });
    };


    var getUnit = function (motifName) {
        if (motifIn(motifName)) {
            if (_library[motifName].status == "promised") {
                errorHandler.logError({"fileName": _fileName, "message": "Motif status: promised. The result" +
                " will be updated right after promise completion."});
            } else {
                return _library[motifName];
            }
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "motif not in the library"});
        }
    };


    var getUnits = function (motifNameList) {
        return $.map(motifNameList, getUnit);
    };


    var getUserRequestedUnits = function () {
        var requestedNames = motifPicker.getUserRequestedNames();
        return getUnits(requestedNames);
    };


    var showLibrary = function () {
        console.log(_library);
    };


    return {
        showLibrary: showLibrary,
        addUnit: addUnit,
        getUserRequestedUnits: getUserRequestedUnits,
        create: create
    };
}());