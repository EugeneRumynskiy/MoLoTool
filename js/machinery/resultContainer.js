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
        console.log(this);

        var tooltipElement = createElement();
        this.append(tooltipElement);
    };


    var mouseOutHandler = function () {
        var $segment = $("#" + this.id);
        $segment.children("." + _className).remove();
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

