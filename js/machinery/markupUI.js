/**
 * Main UI module
 */

//Global data to save ajax request
//http://epifactors.autosome.ru/protein_complexes - как сделать поиск
// http://paletton.com/#uid=52Q0p1ki6rV87JXdgxQmgnFqvj3ki6rV87JXdgxQmgnFqvj3kdLmDeBKZcjw8bCe2ce5+
var globalMotifData = [];


$(function() {

    var motif_list_formatted, i, $motif, table;
    // TODO: replace this stub with actual Ajax request (see above)
    //creating of motif list
    motif_list_formatted = $.map(["AHR_HUMAN.H10MO.B","AIRE_HUMAN.H10MO.C","ALX1_HUMAN.H10MO.B"], function(el, ind){
        return '<div class="motifToChose">'+ el +'</div>';
    }).join('');
    $('#motifList').html(motif_list_formatted);
    table = myTable.createTable();



    var data, motifName = "AIRE_HUMAN.H10MO.C",
        motifNameList = ["AHR_HUMAN.H10MO.B", "ALX1_HUMAN.H10MO.B"],
        promises, allMotifsSaved = false,
        motifNameListCleared = [];

    for(i = 0; i < motifNameList.length; i++) {
        // pattern is - str.split(search).join(replacement)
        motifNameListCleared.push(motifNameList[i].split(".").join("_"));
    }
    console.log(motifNameListCleared);


    promises = motif.promisesForSelectedMotifs(motifNameList);
    $.when.apply(this, promises)
        .then(function(){
            console.log('done, all motifs saved and here they are\n', globalMotifData, '\n');
            allMotifsSaved = true;
        });


    //markup button functionality
    $('#markupButton').click(function(event){
        var sequence = parsing.parseInput()[0]["sequence"],
            pValueMax = $("#linearSlider-input").val(),
            sites = [], sequenceToDisplay = "";

        for(var i = 0; i < globalMotifData.length; i++) {
            motif.setMotif(globalMotifData[i]);
            sites = sites.concat(motif.findSites(sequence, pValueMax));
        }
        myTable.redrawTableWithSites(sites);
        sequenceToDisplay = markupSegmentation(sequence, sites);
        $('#result').html(sequenceToDisplay);

        console.log("sites and pValue", sites, "   ", pValueMax);
    });

    //clear button
    $('#clearButton').click(function(event){
        var sequence = $('#sequenceInput').val();
        $('#result').html(sequence);
    });

    //clear formatting button
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

    $('#motifList').on('click', '.motifToChose', function(event){
        $motif = $(event.target);
        $motif.appendTo('#motifListSelected');
    });

    $('#motifListSelected').on('click', '.motifToChose', function(event){
        var $motif = $(event.target);
        $motif.appendTo('#motifList');
    });

    $('#showMotifListButton').on('click', function(event){
        $('#motifList').toggle();

    });

});


function handleMotifs() {
    motif.setMotif(motifData);
    var sequence = $('#sequenceInput').val(), pValueMax = $("#pValue").val(),
        sites = motif.findSites(sequence, pValueMax);
    i = markupSegmentation(sequence, sites);
    myTable.redrawTableWithSites(sites);
    $('#result').html(i);
}