var moduleName = (function () {
    var _myPrivateVariable = "moduleName";


    var myPublicFunction = function () {
        return something;
    };


    var myPrivateFunction = function () {
        return something
    };


    return {
        myPublicFunctionName: myPublicFunction
    };
}());

/*
segment object:
    segment = { start: 37, finish: 40, sites: Array[2], motifsInSegment: Object }

 site object
 sitesList.push({
    motifName: _name,
    scorePosition: scorePosition,
    siteLength: _pwmMatrix.length,
    strength: round(-Math.log10(pValue), _nDigits),
    strand: direction,
    pValue: round(pValue, _nDigits),
    motifSequence: flipSequence(motifSequence, direction == "-")
 });
*/