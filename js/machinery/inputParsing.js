/**
 * Created by HOME on 18.01.2017.
 */
var inputParsing = (function () {
    var _fileName = "inputParsing";

    //Get input string without leading and ending whitespace characters (space, tab, no-break space, etc.)
    var getInputString = function () {
        return $('#sequence-input').val().trim();
    };


    //TRUE if there are 1 or more fasta format sequences
    var ifFasta = function (inputString) {
        return inputString.indexOf(">") != -1;
    };


    var parseInputString = function () {
        var inputString = getInputString(), parsedUnits = [];

        if (ifFasta(inputString)) {
            parsedUnits = parseFastaInput(inputString);
        } else {
            parsedUnits.push({
                "sequence": parseNotFastaInput(inputString),
                "title": ""
            });
        }
        //console.log("parsed into parsedUnits ", parsedUnits, " \n")
        return parsedUnits;
    };


    var joinStrings = function (stringsList) {
        joinedString = "";
        for (var i = 0; i < stringsList.length; i++) {
            joinedString += stringsList[i];
        }
        return joinedString;
    };


    var removeSeparators = function (inputString, separator) {
        return joinStrings(inputString.split(separator));
    };


    var parseNotFastaInput = function (inputString) {
        var separator = /\W/;
        return removeSeparators(inputString, separator);
    };


    var parseFastaInput= function (inputString) {
        var outOfFormatCharacters = "",
            fastaUnits = [], parsedUnits = [];

        fastaUnits = inputString.split(">");

        //all characters before first ">"
        outOfFormatCharacters = fastaUnits[0];
        check(outOfFormatCharacters);

        for (var i = 1; i < fastaUnits.length; i++){
            parsedUnits.push(parseFastaUnit(fastaUnits[i]));
        }
        return parsedUnits;
    };


    var check = function (outOfFormatCharacters) {
        if (outOfFormatCharacters.length > 0) {
            console.log(outOfFormatCharacters + "<   alert outOfFormatCharacters before '<' \n")
        }
    };


    var parseFastaUnit= function (fastaUnit) {
        var separator = /\W/,
            titleEndPosition = fastaUnit.indexOf("\n"),
            title = fastaUnit.slice(0, titleEndPosition).trim(),
            sequence = fastaUnit.slice(titleEndPosition).trim();

        sequence = removeSeparators(sequence, separator);

        return {
            "sequence": sequence,
            "title": title
        };
    };


    return {
        parseInput: parseInputString,
        removeSeparators: removeSeparators
    };
}());