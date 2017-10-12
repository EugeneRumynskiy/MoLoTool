/**
 * Created by HOME on 01.02.2017.
 */
var colorPicker = (function () {
    var _fileName = "colorPicker",
        _defaultColors =    [
            "#F15854",
            "#FAA43A",
            '#DECF3F',
            "#60BD68",//4

            "#5DA5DA",
            "#F17CB0",
            "#B276B2",
            "#B2912F",//4


            "#ff0000",
            "#FF9800",
            "#4CAF50",
            "#2196F3",
            "#9C27B0",//5

            "#E91E63",
            "#f75c03",
            "#5c8001",
            "#3F51B5",
            "#4e0250",//5

            "#b02e0c",
            "#FFC107",
            "#134611",
            "#0a2463",
            "#9c3848",//5

            "#ef7674",
            "#795548",
            "#0d160b",
            "#607D8B",
            "#c490d1"//5
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
        var firstLine = _defaultColors.slice(0, 4),
            secondLine = _defaultColors.slice(4, 8);

        firstLine.push("#AAAAAA");
        secondLine.push("#4D4D4D");

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
                    firstLine,
                    secondLine,

                    _defaultColors.slice(8, 13),
                    _defaultColors.slice(13, 18),

                    ["#e15554","#e1bc29",
                        "#3bb273", "#4d9de0",
                        "#7768ae"],


                    ["#f6511d", "#ffb400",
                        "#7fb800", "#00a6ed",
                        "#0d2c54"],

                    _defaultColors.slice(18, 23),
                    _defaultColors.slice(23),

                    ["#434343", "#666666", "#00ff00", "#0000ff", "#ff00ff"]
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

