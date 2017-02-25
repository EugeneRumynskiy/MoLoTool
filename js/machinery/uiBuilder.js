var uiBuilder = (function () {
    var _fileName = "uiBuilder",
        _eventHandler = undefined;


    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };

    var handleEvent = function () {
        _eventHandler();
    };


    var buildUI = function () {
        setEventHandlerTo(motifHandler.handleMotifs);

        motifLibrary.create(handleEvent);
        colorPicker.init(handleEvent);

        motifPicker.create();
        buildExternalMotifPickerComponent();

        var table = motifTable.create();
        buildExternalTableComponent(table);

        pSlider.create();
        buildExternalSliderComponent();

        resultContainer.create();

        //$( document ).tooltip();


        $('.segment').on('mouse' + 'enter', function () {
            console.log("MOUSE OVER");
        });

        $('#markupButton').click(function(){
            handleEvent();
        });

        $('#sequenceInput').on('input', function () {
            handleEvent();
        });
    };


    var buildExternalMotifPickerComponent = function () {
        $('#motif-list').on('click', '.motif-title', function(event){
            var $motifTitle = $(event.target), motifName = $motifTitle.text(),
                $motifContainer = $motifTitle.parent();
            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);

            motifPicker.addChosenMotifToSet(motifName);
            motifLibrary.addUnit(motifName);

            $motifContainer.appendTo('#motif-list-selected');
        });

        $('#motif-list-selected').on('click', '.motif-title', function(event){
            var $motifTitle = $(event.target), motifName = $motifTitle.text(),
                $motifContainer = $(event.target).parent();
            $motifContainer.removeClass('chosen-motif');
            colorPicker.removeFrom($motifContainer);

            motifPicker.deleteChosenMotifFromSet(motifName);

            if (motifPicker.testedAgainstSearch(motifName)) {
                console.log("added/n");
                $motifContainer.appendTo('#motif-list');
            } else {
                $motifContainer.remove();
            }

            handleEvent();
        });

        $('#showMotifListButton').on('click', function(){
            $('#motif-list').toggle();
        });
    };


    var buildExternalTableComponent = function (table) {
        var $exampleTBody = $('#example').find('tbody'),
            $result = $("#result");



        $exampleTBody
            .on( 'mouse' + 'enter', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData.startPosition, finish = rowData.finishPosition,
                        segment,
                        firstID = start, lastID;

                    while (start <= finish) {
                        segment = $result.children('[start=' + start + ']');
                        segment.addClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('start')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).addClass("first");
                    $('#' + lastID).addClass("last");
                }
            });

        $exampleTBody
            .on( 'mouse' + 'leave', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData.startPosition, finish = rowData.finishPosition,
                        segment,
                        firstID = start, lastID;

                    while (start <= finish) {
                        segment = $result.children('[start=' + start + ']');
                        segment.removeClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('start')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).removeClass("first");
                    $('#' + lastID).removeClass("last");
                }
            });
    };


    var buildExternalSliderComponent = function () {
        pSlider.setEventHandlerTo(handleEvent);
    };


    var buildResultComponent = function () {

    };


    return {
        buildUI: buildUI
    };
}());

/**
 * Created by HOME on 12.02.2017.
 */