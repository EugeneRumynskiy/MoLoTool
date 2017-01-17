/**
 * Created by Sing on 07.11.2016.
 * Note that The slider itself is from 0 to 1000 (min, max) but output values are between 0 and 1
 **/
var pSlider = (function () {
    var _initialValue = 0.001, _roundDigits = 3;

    var createSlider = function() {
        $("#pValueSlider").slider({
            range: false,
            min: 0,
            max: 1000,
            value: 1,
            animate: "fast",
            orientation: "horizontal",

            slide: function (event, ui) {
                $("#pValue").val(round(ui.value / 1000, _roundDigits));
                $("#pValueLog").val(round(-Math.log10(ui.value / 1000), _roundDigits));

                var sequence = $('#sequenceInput').val(),
                    pValueMax = $("#pValue").val(),
                    sites = [], sequenceToDisplay = "";

                for (var i = 0; i < globalMotifData.length; i++) {
                    motif.setMotif(globalMotifData[i]);
                    sites = sites.concat(motif.findSites(sequence, pValueMax));
                }

                myTable.redrawTableWithSites(sites);
                sequenceToDisplay = markupSegmentation(sequence, sites);
                $('#result').html(sequenceToDisplay);
            },

            change: function (event, ui) {
                $("#pValue").val(round(ui.value / 1000, _roundDigits));
                $("#pValueLog").val(round(-Math.log10(ui.value / 1000), _roundDigits));
            }
        });

        initValues();
    };


    var initValues = function () {
        $("#pValue").val(round(_initialValue, _roundDigits));
        $("#pValueLog").val(round(-Math.log10(_initialValue), _roundDigits));
    };


    return {
        create: createSlider
    };


}());