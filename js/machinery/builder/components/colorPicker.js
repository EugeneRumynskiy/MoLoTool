/**
 * Created by HOME on 01.02.2017.
 */
var colorPicker = (function () {
    var _fileName = "colorPicker",
        _defaultColors =    [
            "#F15854",
            "#FAA43A",
            '#DECF3F',
            '#60BD68',
            '#5DA5DA',
            '#F17CB0',
            '#B276B2',

            "#ff0000",
            "#4CAF50",
            "#2196F3",
            "#FF9800",
            "#9C27B0",

            "#E91E63",
            "#5c8001",
            "#3F51B5",
            "#f75c03",
            "#4e0250",

            "#b02e0c",
            "#009688",
            "#0a2463",
            "#FFC107",
            "#0d160b",

            "#9c3848",
            "#134611",
            "#00BCD4",

            "#c490d1",
            "#795548",
            "#607D8B",
            "#ef7674"
        ],


        _groupedColors_red = [
            "#ef7674",
            "#F15854",
            "#ff0000",
            "#b02e0c",
            "#795548"],

        _groupedColors_orange = [
            "#f75c03",
            "#FAA43A",
            "#FF9800",
            "#FFC107",
            "#DECF3F"],

        _groupedColors_green = [
            "#4CAF50",
            "#60BD68",
            "#5c8001",
            "#134611",
            "#0d160b"],

        _groupedColors_blue = [
            "#009688",
            "#607D8B",
            "#5DA5DA",
            "#00BCD4",
            "#2196F3",
            "#3F51B5",
            "#0a2463"],

        _groupedColors_purple = [
            "#c490d1",
            "#B276B2",
            "#9C27B0",
            "#4e0250"],

        _groupedColors_pink = [
            "#F17CB0",
            "#E91E63",
            "#9c3848"
        ],


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
                change: function (){_eventHandler("COLOR")},
                palette: [
                    _groupedColors_red,
                    _groupedColors_orange,
                    _groupedColors_green,
                    _groupedColors_blue,
                    _groupedColors_purple,
                    _groupedColors_pink,

                    ["#f6511d", "#ffb400",
                        "#00a6ed", "#7fb800",
                        "#0d2c54"],

                    ["#4d9de0", "#e15554",
                        "#e1bc29", "#3bb273",
                        "#7768ae"],

                    ["#000000", "#434343", "#666666", "#00ff00", "#0000ff", "#ff00ff"]
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

