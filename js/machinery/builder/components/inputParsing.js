/**
 * Created by HOME on 18.01.2017.
 */
var inputParsing = (function () {
    var _fileName = "inputParsing",
        _defaultParsedValues,
        _seqRegExp,

        _demoInput = ">mouse SLAMF1 promoter\n" +
            "TGATAAAGTGATTTAAAGCCTGATCATAAATGAGCAATCCTGGA\n" +
            ">human SLAMF1 promoter\n" +
            "CAAAAAAGTGATTTAAAGCCTCATGGGAGATGAGCAATCCTCAA\n";


    var create = function () {
        _seqRegExp = new RegExp('[^ATGCatgc]');

        setDefaultParsedValues({
            "title": "None",
            "sequence": "None"
        });
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


    var getDemoInput = function () {
        return _demoInput;
    };


    var parseInput = function (inputString) {
        var sequences;

        if (ifFasta(inputString)) {
            sequences = parseAsFasta(inputString);
            console.log(sequences, "sequences\n");

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

        console.log(sequencesWithTitles);
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


    var assembleParsedValues = function (sequences) {
        var inputParsedInto = "";
        for(var i = 0; i < sequences.length; i++) {
            inputParsedInto += ">" + sequences[i].title + "\n" + sequences[i].sequence + "\n";
        }
        return inputParsedInto;
    };


    return {
        create: create,
        parseInput: parseInput,

        assembleParsedValues: assembleParsedValues,
        getDemoInput: getDemoInput
    };
}());