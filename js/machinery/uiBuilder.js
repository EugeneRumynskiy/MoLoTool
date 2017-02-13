var uiBuilder = (function () {
    var _fileName = "uiBuilder";

    var buildUI = function () {
        motifPicker.create();
        buildExternalMotifPickerComponent();

        var table = motifTable.create();
        buildExternalTableComponent(table);

        var slider = pSlider.create();
        buildExternalSliderComponent();

        var result = resultContainer.create();

        //$( document ).tooltip();



        //$('.segment').hover( handlerIn, handlerOut );

        $('#markupButton').click(function(event){
            motifHandler.handleMotifs();
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
                $motifContainer.appendTo('#motif-list');
            }
        });

        $('#showMotifListButton').on('click', function(event){
            $('#motif-list').toggle();
        });
    };


    var buildExternalTableComponent = function (table) {
        $('#example tbody')
            .on( 'mouse' + 'enter', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData.startPosition, finish = rowData.finishPosition,
                        segment,
                        firstID = start, lastID;

                    while (start <= finish) {
                        segment = $('#' + start);
                        segment.addClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('id')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).addClass("first");
                    $('#' + lastID).addClass("last");
                }
            });

        $('#example tbody')
            .on( 'mouse' + 'leave', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData.startPosition, finish = rowData.finishPosition,
                        segment,
                        firstID = start, lastID;
                    while (start <= finish) {
                        segment = $('#' + start);
                        segment.removeClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('id')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).removeClass("first");
                    $('#' + lastID).removeClass("last");
                }
            });
    };


    var buildExternalSliderComponent = function () {
        pSlider.setEventHandler(motifHandler.handleMotifs);
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
