/**
 * Created by Sing on 07.11.2016.
 * Note that The slider itself is from 0 to 1000 (min, max) but output values are between 0 and 1
 *
 **/
var pSlider = (function () {
    var _initialLogValue = 1.78,
        _nDigits = {"log": 3, "linear": 3},
        _borderValue = {
            "log": {"min": 1.3010, "max": 6},
            "linear":{"min": 0.000001, "max": 0.0500}
        },
        _sliderRange = {"min": [1.3010], "max": [6]},
        _fileName = "pSlider",
                _eventHandler = function() {
            errorHandler.logError({"fileName": _fileName, "message": "_eventHandler hasn't been set"});
        },
        _isActive = false;



    var create = function () {
        var logSlider = setSlider();
        buildUIComponent(logSlider);
        return logSlider;
    };


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
                values: [2, 3, 4, 5, 6]
            }
        });

        logSlider.noUiSlider.on('start', function(){
            _isActive = true;
            console.log(_isActive);
        });

        logSlider.noUiSlider.on('end', function(){
            _isActive = false;
            console.log(_isActive);
        });

        return logSlider;
    };


    var roundValue = function (value, type) {
        var linearValueBorder = 1;
        if (type == "log")
            return round(value, _nDigits[type]);
        else if ((type == "linear")&&(value < linearValueBorder)) {
            return round(value, _nDigits[type] + 1);
        } else
            return round(value, _nDigits[type]);
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


    var buildUIComponent = function (logSlider) {
        var logValue = document.getElementById('logSlider-input'),
            linearValue = document.getElementById('linearSlider-input');

        logValue.value = roundValue(_initialLogValue, "log");
        linearValue.value = roundValue(Math.pow(10, -_initialLogValue), "linear");


        logValue.addEventListener('change', function(){
            logValue.value = restrictValue(logValue.value, "log");
            linearValue.value = roundValue(Math.pow(10, -this.value), "linear");
            logSlider.noUiSlider.set(roundValue(this.value, "log"));

            handleEvents();
        });

        linearValue.addEventListener('change', function(){
            linearValue.value = restrictValue(linearValue.value, "linear");
            logValue.value = roundValue(-Math.log10(this.value), "log");
            logSlider.noUiSlider.set(roundValue(-Math.log10(this.value), "log"));

            handleEvents();
        });

        logSlider.noUiSlider.on('slide', function( values, handle ) {
            logValue.value = roundValue(values[handle], "log");
            linearValue.value = roundValue(Math.pow(10, -values[handle]), "linear");

            handleEvents();
        });
    };

    var setEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };

    var handleEvents = function () {
        _eventHandler();
    };

    var isActive = function () {
        return _isActive;
    };


    return {
        create: create,
        setEventHandlerTo: setEventHandlerTo,
        isActive: isActive
    };

}());