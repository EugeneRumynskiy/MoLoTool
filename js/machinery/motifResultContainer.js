/**
 * Created by HOME on 13.02.2017.
 */
var resultContainer = (function () {
    var _moduleName = "resultContainer",
        _hasExternalFocusObject = function () {}; // currently focus from pSlider


    var create = function () {
        buildUIComponent();
    };


    var buildUIComponent = function () {
        supportTooltip.addTo();
    };


    var setExternalFocusObject = function (externalFocusObject) {
        _hasExternalFocusObject = externalFocusObject;
    };


    var ifHasExternalFocus = function () {
        return _hasExternalFocusObject();
    };


    return {
        create: create,
        setExternalFocusObject: setExternalFocusObject,
        ifHasExternalFocus: ifHasExternalFocus
    };
}());



var supportTooltip = (function () {
    var _moduleName = "supportTooltip",
        _$hoveredMotifs = $("");


    //wrap string in order to make id select
    var jq = function(myId) {
        return "#" + myId.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
    };


    var addToHovered = function ($motif) {
        _$hoveredMotifs = _$hoveredMotifs.add($motif);
    };


    var highlightHoveredMotifs = function () {
        _$hoveredMotifs.addClass("motif-result-hover");
    };


    var cleanHoveredMotifs = function () {
        _$hoveredMotifs.removeClass("motif-result-hover");
        _$hoveredMotifs = $("");
    };



    var addTo = function () {
        var $resultCmp = $("#result-cmp");

        $resultCmp.on('mouseenter', ".segment", mouseInHandler);
        $resultCmp.on('mouseleave', ".segment", mouseOutHandler);
    };


    var mouseInHandler = function () {
        if (resultContainer.ifHasExternalFocus() === true) {

        } else {
            var tabId = $(this).parents(".tab-result-sequence").attr("data-tab"),
                segment = sequenceConstructor.findSegmentWith(this.getAttribute('data-start'), tabId),
                $motifList = $("#motif-list-selected"), $motif;

            for (var i = 0; i < segment.sites.length; i++) {
                $motif = $motifList.find(jq(segment.sites[i].motifName));
                addToHovered($motif);
            }

            highlightHoveredMotifs();
        }
    };


    var mouseOutHandler = function () {
        cleanHoveredMotifs();
    };


    return {
        addTo: addTo
    };
}());

/*
var mouseListener = (function () {
    var _moduleName = "mouseListener",
        isDown = false; // Tracks status of a mouse button

    var create = function () {
        $("#logSlider").mousedown(function() {
            isDown = true;      // When mouse goes down, set isDown to true
            console.log(isDown);
        })
            .mouseup(function() {
                isDown = false;    // When mouse goes up, set isDown to false
                console.log(isDown);
            });
    };

    var isPressed = function () {
        return isDown;
    };
    return {
        create: create,
        isPressed: isPressed
    };
}());*/

