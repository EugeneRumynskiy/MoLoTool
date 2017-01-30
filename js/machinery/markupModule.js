/**
 * Created by Sing on 23.11.2016.
 */

//NOT DONE YET
var markup = (function () {
    var _fileName = "markupModule";

    /**
     * used setLevels(sites), makeSegmentation(sites, sequence.length), wrapInMultispan
     * @param sequence
     * @param sites Object { motif: "AHR_HUMAN.H10MO.B", pos: 33, length: 9, strength: 1.0830571865297753, strand: "-", level: 3 }
     * @returns {string}
     */
    var markupSegmentation = function(sequence, sites) {
        sites = setLevels(sites);  //sorting and setting levels
        var segments = makeSegmentation(sites, sequence.length), s = "",
            sequenceToDisplay = wrapSegmentsInSpans(segments, sequence);
        return sequenceToDisplay;
    };


    /**
     * Give levels to sites, according their interception.  [0], [0], [0, [1, [2], 1]
     * @param sites  Object { motif: "AHR_HUMAN.H10MO.B", pos: 12, length: 9, strength: 1.1436142376129588, strand: "+" }
     * @returns {*}
     */
    var setLevels = function(sites) {
        var sortedSitesWithLevels = sites.sort(function(a,b) { return a.scorePosition - b.scorePosition; }),
            currentLevel = 0,
            rightmostEnd = -1;

        for (var i = 0; i < sortedSitesWithLevels.length; i++) {
            if (sortedSitesWithLevels[i].scorePosition > rightmostEnd) {    //no interceptions with other levels
                currentLevel = 0;
            } else {
                currentLevel += 1;                        //there is interception
            }
            sortedSitesWithLevels[i].level = currentLevel;
            rightmostEnd = sortedSitesWithLevels[i].scorePosition + sortedSitesWithLevels[i].length - 1; //new rightmost end
        }

        return sortedSitesWithLevels;
    };

    /**
     *
     * @param segments - object {finish, start, array[sites = {
     *      motifName, level, motifSequence, pValue, scorePosition, siteLength, strand, strength
     * }]}
     * @param sequence
     * @returns {*}
     * last scheme http://paletton.com/#uid=7000X0kqNHXg5QzlJLOzMEBCtrd
     */
    var wrapSegmentsInSpans = function(segments, sequence) {
        var sequenceToDisplay = "", opacity = 1,
            spanClass = "segment", secondaryClass = "",
            backgroundColors = ["#ffff", "#7D9CE4", "#547CD7", "#3362CD", "#1248C4", "#0C3491" ], backgroundColor,
            fontColors = ["#ffff", "#E6841D"], color,
            sequenceLength = 0, sitesCount;

        for(var i = 0; i < segments.length; i++) {
            sitesCount = segments[i].sites.length;
            secondaryClass = getSecondaryClass(segments[i]);
            backgroundColor = getColorFrom(["", "#7D9CE4", "#3362CD", "#0C3491" ], sitesCount);
            color = getColorFrom(["#7D9CE4", "#D99100"], sitesCount);


            sequenceToDisplay += '<span ' + 'style="' +
                'background-color: '+ backgroundColor +'; ' +
                'color: ' + color +'; ' +
                'opacity: ' + opacity +';" ' +
                'id="' + segments[i].start + '"' +
                'class="' + spanClass + secondaryClass +'">' +
                sequence.slice(segments[i].start, segments[i].finish + 1) + '</span>';

            sequenceLength += segments[i].finish - segments[i].start + 1;

        }

        if (sequence.length != sequenceLength) {
            errorHandler.logError({"fileName": _fileName, "message": "sequenceToDisplay length is " + sequenceLength +
            "  must be:" + sequence.length});
        }

        return sequenceToDisplay;
    };



    var getSecondaryClass = function(segment) {
        var secondaryClass = " empty",
            motifNames = Object.keys(segment.motifsInSegment);

        if (motifNames.length == 0) {
            secondaryClass = " empty";
        }
        if (motifNames.length == 1) {
            secondaryClass = " mono" + " " + motifNames[0].split(".").join("_");
        } else if(motifNames.length > 1) {
            secondaryClass = " poly";
        }
        return secondaryClass;
    };


    var getColorFrom = function (palette, sitesCount) {
        if (( sitesCount >= 0 )&&( sitesCount < palette.length )) {
            return palette[sitesCount];
        } else if (sitesCount >= palette.length){
            return palette[palette.length - 1];
        }
    };

    return {markupSegmentation: markupSegmentation};
}());