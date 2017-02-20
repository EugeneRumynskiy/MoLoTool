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
        _target = "tooltip-container",
        _$hoveredMotifs = $("");

    var getElemById = function (id) {
        return document.getElementById(id);
    };


    var addTo = function (selectorName) {
        var $result = $("#result");
        $result.on('mouse' + 'enter', selectorName, mouseInHandler);
        $result.on('mouse' + 'leave', selectorName, mouseOutHandler);
    };


    var mouseInHandler = function () {
        var segment = sequenceConstructor.findSegmentWith(this.getAttribute('start')),
            tooltipElement = createElement(segment),
            $motif, $motifList = $("#motif-list-selected");
        getElemById(_target).append(tooltipElement);

        console.log(_$hoveredMotifs);
        for (var i = 0; i < segment.sites.length; i++) {
            $motif = $motifList.find(jq(segment.sites[i].motifName));
            _$hoveredMotifs = _$hoveredMotifs.add($motif);
        }
        console.log(_$hoveredMotifs);
        _$hoveredMotifs.addClass("motif-result-hover");
        console.log(segment);
    };


    var mouseOutHandler = function () {
        getElemById(_target).lastChild.remove();
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

