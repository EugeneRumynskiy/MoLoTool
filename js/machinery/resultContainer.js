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
        _className = "tooltip";


    var addTo = function (selector) {
        var $result = $("#result");
        $result.on('mouse' + 'enter', selector, mouseInHandler);
        $result.on('mouse' + 'leave', selector, mouseOutHandler);
    };


    var mouseInHandler = function () {
        var tooltipElement = createElement(),
            segment = sequenceConstructor.findSegmentWith(this.getAttribute('start'));
        this.append(tooltipElement);
        console.log(segment);
    };


    var mouseOutHandler = function () {
        this.lastChild.remove();
    };


    var createElement = function () {
        var tooltipElement = document.createElement(_element);
        tooltipElement.className = _className;
        return tooltipElement;
    };


    return {
        addTo: addTo
    };
}());

