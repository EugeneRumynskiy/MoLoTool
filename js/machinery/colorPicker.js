/**
 * Created by HOME on 01.02.2017.
 */
var colorPicker = (function () {
    var _fileName = "colorPicker",
        _defaultColors = ["#F15854",
            "#FAA43A", '#DECF3F', '#60BD68',
            '#5DA5DA', '#F17CB0', '#B276B2', '#B2912F', '#AAAAAA', '#4D4D4D'],
        _freeColorIndex = 0,
        _eventHandler = function () {
            errorHandler.logError({"fileName": _fileName, "message": "_eventHandler hasn't been set"});
        };


    var init = function (eventHandler) {
        setEventHandlerTo(eventHandler);
    };

    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var lastFreeColor = function () {
        return _defaultColors[_freeColorIndex];
    };


    var getColorFromContainer = function ($motifContainer) {
        var $picker = $motifContainer.children(".motif-color-picker");
        return $picker.spectrum("get").toHexString();
    };


    //add next default colorPicker to chosen motif
    var addTo = function (motifContainer) {
        var colorPicker = document.createElement('input');
        colorPicker.className = "motif-color-picker";
        motifContainer.append(colorPicker);
        set(motifContainer.children(".motif-color-picker"));
    };


    var removeFrom = function (motifContainer) {
        motifContainer.children(".motif-color-picker").spectrum("destroy");
        motifContainer.children(".motif-color-picker").remove();
        _freeColorIndex -= 1;
    };


    //by default the colorPicker is "input" element
    var set = function (colorPicker) {
        colorPicker.spectrum({
            color: lastFreeColor(),
            showInput: true,
            className: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            maxSelectionSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.demo",
            move: function (color) {
            },
            show: function () {
            },
            beforeShow: function () {
            },
            hide: function () {
            },
            change: _eventHandler
            ,
            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "#F15853",
                    "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],

                ["#F15854", "#FAA43A", '#DECF3F', '#60BD68', '#5DA5DA', '#F17CB0', '#B276B2', '#B2912F', '#AAAAAA', '#4D4D4D']
            ]

        });
        _freeColorIndex += 1;
    };


    return {
        init: init,
        addTo: addTo,
        removeFrom: removeFrom,
        getColorFromContainer: getColorFromContainer
    };
}());

