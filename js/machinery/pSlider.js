/**
 * Created by Sing on 07.11.2016.
 * Note that The slider itself is from 0 to 1000 (min, max) but output values are between 0 and 1
 **/
var pSlider = (function () {
    var _initialValue = 3, _nDigits = 5,
        _sliderRange = {
            'min': [0],
            'max': [4]
        };

    var setSlider = function() {
        var logSlider = document.getElementById('logSlider');

        noUiSlider.create(logSlider, {
            start: _initialValue,
            orientation: "horizontal",
            direction: 'rtl', //left to right
            connect: [false, true],
            behaviour: 'snap',
            range: _sliderRange,
            pips: {
                stepped: false,
                mode: 'values',
                density: 5,
                values: [0, 1, 2, 3, 4]
            }
        });
        return logSlider;
    };


    var setOutputValues = function (logSlider) {
        var logValue = document.getElementById('logSlider-input'),
            linearValue = document.getElementById('linearSlider-input');

        logSlider.noUiSlider.on('update', function( values, handle ) {
            logValue.value = round(values[handle], _nDigits);
            linearValue.value = round(Math.pow(10, -values[handle]), _nDigits);

            //

            var sequence = parsing.parseInput()[0]["sequence"],
                pValueMax = $("#linearSlider-input").val(),
                sites = [], sequenceToDisplay = "";

            for (var i = 0; i < globalMotifData.length; i++) {
                motif.setMotif(globalMotifData[i]);
                sites = sites.concat(motif.findSites(sequence, pValueMax));
            }

            myTable.redrawTableWithSites(sites);
            sequenceToDisplay = markupSegmentation(sequence, sites);
            $('#result').html(sequenceToDisplay);

            //
        });

        logValue.addEventListener('change', function(){
            logSlider.noUiSlider.set(round(this.value, _nDigits));
        });
        linearValue.addEventListener('change', function(){
            logSlider.noUiSlider.set(round(Math.pow(10, -this.value), _nDigits));
        });


    };

    var createSlider = function () {
        var logSlider = setSlider();
        setOutputValues(logSlider)
    };

    return {
        create: createSlider
    };

}());