/**
 * Created by Sing on 07.11.2016.
 * Note that The slider itself is from 0 to 1000 (min, max) but output values are between 0 and 1
 **/
var pSlider = (function () {
    //_initialLogValue = 3.00;
    var _initialLogValue = 1.78,
        _nDigits = {"log": 3, "linear": 3},
        _borderValue = {
            "log": {"min": 0, "max": 4},
            "linear":{"min": 0.0001, "max": 1}
        },
        _sliderRange = {"min": [0], "max": [4]},
        _fileName = "pSlider";

    var setSlider = function() {
        var logSlider = document.getElementById('logSlider');

        noUiSlider.create(logSlider, {
            start: _initialLogValue,
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


    var restrictValue = function (value, type) {
        var roundedValue = roundValue(value, type);

        if (roundedValue > _borderValue[type]["max"])
            return _borderValue[type]["max"];
        else if (roundedValue < _borderValue[type]["min"])
            return _borderValue[type]["min"];
        else
            return roundedValue;
    };


    var roundValue = function (value, type) {
        var linearValueBorder = 0.001;
        if (type == "log")
            return round(value, _nDigits[type]);
        else if ((type == "linear")&&(value < linearValueBorder)) {
            return round(value, _nDigits[type] + 1);
        } else
            return round(value, _nDigits[type]);
    };


    var setOutputValues = function (logSlider) {
        var logValue = document.getElementById('logSlider-input'),
            linearValue = document.getElementById('linearSlider-input');

        logValue.value = roundValue(_initialLogValue, "log");
        linearValue.value = roundValue(Math.pow(10, -_initialLogValue), "linear");


        logValue.addEventListener('change', function(){
            logValue.value = restrictValue(logValue.value, "log");
            linearValue.value = roundValue(Math.pow(10, -this.value), "linear");
            logSlider.noUiSlider.set(roundValue(this.value, "log"));

            motifHandler.handleMotifs();
        });

        linearValue.addEventListener('change', function(){
            linearValue.value = restrictValue(linearValue.value, "linear");
            logValue.value = roundValue(-Math.log10(this.value), "log");
            logSlider.noUiSlider.set(roundValue(-Math.log10(this.value), "log"));

            motifHandler.handleMotifs();
        });

        logSlider.noUiSlider.on('slide', function( values, handle ) {
            logValue.value = roundValue(values[handle], "log");
            linearValue.value = roundValue(Math.pow(10, -values[handle]), "linear");

            motifHandler.handleMotifs();
        });
    };


    var create = function () {
        var logSlider = setSlider();
        setOutputValues(logSlider)
    };


    return {
        create: create
    };

}());