var uiBuilder = (function () {
    var _fileName = "uiBuilder";


    var buildUI = function () {
        motifPicker.init();
        buildMotifPickerComponent();

        motifTable.createTable();

        //$( document ).tooltip();

        $('#result')
            .on( 'mouse' + 'enter', '.segment', function () {
                    console.log(this);
                }
            );

        $('#markupButton').click(function(event){
            motifHandler.handleMotifs();
        });

        pSlider.create();
    };

    var buildMotifPickerComponent = function () {
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

    return {
        buildUI: buildUI
    };
}());

/**
 * Created by HOME on 12.02.2017.
 */
