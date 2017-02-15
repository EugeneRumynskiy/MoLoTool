/**
 * Created by Sing on 23.11.2016.
 */

//NOT DONE YET
var sequenceConstructor = (function () {
    var _fileName = "sequenceConstructor",
        _sequence, _sortedSites, _segments;


    var setSequence = function (sequence) {
        _sequence = sequence;
    };


    var setSortedSites = function (sortedSites) {
        _sortedSites = sortedSites;
    };


    var setSegments = function (segments) {
        _segments = segments;
    };


    var sortSites = function (sites) {
        return sites.sort(function(a,b) { return a.scorePosition - b.scorePosition; });
    };


    /**
     * used setLevels(sites), makeSegmentation(sites, sequence.length), wrapInMultiSpan
     * @param sequence
     * @param sites Object { motif: "AHR_HUMAN.H10MO.B", pos: 33, length: 9, strength: 1.0830571865297753, strand: "-", level: 3 }
     * @returns {string}
     */
    var markupSegmentation = function(sequence, sites) {
        setSequence(sequence);
        setSortedSites(sortSites(sites)); //sorting and setting levels
        setSegments(segmentation.makeSegmentation(_sortedSites, _sequence.length));

        var sequenceToDisplay = wrapSegmentsInSpans(_segments);
        //console.log(_segments);
        //console.log(_sortedSites);
        return sequenceToDisplay;
    };


    /**
     *
     * @param segments - object {finish, start, array[sites = {
     *      motifName, level, motifSequence, pValue, scorePosition, siteLength, strand, strength
     * }]}
     * @returns {*}
     * last scheme http://paletton.com/#uid=7000X0kqNHXg5QzlJLOzMEBCtrd
     */
    var wrapSegmentsInSpans = function(segments) {
        var sequenceToDisplay = "",
            positionInSequence = 0,
            motifCount, motifs, $motifContainer,
            backgroundColor, color,
            commonBackgroundColor = "#d9d9d9", commonColor = "#ffffff",
            emptyBackgroundColor = "#ffffff", emptyColor = "#000000";

        for(var i = 0; i < segments.length; i++) {
            positionInSequence += segments[i].finish - segments[i].start + 1;
            motifs = motifsInSegment(segments[i]);
            motifCount = motifs.length;

            if (motifCount > 1) {
                color = commonColor;
                backgroundColor = commonBackgroundColor;
            } else if (motifCount == 1) {
                color = commonColor;
                $motifContainer = motifPicker.getSelectedMotifContainer(motifs[0]);
                backgroundColor = colorPicker.getColorFromContainer($motifContainer);
            } else {
                color = emptyColor;
                backgroundColor = emptyBackgroundColor;
            }

            sequenceToDisplay += createSpan(color, backgroundColor, segments[i]);
        }

        if (_sequence.length != positionInSequence) {
            errorHandler.logError({"fileName": _fileName, "message": "sequenceToDisplay length is " + positionInSequence +
            "  must be:" + _sequence.length});
        }

        return sequenceToDisplay;
    };


    var createSpan = function (color, backgroundColor, segment) {
        return '<span ' +
            'style="' + 'background-color: '+ backgroundColor +'; ' + 'color: ' + color +';" ' +
            'start="' + segment.start + '" ' +
            'class="segment">' +
            _sequence.slice(segment.start, segment.finish + 1) +
            '</span>'

    };


    var motifsInSegment = function (segment) {
        return Object.keys(segment.motifsInSegment);
    };


    return {markupSegmentation: markupSegmentation};
}());