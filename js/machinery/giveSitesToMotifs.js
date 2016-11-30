/**
 * Created by Sing on 05.11.2016.
 */


function sitesOfMotifInSequence(sequence, motif, pValueMax) {
    var direct = "+", inverse = "-",   //direction cases
        sitesList = [].concat(
            findSitesOfMotifWithDirection(sequence, motif, direct, pValueMax),
            findSitesOfMotifWithDirection(sequence, motif, inverse, pValueMax)
        );
    return sitesList;
};


/**
 *Flip motif pvm matrix from [[A, C, G, T], ...] to [T, G, C, A], ...]
 *and the entire motif from [0, 1, 2 ...] to [2, 1, 0 ...] according to inverse direction.
 * @param motifPwm      :motif pwm matrix
 * @returns {Array.<*>} :flipped motifPwm
 */
function reverseMotifPwm(motifPwm) {
    var reversedMotifPwm = [];     //inverting direction, then inverting complementarity
    for (var i = motifPwm.length - 1; i >= 0; i--) {
        reversedMotifPwm.push(motifPwm[i].slice().reverse());
    }
    return reversedMotifPwm;
};



// мотив и сиквенс уже перевернуты, strand нужен, чтобы указать сайту имя нити
function findSitesOfMotifWithDirection(sequence, motif, direction, pValueMax) {

    var scoreList = [],
        sitesList = [],
        pValue, scorePosition;

    if (direction == "-") {
        scoreList = getScoreList(sequence, reverseMotifPwm(motif.motifPwm), direction);
    }  else {
        scoreList = getScoreList(sequence, motif.motifPwm, direction);
    }

    for (scorePosition = 0; scorePosition < scoreList.length; scorePosition++) {
        pValue = binarySearch(motif.thresholdPvalueList, scoreList[scorePosition]);
        if (pValue <= pValueMax) {
            sitesList.push({
                motifName: motif.motifName,
                scorePosition: scorePosition,
                length: motif.motifPwm.length,
                strength: -Math.log10(pValue),
                strand: direction
            });
        }
    }
    return sitesList;
};


/**
 * Get scores for motif in position of i in sequence
 * @param sequence  :initial sequence
 * @param motifPwm     :motif pwm matrix
 * @param direction :direction of dna strand
 * @returns {Array} :array of weight sums for position i, if motif starts in position i
 */
function getScoreList(sequence, motifPwm, direction) {
    var seqLen = sequence.length,
        motifLen = motifPwm.length,
        scoreList = new Array(seqLen - motifLen + 1),
        positionInMotif, positionInSequence, currentPosition;

    //counting sum of weights for position i
    for (positionInSequence = 0; positionInSequence < seqLen - motifLen + 1; positionInSequence++){
        scoreList[positionInSequence] = 0;
        for (positionInMotif = 0; positionInMotif < motifLen; positionInMotif++){
            currentPosition = positionInSequence + positionInMotif;
            scoreList[positionInSequence] += motifPwm[positionInMotif][ getNucleotideIndex(sequence[currentPosition]) ];
        }
    }
    return scoreList;
}

function getNucleotideIndex(nucleotide) {
    var nucleotideIndex = {
        "A" : 0, 'a': 0,
        "C" : 1, 'c': 1,
        "G" : 2, 'g': 2,
        "T" : 3, 't': 3};
    return nucleotideIndex[nucleotide];
}


/**
 * Find and return pValue in pre-calculated list of scores
 * @param threshold_pvalue_list :pre-calculated list of pairs [[scoreValue, pValue], []...]
 * @param score                 :weight sum for position i, if motif starts in position i
 * @returns {pvalue}            :pValue
 */
// ToDo: make binary search not linear, test that returned result isn't 0, test return function
function binarySearch(threshold_pvalue_list, score) {
    if (threshold_pvalue_list.length == 1) return threshold_pvalue_list[0][1];
    if (score <= threshold_pvalue_list[0][0]) return threshold_pvalue_list[0][1];
    for (var i = 1; i < threshold_pvalue_list.length; ++i) {
        if (threshold_pvalue_list[i][0] >= score) {
            return Math.sqrt(threshold_pvalue_list[i][1] * threshold_pvalue_list[i - 1][1]);
        }
    }
}