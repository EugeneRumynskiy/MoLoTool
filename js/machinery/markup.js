/**
 * Created by Sing on 23.11.2016.
 */

//NOT DONE YET
var markup = (function () {
    var _fileName = "markup";

    /**
     * used setLevels(sites), makeSegmentation(sites, sequence.length), wrapInMultispan
     * @param sequence
     * @param sites Object { motif: "AHR_HUMAN.H10MO.B", pos: 33, length: 9, strength: 1.0830571865297753, strand: "-", level: 3 }
     * @returns {string}
     */
    var markupSegmentation = function(sequence, sites) {
        sites = setLevels(sites);  //sorting and setting levels
        var segments = segmentation.makeSegmentation(sites, sequence.length),
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
        var sequenceToDisplay = "", sitesCount,
            backgroundColor, color,
            positionInSequence = 0,
            commonBackgroundColor = "#d9d9d9", commonColor = "#ffffff",
            emptyBackgroundColor = "#ffffff", emptyColor = "#000000";

        for(var i = 0; i < segments.length; i++) {
            positionInSequence += segments[i].finish - segments[i].start + 1;

            sitesCount = segments[i].sites.length;


            motifNames = Object.keys(segments[i].motifsInSegment);
            if (motifNames.length > 1) {
                color = commonColor;
                backgroundColor = commonBackgroundColor;
            } else if (motifNames.length == 1) {
                color = commonColor;
                $motifContainer = motifPicker.getSelectedMotifContainer(motifNames[0]);
                backgroundColor = colorPicker.getColorFromContainer($motifContainer);
            } else {
                color = emptyColor;
                backgroundColor = emptyBackgroundColor;
            }


            //backgroundColor = getColorFrom(["", "#7D9CE4", "#3362CD", "#0C3491" ], sitesCount);
            //color = getColorFrom(["#7D9CE4", "#D99100"], sitesCount);


            sequenceToDisplay += '<span ' + 'style="' +
                'background-color: '+ backgroundColor +'; ' +
                'color: ' + color +';" ' +
                'id="' + segments[i].start + '" ' +
                'class="segment">' +
                sequence.slice(segments[i].start, segments[i].finish + 1) + '</span>';
        }

        if (sequence.length != positionInSequence) {
            errorHandler.logError({"fileName": _fileName, "message": "sequenceToDisplay length is " + positionInSequence +
            "  must be:" + sequence.length});
        }

        return sequenceToDisplay;
    };

    return {markupSegmentation: markupSegmentation};
}());