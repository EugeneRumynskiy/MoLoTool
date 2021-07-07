var features = (function () {
    var _moduleName = "features",
        _rowFeatures = null,
        _motifFeaturesRequest = function () {};


    var create = function (motifFeatureTitles, motifFeaturesRequest) {
        setMotifFeaturesRequest(motifFeaturesRequest);
        setFeatures(motifFeatureTitles);
    };


    var setMotifFeaturesRequest = function (motifFeaturesRequest) {
        _motifFeaturesRequest = motifFeaturesRequest;
    };


    var setFeatures = function (motifFeatureTitles) {
        var allFeatures = [].concat(motifFeatureTitles, ["Motif ID", "-log10(P-value)", "Seq name", "Sequence",
            "P-value", "Start", "End", "Strand"]),
            toShow = ["Motif ID", "-log10(P-value)", "Seq name", "Sequence", "Logo",
                "P-value", "Start", "End", "Strand"],
            //difference between two arrays
            toHide = $(allFeatures).not(toShow).get();

        _rowFeatures = {"toHide": toHide, "toShow": toShow};
    };


    var getFeatures = function (isHidden) {
        if (_rowFeatures === null){
            errorHandler.logError({"fileName": _moduleName, "message": "features haven't been set"});
            return null;
        } else {
            if (isHidden === true) {
                return _rowFeatures.toHide;
            } else if (isHidden === false) {
                return _rowFeatures.toShow;
            } else {
                errorHandler.logError({"fileName": _moduleName, "message": "isHidden value must be true or false"});
                return null;
            }
        }
    };


    var getFrom = function (site, tabId) {
        var motifName = site.motifName;
        return $.extend({}, motifFeatures(motifName), siteFeatures(site, tabId));
    };


    var motifFeatures = function (motifName) {
        return _motifFeaturesRequest(motifName);
    };


    var siteFeatures = function (site, tabId) {
        return {
            "Motif ID": getMotifNameWithUrl(site.motifName),
            "-log10(P-value)": site.strength,
            "P-value": getPvalueFromLogPvalue(site.strength),
            "Start": site.scorePosition,
            "End": site.scorePosition + site.siteLength - 1,
            "Sequence": site.motifSequence,
            "Seq name": sequenceLibrary.getItemById(tabId).seqValues.title,
            "Strand": site.strand
        };
    };


    var getMotifNameWithUrl = function (motifName) {
        var  hocomocoRef = "https://hocomoco11.autosome.ru/motif/" + motifName;
        return "<a href=\"" + hocomocoRef + "\" class=\"hocomoco-info\" target=\"_blank\">" +
            motifName + "</a>";
    };


    var getPvalueFromLogPvalue = function (log10Pvalue) {
        var pValue = Math.pow(10, -log10Pvalue);
        return pValue.toExponential(3);
    };


    return {
        create: create,
        getFeatures: getFeatures,
        getFrom: getFrom
    };
}());