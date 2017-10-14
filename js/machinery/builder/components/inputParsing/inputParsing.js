/**
 * Created by HOME on 18.01.2017.
 */
var inputParsing = (function () {
    var _fileName = "inputParsing",
        
        _seqCheck,
        _defaultParsedValues,
        _generalDescription,

        _rest = "";


    var create = function () {
        setGeneralDescription("");

        setSeqCheck(new RegExp('[^ATGCNatgcn]+'));

        setDefaultParsedValues({
            "title": "No title",
            "sequence": "None"
        });

        inputDemo.create(
            ">human SLAMF1 promoter\n" +
            "CAAAAAAGTGATTTAAAGCCTCATGGGAGATGAGCAATCCTCAA\n" +
            ">mouse SLAMF1 promoter\n" +
            "TGATAAAGTGATTTAAAGCCTGATCATAAATGAGCAATCCTGGA\n"
        );

        inputErrors.create(getSeqCheck());
    };


    var setGeneralDescription = function (generalDescription) {
        _generalDescription = generalDescription.trim();
    };


    var getGeneralDescription = function () {
        return _generalDescription;
    };


    var setSeqCheck = function (regExp) {
        _seqCheck = regExp;
    };


    var setDefaultParsedValues = function (defaultParsedValues) {
        _defaultParsedValues = defaultParsedValues;
    };


    var getSeqCheck = function () {
        return _seqCheck;
    };
    
    
    var getDefaultParsedValues = function () {
        return {
            "title": _defaultParsedValues["title"],
            "sequence": _defaultParsedValues["sequence"]
        };
    };


    var parseInput = function (rawInputString) {
        var sequences = [];

        var inputString = $.trim(rawInputString);

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
        var startIndex = inputString.indexOf(">");

        var generalDescription = inputString.slice(0, startIndex);
        setGeneralDescription(generalDescription);

        var inputWithoutGeneralDescription = inputString.slice(startIndex + 1),
            sequencesWithTitles = inputWithoutGeneralDescription.split(">");

        var sequences = [];
        for(var i = 0, parsedSequence; i < sequencesWithTitles.length; i++) {
            parsedSequence = parseSequenceWithTitle(sequencesWithTitles[i], i);
            if (inputErrors.checkSequenceCharacterError() === false) {
                sequences.push(parsedSequence);
            } else {
                return sequences;
            }
        }
        return sequences;
    };


    var parseSequenceWithTitle = function (sequenceWithTitle, sequenceNo) {
        var parsedValues = {},

            //if fasta, there MUST be at least ONE \n else it's error;
            titleIndex = sequenceWithTitle.indexOf("\n"),

            title = "",
            sequence = "";

        if (titleIndex === -1) {
            title = sequenceWithTitle;
            sequence = "";
        } else {
            title = $.trim(sequenceWithTitle.slice(0, titleIndex));
            sequence = $.trim(sequenceWithTitle.slice(titleIndex + 1))
                .split(/\n+/)
                .map($.trim)
                .join("");
        }

        parsedValues["title"] = ($.isEmptyObject(title)) ? getDefaultParsedValues().title : title;
        parsedValues["sequence"] = ($.isEmptyObject(sequence)) ?
            getDefaultParsedValues().sequence : returnSuitableSequence(sequence, ">" + sequenceWithTitle, sequenceNo + 1);

        return parsedValues;
    };


    var parseAsText = function (inputString) {
        var sequence = $.trim(inputString).split(/\n+/).join("");
        return [parseSequence(sequence)];
    };


    var parseSequence = function (sequence) {
        var parsedValues = getDefaultParsedValues(),
            trimmedSequence = $.trim(sequence);

        if (trimmedSequence.length !== 0) {
            parsedValues["sequence"] = returnSuitableSequence(trimmedSequence, sequence,  1);
        }

        return parsedValues;
    };


    var returnSuitableSequence = function (sequence, rawSequence, sequenceNo) {
        var checkResult = checkSequence(sequence);

        if (checkResult === true) {
            return sequence;
        } else {
            handleError(checkResult, rawSequence, sequenceNo);
            return getDefaultParsedValues()["sequence"];
        }
    };


    var checkSequence = function (sequence) {
        var checkResult = sequence.match(getSeqCheck());

        if (checkResult === null) {
            return true;
        } else {
            return checkResult;
        }
    };


    var handleError = function (characters, rawSequence, sequenceNo) {
        inputErrors.addToLog({
            title:"sequenceCharacterError",
            characters: characters,
            sequenceNo: sequenceNo,
            rawSequence: rawSequence
        });
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


    var assembleParsedValues = function (sequences, rest) {
        var inputParsedInto = (getGeneralDescription() === "") ? "" : getGeneralDescription() + "\n",
            noneReplacer = "";

        for(var i = 0, sequence, title; i < sequences.length; i++) {
            sequence = sequences[i].sequence;
            title = sequences[i].title;

            if (sequence === getDefaultParsedValues().sequence) {
                sequence = noneReplacer;
            }

            inputParsedInto += ">" + title + "\n" + sequence + "\n";
        }

        inputParsedInto += rest;

        return inputParsedInto;
    };


    return {
        create: create,
        parseInput: parseInput,

        assembleParsedValues: assembleParsedValues
    };
}());