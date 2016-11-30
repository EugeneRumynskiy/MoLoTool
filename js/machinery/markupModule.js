/**
 * Created by Sing on 23.11.2016.
 */

//NOT DONE YET
var markup = (function () {

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
     * Take sorted sites, sequence length and transform them into segments
     * @param sites   sorted array of Object { motifName, level, motifSequence, pValue, scorePosition, siteLength, strand, strength }
     * @param seqLength    :length of sequence
     * @returns {Array}    :array of segments which are {start: pos, stop: pos, array[sitesInSegment]}
     */
    //TODO: create object called sites with a bunch of methods
    var makeSegmentation = function(sites, seqLength) {
        var points = splitSitesIntoSortedPoints(sites),
            ifSiteInSegment = initSiteInSegment(sites.length),
            segments = [];

        if (points.length == 0){
            segments.push({
                start: 0,
                finish: seqLength - 1,
                sites: []
            });
            return segments;
        }

        //converting points into segments
        var leftPoint = {siteIndex: undefined, position:0, type:'start'},
            rightPoint,
            i, ifStart;

        for (i = 0; i < points.length; i++) {
            rightPoint = points[i];                          //handle new point
            ifStart = checkPointType(points[i], "start");

            //console.log("getting segments", leftPoint.position, rightPoint.position, i, isPointType(points[i], "start"));


            //if there are tow END points in one POSITION we should update last segment
            if ((rightPoint.position == leftPoint.position) && (rightPoint.type == "end") && (leftPoint.type == "end")) {
                segments[segments.length - 1].sites.push(sites[rightPoint.siteIndex]);
            } else if((rightPoint.position == leftPoint.position) && (rightPoint.type == "start") && (leftPoint.type == "start")) {
                ; //do nothing
            } else if((getSegmentEdgePosition(rightPoint, "rightPoint") - getSegmentEdgePosition(leftPoint, "leftPoint")) >= 0)   {
                //push new segment if it's actual length is not 0
                //console.log("getting segments pushed!", leftPoint.position + 1 * isPointType(leftPoint, "end"), rightPoint.position - 1 * isPointType(rightPoint, "start"),
                //    leftPoint.position, rightPoint.position);
                segments.push({
                    start: leftPoint.position + 1 * checkPointType(leftPoint, "end") ,
                    finish: rightPoint.position - 1 * checkPointType(rightPoint, "start"),
                    sites: sitesInSegment(ifSiteInSegment, sites)
                });
            }

            //updating sites in segment with data from point i
            //checking if the site with index = .siteIndex in current segment
            if (checkPointType(points[i], "end")) {
                if (ifSiteInSegment[points[i].siteIndex] == false) {
                    console.log("Error, end before beginning in segmentation");
                }
                ifSiteInSegment[points[i].siteIndex] = false;
            } else if (checkPointType(points[i], "start")) {
                if (ifSiteInSegment[points[i].siteIndex] == true) {
                    console.log("Error, start before end in segmentation");
                }
                ifSiteInSegment[points[i].siteIndex] = true;
            } else {
                console.log("Error, nor end or start in segmentation");
            }

            leftPoint = rightPoint;
        }

        //include right border
        if ( (points[points.length - 1].position) != (seqLength - 1) ) {
            segments.push({
                start: points[points.length - 1].position + 1,
                finish: seqLength - 1,
                sites: []
            });
        }

        return segments;
    };


    return {};
}());