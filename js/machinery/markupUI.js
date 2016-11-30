/**
 * Main UI module
 */

//Global data to save ajax request
//http://epifactors.autosome.ru/protein_complexes - как сделать поиск
var globalMotifData = [];



$(function() {

    var motif_list_formatted, i, $motif, table;
    // TODO: replace this stub with actual Ajax request (see above)
    //creating of motif list
    motif_list_formatted = $.map(["AHR_HUMAN.H10MO.B","AIRE_HUMAN.H10MO.C","ALX1_HUMAN.H10MO.B"], function(el, ind){
        return '<div class="motif">'+ el +'</div>';
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
            console.log('done, all motifs saved\n', globalMotifData);
            allMotifsSaved = true;
        });


    //markup button functionality
    $('#markupButton').click(function(event){


        var sequence = $('#sequenceInput').val(), pValueMax = $("#pValue").val(),
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

    $( "#pValueSlider" ).slider({
        range: false,
        min: 0,
        max: 1000,
        value: 100,
        animate: "fast",
        orientation: "horizontal",

        slide: function (event, ui) {
            $("#pValue").val(ui.value / 1000);


            var sequence = $('#sequenceInput').val(), pValueMax = $("#pValue").val(),
                sites = [], sequenceToDisplay = "";

            for(var i = 0; i < globalMotifData.length; i++) {
                motif.setMotif(globalMotifData[i]);
                sites = sites.concat(motif.findSites(sequence, pValueMax));
            }
            myTable.redrawTableWithSites(sites);
            sequenceToDisplay = markupSegmentation(sequence, sites);
            $('#result').html(sequenceToDisplay);

        },
        change: function (event, ui) {
            $("#pValue").val(ui.value / 1000);
        }
    });

    $( "#pValue" ).val( $("#pValueSlider").slider("value")/ 1000 );


    $('#motifList').on('click', '.motif', function(event){
        $motif = $(event.target);
        $motif.appendTo('#motifListSelected');
    });

    $('#motifListSelected').on('click', '.motif', function(event){
        var $motif = $(event.target);
        $motif.appendTo('#motifList');
    });

    $('#showMotifListButton').on('click', function(event){
        $('#motifList').show();
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

