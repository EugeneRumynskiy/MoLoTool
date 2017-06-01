/**
 * Created by HOME on 13.02.2017.
 */
var resultContainer = (function () {
    var _moduleName = "resultContainer",
        _hasExternalFocusObject = function () {}; // currently focus from pSlider

    var create = function () {
        buildUIComponent();
    };

    var updateWith = function (newSpanSequence) {
        $('#result').empty().html(newSpanSequence);
    };

    var buildUIComponent = function () {
        supportTooltip.addTo(".segment");
    };

    var setExternalFocusObject = function (externalFocusObject) {
        _hasExternalFocusObject = externalFocusObject;
    };

    var ifHasExternalFocus = function () {
        return _hasExternalFocusObject();
    };

    return {
        create: create,
        updateWith: updateWith,
        setExternalFocusObject: setExternalFocusObject,
        ifHasExternalFocus: ifHasExternalFocus
    };
}());



var supportTooltip = (function () {
    var _moduleName = "tooltip",
        _element = "div",
        _className = "tooltip",
        _$hoveredMotifs = $("");

    var getElemById = function (id) {
        return document.getElementById(id);
    };


    var addTo = function (selectorName) {
        var $result = $("#result");
        $result.on('mouseenter', selectorName, mouseInHandler);
        $result.on('mouseleave', selectorName, mouseOutHandler);
    };


    var mouseInHandler = function () {
        if (resultContainer.ifHasExternalFocus() == true) {
            return;
        } else {
            var segment = sequenceConstructor.findSegmentWith(this.getAttribute('start')),
                $motif, $motifList = $("#motif-list-selected");

            for (var i = 0; i < segment.sites.length; i++) {
                $motif = $motifList.find(jq(segment.sites[i].motifName));
                _$hoveredMotifs = _$hoveredMotifs.add($motif);
            }

            _$hoveredMotifs.addClass("motif-result-hover");
        }
    };


    var mouseOutHandler = function () {
        _$hoveredMotifs.removeClass("motif-result-hover");
        _$hoveredMotifs = $("");
    };


    var createElement = function (segment) {
        var tooltipElement = document.createElement(_element), tip = "";
        tooltipElement.className = _className;

        for (var i = 0; i < segment.sites.length; i++) {
            tip += segment.sites[i].motifName + ">" +
                segment.sites[i].scorePosition + "..." +
                (segment.sites[i].scorePosition + segment.sites[i].siteLength - 1) + "//";
        }

        if (tip.length == 0)
            tip = "empty";

        tooltipElement.textContent = tip;

        return tooltipElement;
    };


    //wrap string in order to make id select
    var jq = function(myId) {
        return "#" + myId.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
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

