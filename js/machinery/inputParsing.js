/**
 * Created by HOME on 18.01.2017.
 */
var inputParsing = (function () {
    var _fileName = "inputParsing",
        _parsedSequences,
        _defaultParsedValues,
        _test = ">myTitle_1 Second Third\n" +
            "CGTACGGCTCCAGCGGTGAAATAGCGCGCTGAAATGTTGAGAAATGGTGGGTACACCTCCGTCGAATGCGGTAAGAGATGTGGCCGTGGGGGAAAGGGGCTAGGCG\n" +
            ">myTitle_2 Second Third\n" +
            "GAAGTAGTGTCTTAGGCGCTGGGTGGGGACAACCATCGCCGAAGCGGGACCCCGAGGAACGTCTGATAACGTACAGGAGACGGTGGAGGGGTGAATGCTGGTATTG\n" +
            ">myTitle_3 Second Third\n" +
            "CTAGACTTGGAGAGAGGGGCAGCACTAACAGGGAGATGGAAAACAGGGGCTGCGCAATGCGTGGCCAGGGCGGTGTAGAGTTCTCAGTTCTGGTGGAGTGCCTACG\n" +
            ">myTitle_4 Second Third\n" +
            "TCGGGTGCGACGCACACTGGGCATTGGTCAGTGACGTGAACTGAGGGCACAAGAGCTACGGTTGTGGGCGTTGTGAGAGGAATCGGGGGCACTAGAGTACACGAGACC\n",

        _test2 = "AAACGTACGGCTCCAGCGGTGAAATAGCGCGCTGAAATGTTGAGAAATGGTGGGTACACCTCCGTCGAATGCGGTAAGAGATGTGGCCGTGGGGGAAAGGGGCTAGGCG\n" +
            "GAAGTAGTGTCTTAGGCGCTGGGTGGGGACAACCATCGCCGAAGCGGGACCCCGAGGAACGTCTGATAACGTACAGGAGACGGTGGAGGGGTGAATGCTGGTATTG\n" +
            "CTAGACTTGGAGAGAGGGGCAGCACTAACAGGGAGATGGAAAACAGGGGCTGCGCAATGCGTGGCCAGGGCGGTGTAGAGTTCTCAGTTCTGGTGGAGTGCCTACG\n" +
            "TCGGGTGCGACGCACACTGGGCATTGGTCAGTGACGTGAACTGAGGGCACAAGAGCTACGGTTGTGGGCGTTGTGAGAGGAATCGGGGGCACTAGAGTACACGAGA\n";


    var create = function () {
        setDefaultParsedValues({
            "title": "None",
            "sequence": "None"
        });
    };


    var inputTest = function () {
        return parseInput(_test);
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

        console.log(sequences, "Parsed Input");
    };


    var ifFasta = function (inputString) {
        return inputString.indexOf(">") !== -1;
    };


    var parseAsFasta = function (inputString) {
        var descriptionIndex = inputString.indexOf(">"),
            inputDescription = inputString.slice(0, descriptionIndex),
            inputWithoutDescription = inputString.slice(descriptionIndex + 1),

            sequencesWithTitles = inputWithoutDescription.split(">");

        return $.map(sequencesWithTitles, parseSequenceWithTitle);
    };

    var parseSequenceWithTitle = function (sequenceWithTitle) {
        var parsedValues = getDefaultParsedValues(),
            splitResult = $.trim(sequenceWithTitle).split("\n");

        if (splitResult.length === 2) {
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

        if (trimmedSequence.length !== 0) {
            parsedValues["sequence"] = trimmedSequence;
        }

        return parsedValues;
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
        inputTest: inputTest
    };
}());