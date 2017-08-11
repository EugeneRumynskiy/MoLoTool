/**
 * Created by HOME on 18.01.2017.
 */
var inputParsing = (function () {
    var _fileName = "inputParsing",
        _parsedSequences,
        _defaultParsedValues,
        _seqRegExp,

        _actualTest = ">mouse SLAMF1 promoter\n" +
            "TGATAAAGTGATTTAAAGCCTGATCATAAATGAGCAATCCTGGA\n" +
            ">human SLAMF1 promoter\n" +
            "CAAAAAAGTGATTTAAAGCCTCATGGGAGATGAGCAATCCTCAA\n" +
            ">myTitle_1 Second Third\n" +
            "CGTACGGCTCCAGCGGTGAAATAGCGCGCTGAAATGTTGAGAAATGGTGGGAATGTTGAGAAATGGTGGGTACTGGTGGGAATGTTGAGAAATGGTGGGTACTGGTGGGAATGTTGAGAAATGGTGGGTACTGGTGGGAATGTTGAGAAATGGTGGGTACTGGTGGGAATGTTGAGAAATGGTGGGTACACCTCCGTCGAATTCGAATTCGAATGCGGTAAGAGATGTGGCCGTGGGGGAAAGGGGCTAGGCGCGTACGGCTCCAGCGGTGAAATAGCGCGCTGAAATGTTGAGAAATGGTGGGAATGTTGAGAAATGGTGGGTACACCTCCGTCGAATTCGAATTCGAATGCGGTAAGAGATGTGGCCGTGGGGGAAAGGGGCTAGGCG\n" +
            ">myTitle_2 Second Third\n" +
            "GAAGTAGTGCATCGTCTTAGGCGCTGGGTGGGGACAACCATCGCATCGCATCGCCGAAGCGGGACCCCGAGGAACGTCTGAACCCCGAGGAACGTCTGATAACGTACAGGAGACGGTGGAGGGGTGAATGCTGGTATTG\n";


    var create = function () {
        _seqRegExp = new RegExp('[^ATGCatgc]');

        setDefaultParsedValues({
            "title": "None",
            "sequence": "None"
        });
    };


    var inputTest = function () {
        return _actualTest;
    };


    var setDefaultParsedValues = function (defaultParsedValues) {
        _defaultParsedValues = defaultParsedValues;
    };


    var getDefaultParsedValues = function () {
        return {
            "title": _defaultParsedValues["title"],
            "sequence": _defaultParsedValues["sequence"]
        };
    };


    var parseInput = function (inputString) {
        var sequences;

        if (ifFasta(inputString)) {
            sequences = parseAsFasta(inputString);
        } else {
            sequences = parseAsText(inputString);
        }

        return checkOutput(sequences);
    };


    var ifFasta = function (inputString) {
        return inputString.indexOf(">") !== -1;
    };


    var parseAsFasta = function (inputString) {
        var descriptionIndex = inputString.indexOf(">"),
            inputWithoutDescription = inputString.slice(descriptionIndex + 1),

            sequencesWithTitles = inputWithoutDescription.split(">");

        return $.map(sequencesWithTitles, parseSequenceWithTitle);
    };

    var parseSequenceWithTitle = function (sequenceWithTitle) {
        var parsedValues = getDefaultParsedValues(),
            splitResult = $.trim(sequenceWithTitle).split("\n");

        if ((splitResult.length === 2) && (checkSequence(splitResult[1]))) {
            parsedValues["title"] = splitResult[0];
            parsedValues["sequence"] = splitResult[1];
        }

        return parsedValues;
    };


    var parseAsText = function (inputString) {
        var sequences = $.trim(inputString).split("\n");
        return $.map(sequences, parseSequence);
    };

    var parseSequence = function (sequence) {
        var parsedValues = getDefaultParsedValues(),
            trimmedSequence = $.trim(sequence);

        if ((trimmedSequence.length !== 0) && (checkSequence(trimmedSequence))) {
            parsedValues["sequence"] = trimmedSequence;
        }

        return parsedValues;
    };

    var checkSequence = function (sequence) {
        return (sequence.match(_seqRegExp) === null);
    };
    
    var checkOutput = function (sequences) {
        var isEmpty = true;
        for (var i = 0; i < sequences.length; i++) {
            if (sequences[i].sequence !== "None") {
                isEmpty = false;
            }
        }

        if (isEmpty) {
            return [];
        } else {
            return sequences;
        }
    };

    ////Legacy
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


    return {
        create: create,
        parseInput: parseInput,

        //debug
        inputTest: inputTest
    };
}());