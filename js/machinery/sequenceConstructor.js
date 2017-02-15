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


    var findSegmentWith = function (startPosition) {
        var index =  binarySearch(_segments, startPosition, compareStartPositionAndSegment);

        if (index < 0) {
            errorHandler.logError({"fileName": _fileName, "message": "there is no segment with this position\n"});
            return {};
        } else {
            return _segments[index];
        }
    };

    /*
     * Binary search in JavaScript.
     * Returns the index of of the element in a sorted array or (-n-1) where n is the insertion point for the new element.
     * Parameters:
     *     ar - A sorted array
     *     el - An element to search for
     *     compare_fn - A comparator function. The function takes two arguments: (a, b) and returns:
     *        a negative number  if a is less than b;
     *        0 if a is equal to b;
     *        a positive number of a is greater than b.
     * The array may contain duplicate elements. If there are more than one equal elements in the array,
     * the returned value can be the index of any one of the equal elements.
     */
    function binarySearch(arr, startPosition, compare_fn) {
        var m = 0;
        var n = arr.length - 1;
        while (m <= n) {
            var k = (n + m) >> 1;
            var cmp = compare_fn(startPosition, arr[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if(cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return -m - 1;
    }


    function compareStartPositionAndSegment(startPosition, segment) {
        return startPosition - segment.start;
    }



    var show = function () {
        console.log(_segments);
    };

    return {
        markupSegmentation: markupSegmentation,
        show: show,
        findSegmentWith: findSegmentWith
    };
}());