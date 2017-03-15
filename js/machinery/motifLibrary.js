/**
 * Created by HOME on 04.02.2017.
 */
var motifLibrary = (function () {
    var _moduleName = "motifLibrary", _library = {},
        _eventHandler = function() {},
        _featuresForTable = null,
        _featuresForTableLibrary = {}, //created to speed up requests when building table
        _logoUrl = "http://hocomoco.autosome.ru";


    var create = function (eventHandler) {
        _featuresForTable = {
            "direct_logo_url": "Logo",
            "uniprot_id": "Uniprot ID",
            "motif_families": "Families",
            "motif_subfamilies": "Subfamilies"};
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
        if (inLibrary(motifName)) {
            handleEvent();
            errorHandler.logError({"fileName": _moduleName, "message": "motif already in the library"});
        } else {
            _library[motifName] = {status: "promised"};
            promiseMotif(motifName).then(
                function(motif){
                    motif.status = "resolved";
                    _library[motif["full_name"]] = motif;
                    _featuresForTableLibrary[motif["full_name"]] = requestTableValues(motif);
                    handleEvent();
                    //console.log(JSON.stringify(motif) + "\n");
                });
        }
    };


    var inLibrary = function (motifName) {
        return ("undefined" !== typeof(_library[motifName]));
    };


    var promiseMotif = function (motifName) {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/motif/" + motifName + ".json?with_matrices=true&with_thresholds=true"
        });
    };


    var requestTableValues = function (motif) {
        if (_featuresForTable == null) {
            errorHandler.logError({"fileName": _moduleName, "message": "motifLibrary must be created _featuresForTable = null"});
            return {};
        } else {
            var motifTableValues = {}, propertyName, logoFullUrl;
            for (var property in _featuresForTable) {
                propertyName = _featuresForTable[property];
                if (propertyName == "Logo") {
                    logoFullUrl = _logoUrl + motif[property];
                    motifTableValues[propertyName] = '<img src="'+logoFullUrl+'" />';
                } else {
                    motifTableValues[propertyName] = motif[property];
                }
            }
            return motifTableValues;
        }
    };


    var getFeaturesForTable = function () {
        if (_featuresForTable == null) {
            errorHandler.logError({
                "fileName": _moduleName,
                "message": "motifLibrary must be created _featuresForTable = null"
            });
            return [];
        } else {
            return Object.values(_featuresForTable);
        }
    };


    var getUnitByName = function (motifName) {
        if (inLibrary(motifName)) {
            if (_library[motifName].status == "promised") {
                errorHandler.logError({"fileName": _moduleName, "message": "Motif status: promised. The result" +
                " will be updated right after promise completion."});
            } else {
                return _library[motifName];
            }
        } else {
            errorHandler.logError({"fileName": _moduleName, "message": "motif not in the library"});
        }
    };


    var getMotifFeaturesForTable = function (motifName) {
        return _featuresForTableLibrary[motifName];
    };


    var getUnits = function (motifNameList) {
        return $.map(motifNameList, getUnitByName);
    };


    var getUserRequestedUnits = function (userRequestedNames) {
        return getUnits(userRequestedNames);
    };



    var showLibrary = function () {
        console.log(_library);
    };


    return {
        create: create,
        showLibrary: showLibrary,
        addUnit: addUnit,
        getUserRequestedUnits: getUserRequestedUnits,
        getMotifFeaturesForTable: getMotifFeaturesForTable,
        getFeaturesForTable: getFeaturesForTable

    };
}());