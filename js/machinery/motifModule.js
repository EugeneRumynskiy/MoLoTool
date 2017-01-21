/**
 * Created by Sing on 06.11.2016.
 */
var motif = (function () {
    var _name              = "",
        _pwmMatrix         = [],
        _pwmMatrixReversed = [],
        _thresholdList     = [];

    var logError = function(err) {
        console.log(err.name, err.message);
    };


    /**
     *Flip motif pvm matrix from [[A, C, G, T], ...] to [T, G, C, A], ...]
     *and the entire motif from [0, 1, 2] to [2, 1, 0] according to inverse direction.
     * @param pwmMatrix     :motif pwm matrix
     * @returns {Array.<*>} :flipped motifPwm
     */
    var reversePwmMatrix = function(pwmMatrix) {
        var reversedMotifPwm = [];     //inverting direction, then inverting complementarity
        for (var i = pwmMatrix.length - 1; i >= 0; i--) {
            reversedMotifPwm.push(pwmMatrix[i].slice().reverse());
        }
        return reversedMotifPwm;
    };


    var setMotif = function (motifRequest) {
        _name              = motifRequest["full_name"];
        _pwmMatrix         = motifRequest["pwm"];
        _pwmMatrixReversed = reversePwmMatrix(motifRequest["pwm"]);
        _thresholdList     = motifRequest["threshold_pvalue_list"];
    };


    var returnMotif = function () {
        return {name: _name, pwmMatrix: _pwmMatrix, pwmMatrixReversed: _pwmMatrixReversed, threshHoldList: _thresholdList};
    };


    var getNucleotideIndex = function(nucleotide) {
        var nucleotideIndex = {
            "A" : 0, 'a': 0,
            "C" : 1, 'c': 1,
            "G" : 2, 'g': 2,
            "T" : 3, 't': 3
        };
        return nucleotideIndex[nucleotide];
    };


    var findSitesInSequence = function(sequence, pValueMax) {
        var direct = "+", inverse = "-",   //direction cases
            sitesList = [].concat(
                findSitesInStrand(sequence, direct, pValueMax),
                findSitesInStrand(sequence, inverse, pValueMax)
            );
        return sitesList;
    };


    /**
     * Find and return pValue in pre-calculated list of scores
     * _thresholdList :pre-calculated list of pairs [[scoreValue, pValue], []...]
     * @param score                 :weight sum for position i, if motif starts in position i
     * @returns {pvalue}            :pValue
     * ToDo: make binary search not linear, test that returned result isn't 0, test return function
     */
    var binarySearch = function(score) {
        var n = _thresholdList.length;
        if (n == 0) {
            throw new Error("The array cannot be empty");
            return 0;
        } else if ((n == 1) || (score <= _thresholdList[0][0])) {
            return _thresholdList[0][1];
        } else if (score >= _thresholdList[n - 1][0]) {
            return _thresholdList[n - 1][1];
        }

        var left = 0, right = n - 1, mid;
        while (left < right) {
            mid = Math.floor((left + right) / 2);
            if (score >= _thresholdList[mid][0]) {
                left = mid;
            } else {
                right = mid;
            }

            if (left + 1 == right) {
                break;
            }
        }
        return Math.sqrt(_thresholdList[left][1] * _thresholdList[left + 1][1]);
    };


    //Return the sequencePart but before it Flip [A, C, G, T] into [T, G, C, A] if condition is true.
    var flipSequence = function(sequencePart, condition) {
        var flippedSequencePart = "",
            nucleotideFlipsInto = {
                "A" : "T", 'a': "t",
                "C" : "G", 'c': "g",
                "G" : "C", 'g': "c",
                "T" : "A", 't': "a"
            };
        if (condition) {
            for (var i = 0; i < sequencePart.length; i++) {
                flippedSequencePart += nucleotideFlipsInto[sequencePart[i]];
            }
            return flippedSequencePart;
        } else {
            return sequencePart;
        }
    };


    var findSitesInStrand = function(sequence, direction, pValueMax) {
        var scoreList = getScoreList(sequence, direction),
            sitesList = [],
            pValue, scorePosition, motifSequence = " ";

        for (scorePosition = 0; scorePosition < scoreList.length; scorePosition++) {
            pValue = binarySearch(scoreList[scorePosition]);
            if (pValue <= pValueMax) {
                motifSequence = sequence.slice(scorePosition,  scorePosition + _pwmMatrix.length);
                sitesList.push({
                    motifName: _name,
                    scorePosition: scorePosition,
                    siteLength: _pwmMatrix.length,
                    strength: round(-Math.log10(pValue), 6),
                    strand: direction,
                    pValue: round(pValue, 6),
                    motifSequence: flipSequence(motifSequence, direction == "-")
                });
            }
        }
        return sitesList;
    };


    var choosePwmMatrix = function (direction) {
        if (direction == "-")
            return _pwmMatrixReversed;
        else
            return _pwmMatrix;
    };


    /**
     * Get scores for motif in position of i in sequence, for inverted direction we invert pwm matrix instead
     * @param sequence  :initial sequence
     * @param direction :direction of dna strand
     * @returns {Array} :array of weight sums for position i, if motif starts in position i
     */
    var getScoreList = function(sequence, direction) {
        var pwmMatrix = choosePwmMatrix(direction),
            seqLen = sequence.length,
            motifLen = pwmMatrix.length,
            scoreList = new Array(seqLen - motifLen + 1),
            positionInMotif, positionInSequence, currentPosition;

        //counting sum of weights for position i
        for (positionInSequence = 0; positionInSequence < seqLen - motifLen + 1; positionInSequence++){
            scoreList[positionInSequence] = 0;
            for (positionInMotif = 0; positionInMotif < motifLen; positionInMotif++){
                currentPosition = positionInSequence + positionInMotif;
                scoreList[positionInSequence] += pwmMatrix[positionInMotif][ getNucleotideIndex(sequence[currentPosition]) ];
            }
        }
        return scoreList;
    };


    //Array of promises is returned
    var promisesForSelectedMotifs = function(motifNameList) {
        var data, promises = [];
        globalMotifData = [];

        promises = $.map(motifNameList, function(motifName){
            return $.ajax({
                dataType: "json",
                url: "http://hocomoco.autosome.ru/motif/" + motifName + ".json?with_matrices=true&with_thresholds=true",
                data: data
            }).then(function(result){
                globalMotifData.push(result);
                //console.log(JSON.stringify(result) + "\n");
            });
        });
        return promises;
    };


    return {
        setMotif: setMotif,
        returnMotif: returnMotif,
        findSites: findSitesInSequence,
        promisesForSelectedMotifs: promisesForSelectedMotifs
    };

}());