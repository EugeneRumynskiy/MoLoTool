/**
 * Created by HOME on 13.02.2017.
 */
var resultContainer = (function () {
    var _fileName = "resultContainer";

    var create = function () {
        buildUIComponent();
    };

    var buildUIComponent = function () {
        tooltip.addTo(".segment");
    };

    return {
        create: create
    };
}());



var tooltip = (function () {
    var _moduleName = "tooltip",
        _element = "div",
        _className = "tooltip",
        _target = "tooltip-container";

    var getElemById = function (id) {
        return document.getElementById(id);
    };


    var addTo = function (selector) {
        var $result = $("#result");
        $result.on('mouse' + 'enter', selector, mouseInHandler);
        $result.on('mouse' + 'leave', selector, mouseOutHandler);
    };


    var mouseInHandler = function () {
        var segment = sequenceConstructor.findSegmentWith(this.getAttribute('start')),
            tooltipElement = createElement(segment);
        getElemById(_target).append(tooltipElement);
        console.log(segment);
    };


    var mouseOutHandler = function () {
        getElemById(_target).lastChild.remove();
    };


    var createElement = function (segment) {
        var tooltipElement = document.createElement(_element), tip = "";
        tooltipElement.className = _className;

        for (var i = 0; i < segment.sites.length; i++) {
            tip += segment.sites[i].motifName + "   >   ";
            tip += segment.sites[i].scorePosition + "   //   "
        }

        if (tip.length == 0)
            tip = "empty";

        tooltipElement.textContent = tip;


        return tooltipElement;
    };


    return {
        addTo: addTo
    };
}());

