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


//debug
var _timeStamp = 0,
    _timeString = "";


//debug
var getThenSetTime = function () {
    var result = performance.now() - _timeStamp;
    _timeStamp = performance.now();
    _timeString += result + " ";
    return result;
};

_dialog = $( "#error-dialog" );
_dialog.dialog({
    autoOpen: false,
    closeOnEscape: true,
    resizable: false,

    title: "Input warning",
    minWidth: 580,
    minHeight: 200,
    maxHeight: 500,
    buttons: [
        {
            text: "ok",
            click: function() {
                $( this ).dialog( "close" );
            }

            // Uncommenting the following line would hide the text,
            // resulting in the label being used as a tooltip
            //showText: false
        }
    ]
});

//

/*
    INLINE IF

 var c = (a < b) ? "a is less than b"  : "a is not less than b";
 b = (typeof b !== 'undefined') ?  b : 1;
 */


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