var digitGuidance = (function () {
    var _fileName = "digitGuidance",
        _digitsString;


    var create = function (maxSequenceLength) {
        _digitsString = generateDigitsString(maxSequenceLength);
    };


    var generateDigitsString = function (maxSequenceLength) {
        var s = "", separator = "-", charsBetween = 10;

        for(var i = 0, toAdd; i < maxSequenceLength; i += toAdd.length) {
            toAdd = (s.length % charsBetween === 0) ? i.toString(): separator;
            s += toAdd;
        }

        return s;
    };


    var getDigitsFor = function (length) {
        var digits = _digitsString.substring(0, length);
        return "<span>" + digits + "</span>";
    };


    return {
        create: create,
        getDigitsFor: getDigitsFor
    };
} ());