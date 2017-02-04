/**
 * Main UI module
 */
/**
 * markupUI             (to be refactored)      base file
 *
 * motifMath            (empty)                 algorithms to calculate some general stuff like "round" function
 * inputParsing         (good)                  extraction of data from input window
 * pSlider              (good)                  changing of p-value with range slider
 *
 * motifSegmentation    (good)
 * motif                (good)
 *
 * motifTable           (good)                  displaying of information produced in tables
 *
 * markupModule         (to be done)
 * markup               (to be refactored)      displaying of information produced in html text
 *
 * motifPicker
 * motifLibrary
 * motifHandler
 * inputParsing
 * colorPicker
 *
 * moduleExample
 *
 *
 * errorHandler         (to be done )
 */

//Global data to save ajax request
//http://epifactors.autosome.ru/protein_complexes - как сделать поиск
// http://paletton.com/#uid=52Q0p1ki6rV87JXdgxQmgnFqvj3ki6rV87JXdgxQmgnFqvj3kdLmDeBKZcjw8bCe2ce5+
$(function() {
    motifPicker.init();

    $('#markupButton').click(function(event){
        motifHandler.handleMotifs();
    });


    $('#clearButton').click(function(event){
        var sequence = $('#sequenceInput').val();
        $('#result').html(sequence);
    });


    $('#clearFormattingButton').click(function(event){

        $('.empty').css("background-color", "white" );
        $('.empty').css("color", "black" );

       var backgroundColors = ["#7D9CE4", "#7D9CE4"],
           fontColors = ["#E6841D", "#E6841D"];


        for(var i = 0; i < motifNameListCleared.length; i++) {
            $('.' + motifNameListCleared[i]).css("background-color", backgroundColors[i]);
            $('.' + motifNameListCleared[i]).css("color", fontColors[i]);
        }

        $('.poly').css("background-color", "black");
        $('.poly').css("color", "white");

    });
    pSlider.create();
});