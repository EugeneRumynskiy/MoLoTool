var uiBuilder = (function () {
    var _fileName = "uiBuilder";


    var buildUI = function () {
        motifPicker.init();
        motifPicker.buildUIComponent();

        var table = motifTable.createTable();
        motifTable.buildUIComponent(table);

        //$( document ).tooltip();

        $('#result')
            .on( 'mouse' + 'enter', '.segment', function () {
                    console.log(this);
                }
            );

        $('#markupButton').click(function(event){
            motifHandler.handleMotifs();
        });

        var slider = pSlider.create();
        pSlider.buildUIComponent(slider);
    };


    return {
        buildUI: buildUI
    };
}());

/**
 * Created by HOME on 12.02.2017.
 */
