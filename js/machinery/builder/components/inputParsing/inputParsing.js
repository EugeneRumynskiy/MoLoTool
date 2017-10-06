/**
 * Created by HOME on 18.01.2017.
 */
var inputParsing = (function () {
    var _fileName = "inputParsing",
        
        _seqCheck,
        _defaultParsedValues;


    var create = function () {
        setSeqCheck(new RegExp('[^ATGCNatgcn]+'));

        setDefaultParsedValues({
            "title": "None",
            "sequence": "None"
        });

        inputDemo.create(
            ">mouse SLAMF1 promoter\n" +
            "TGATAAAGTGATTTAAAGCCTGATCATAAATGAGCAATCCTGGA\n" +
            ">human SLAMF1 promoter\n" +
            "CAAAAAAGTGATTTAAAGCCTCATGGGAGATGAGCAATCCTCAA\n"
        );

        inputErrors.create(getSeqCheck());
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
        var sequences;
        inputErrors.clearStack();

        if ($.isEmptyObject( motifPicker.getRequestedMotifNames() )) {
            sequences = [];
            inputErrors.showErrors("motifListIsEmpty");
        } else {
            var inputString = $.trim(rawInputString);

            if (ifFasta(inputString)) {
                sequences = parseAsFasta(inputString);
            } else {
                sequences = parseAsText(inputString);
            }

            inputErrors.showErrors();
        }

        return checkOutput(sequences);
    };


    var ifFasta = function (inputString) {
        return inputString.indexOf(">") !== -1;
    };


    var parseAsFasta = function (inputString) {
        var startIndex = inputString.indexOf(">"),

            generalDescription = inputString.slice(0, startIndex),

            inputWithoutGeneralDescription = inputString.slice(startIndex + 1),
            sequencesWithTitles = inputWithoutGeneralDescription.split(">");

        return $.map(sequencesWithTitles, parseSequenceWithTitle);
    };


    var parseSequenceWithTitle = function (sequenceWithTitle) {
        var parsedValues = getDefaultParsedValues(),
            splitResult = $.trim(sequenceWithTitle).split(/\n+/).map($.trim);


        if (splitResult.length === 2) {
            parsedValues["title"] = splitResult[0];
            parsedValues["sequence"] = returnSuitableSequence(splitResult[1]);
        } else if (splitResult.length === 1) {
            parsedValues["sequence"] = returnSuitableSequence(splitResult[0]);
        }

        return parsedValues;
    };


    var parseAsText = function (inputString) {
        var sequence = $.trim(inputString).split(/\n+/).join("");
        //return $.map(sequences, parseSequence);
        return [parseSequence(sequence)];
    };


    var parseSequence = function (sequence) {
        var parsedValues = getDefaultParsedValues(),
            trimmedSequence = $.trim(sequence);

        if (trimmedSequence.length !== 0) {
            parsedValues["sequence"] = returnSuitableSequence(trimmedSequence);
        }

        return parsedValues;
    };


    var returnSuitableSequence = function (sequence) {
        if (checkSequence(sequence)) {
            return sequence;
        } else {
            handleError(sequence);
            return getDefaultParsedValues()["sequence"];
        }
    };


    var checkSequence = function (sequence) {
        return (sequence.match(getSeqCheck()) === null);
    };


    var handleError = function (sequence) {
        inputErrors.addToStack(sequence);
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
        var inputParsedInto = "",
            noneReplacer = "";

        for(var i = 0, sequence, title; i < sequences.length; i++) {
            sequence = sequences[i].sequence;
            title = sequences[i].title;

            if (sequence === getDefaultParsedValues().sequence) {
                sequence = noneReplacer;
            }

            inputParsedInto += ">" + title + "\n" + sequence + "\n";
        }
        return inputParsedInto;
    };


    return {
        create: create,
        parseInput: parseInput,

        assembleParsedValues: assembleParsedValues
    };
}());