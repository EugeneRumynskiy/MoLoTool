/**
 * Created by Sing on 23.11.2016.
 */
var segmentation = (function () {
    var _fileName = "segmentation";

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
                sites: [],
                motifsInSegment: getMotifNamesFromSites({})
            });
            return segments;
        }

        //converting points into segments
        var leftPoint = {siteIndex: undefined, position:0, type:'start'}, rightPoint, ifStart;

        for (var i = 0; i < points.length; i++) {
            rightPoint = points[i];                          //handle new point
            ifStart = checkPointType(points[i], "start");

            //console.log("getting segments", leftPoint.position, rightPoint.position, i, isPointType(points[i], "start"));
            //if there are two END points in one POSITION we should update last segment
            if ((rightPoint.position == leftPoint.position) && (rightPoint.type == "end") && (leftPoint.type == "end")) {
                ;//segments[segments.length - 1].sites.push(sites[rightPoint.siteIndex]);
                //see ALX1 ALX4 pval 15 case, we already have needed sites from ifSiteInSegment
            } else if((rightPoint.position == leftPoint.position) && (rightPoint.type == "start") && (leftPoint.type == "start")) {
                ; //do nothing
            } else if((getSegmentEdgePosition(rightPoint, "rightPoint") - getSegmentEdgePosition(leftPoint, "leftPoint")) >= 0)   {
                //push new segment if it's actual length is not 0
                //console.log("getting segments pushed!", leftPoint.position + 1 * isPointType(leftPoint, "end"), rightPoint.position - 1 * isPointType(rightPoint, "start"),
                //    leftPoint.position, rightPoint.position);

                segments.push({
                    start: leftPoint.position + 1 * checkPointType(leftPoint, "end") ,
                    finish: rightPoint.position - 1 * checkPointType(rightPoint, "start"),
                    sites: sitesInSegment(ifSiteInSegment, sites),
                    motifsInSegment: getMotifNamesFromSites(sitesInSegment(ifSiteInSegment, sites))
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
                sites: [],
                motifsInSegment: getMotifNamesFromSites({})
            });
        }
        return segments;
    };


    var getMotifNamesFromSites = function(sites) {
        var motifNames = {};
        for(var i = 0; i < sites.length; i++) {
            if (motifNames[sites[i].motifName] == undefined) {
                motifNames[sites[i].motifName] = 1;
            } else {
                motifNames[sites[i].motifName] += 1;
            }
        }
        return motifNames;
    };


    var splitSitesIntoSortedPoints = function(sites) {
        var points = [];
        for (var index = 0; index < sites.length; index++) {
            points.push({siteIndex: index, position:sites[index].scorePosition, type:'start'});
            points.push({siteIndex: index, position:sites[index].scorePosition + sites[index].siteLength - 1, type:'end'});
        }
        points.sort(comparePoints);
        return points;
    };


    function comparePoints(firstPoint, secondPoint) {
        if (firstPoint.position != secondPoint.position) {
            return firstPoint.position - secondPoint.position;
        } else if((firstPoint.type == 'start') && (secondPoint.type == 'end')) {
            return -1;
        } else if((firstPoint.type == 'end') && (secondPoint.type == 'start')) {
            return 1;
        } else {
            return 0;
        }
    }


    var initSiteInSegment = function(sitesLength) {
        var ifSiteInSegment = {};
        for (var index = 0; index < sitesLength; index++) {
            ifSiteInSegment[index] = false;             //initialization
        }
        return ifSiteInSegment;
    };


    var checkPointType = function(point, typeToCheck) {
        try {
            return isPointType(point, typeToCheck);
        } catch (error) {
            logError(error);
        }
    };


    var isPointType = function(point, typeToCheck) {
        if ((point.type != "start") && (point.type != "end")) {
            throw new Error("Point type: nor start or end");
        }
        if ((typeToCheck != "start") && (typeToCheck != "end")) {
            throw new Error("Point check-type: nor start or end ");
        }
        if (point.type == typeToCheck) {
            return 1;
        } else if (point.type != typeToCheck) {
            return 0;
        }
        throw new Error("Point check: this shouldn't be executed ");
    };


    var getSegmentEdgePosition = function(point, pointIs) {
        if (pointIs == "rightPoint") {
            return point.position - 1 * checkPointType(point, "start");
        } else if (pointIs == "leftPoint") {
            return point.position + 1 * checkPointType(point, "end");
        } else {
            throw Error("pointIs is not right or left");
        }
    };


    /**
     * Find all sites in the segment before point[i] was met
     * @param ifSiteInSegment: dictionary of booleans, ifSiteInSegment[index] = true, if site[index] in segment
     * @param sites          : sorted array of sites
     * @returns {Array}      : array of sites in the segment before point[i] was met
     */
    var sitesInSegment = function(ifSiteInSegment, sites) {
        var sitesIn = [], site;
        for (site in ifSiteInSegment) {
            if (ifSiteInSegment[site])
                sitesIn.push(sites[site]);
        }
        return sitesIn;
    };

    return {
        makeSegmentation: makeSegmentation
    };
}());