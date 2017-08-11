/**
 * Created by HOME on 01.02.2017.
 */
var colorPicker = (function () {
    var _fileName = "colorPicker",
        _defaultColors =    ["#ff0000", "#E91E63", "#9C27B0", "#4e0250",
            "#3F51B5", "#0a2463", "#2196F3", "#00BCD4",
            "#009688", "#4CAF50", "#FFC107",
            "#FF9800","#795548","#607D8B", "#ef7674",
            "#b80c09", "#0d160b", "#c490d1", "#f75c03",
            "#b02e0c", "#9c3848", "#5c8001"],
        _freeColorIndex = 0,
        _eventHandler = function () {
            errorHandler.logError({"fileName": _fileName, "message": "_eventHandler hasn't been set"});
        };


    var create = function (eventHandler) {
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
    var addTo = function ($motifContainer) {
        var $colorPicker = $("<input class=\"motif-color-picker\">");

        $colorPicker.insertAfter($motifContainer.children(".motif-title"));
        set($motifContainer.children(".motif-color-picker"));
    };


    var removeFrom = function (motifContainer) {
        motifContainer.children(".motif-color-picker").spectrum("destroy");
        motifContainer.children(".motif-color-picker").remove();
        _freeColorIndex -= 1;
    };


    //by default the colorPicker is "input" element
    var set = function (colorPicker) {
        colorPicker.spectrum(
            {
                color: lastFreeColor(),
                showInput: true,
                className: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                maxSelectionSize: 10,
                preferredFormat: "hex",
                //localStorageKey: "spectrum.demo",
                move: function (color) {},
                show: function () {},
                beforeShow: function () {},
                hide: function () {},
                change: _eventHandler,
                palette: [
                    ["#000000", "#434343", "#666666", "#00ff00", "#0000ff", "#ff00ff"],

                    _defaultColors,
                    ["#f6511d", "#ffb400", "#00a6ed", "#7fb800", "#0d2c54"],
                    ["#4d9de0", "#e15554", "#e1bc29", "#3bb273", "#7768ae"]
            ]

            });
        _freeColorIndex += 1;
    };


    return {
        create: create,
        addTo: addTo,
        removeFrom: removeFrom,
        getColorFromContainer: getColorFromContainer
    };
}());

