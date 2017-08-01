/**
 * Created by Sing on 07.11.2016.
 * Note that The slider itself is from 0 to 1000 (min, max) but output values are between 0 and 1
 *
 **/
var pSlider = (function () {
    var _initialLogValue = 1.711,
        _nDigits = {"log": 3, "linear": 3},
        _restrictionValue = {
            "log": {"min": 1.3010, "max": 6},
            "linear":{"min": 0.000001, "max": 0.0500}
        },
        _sliderRange = {"min": [1.3010], "max": [6]},

        _fileName = "pSlider",
                _eventHandler = function() {
            errorHandler.logError({"fileName": _fileName, "message": "_eventHandler hasn't been set"});
        },
        _isActive = false;



    var create = function (eventHandler) {
        setEventHandlerTo(eventHandler);

        var logSlider = setSlider();
        buildUIComponent(logSlider);
        return logSlider;
    };


    var setSlider = function() {
        var logSlider = document.getElementById('log-slider');

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
        });

        logSlider.noUiSlider.on('end', function(){
            _isActive = false;
        });

        return logSlider;
    };


    var roundAccordingType = function (value, type, additionalDigits) {
        if (type == "log") {
            return round(value, _nDigits[type] + additionalDigits);
        } else if (type == "linear")
            return parseFloat(value).toExponential(_nDigits[type] - 1);
    };

    var restrictValue = function (value, type) {
        if (value > _restrictionValue[type]["max"])
            return roundAccordingType(_restrictionValue[type]["max"], type, 0);
        else if (value < _restrictionValue[type]["min"])
            return roundAccordingType(_restrictionValue[type]["min"], type, 0);
        else
            return value;
    };

    var roundThenRestrict = function (value, type, additionalDigits) {
        var rounded = roundAccordingType(value, type, additionalDigits);
        return restrictValue(rounded, type);
    };


    var buildUIComponent = function (logSlider) {
        var logValue = document.getElementById('logSlider-input'),
            linearValue = document.getElementById('linearSlider-input');

        //default values
        logValue.value = roundThenRestrict(_initialLogValue, "log", 0);
        linearValue.value = roundThenRestrict(Math.pow(10, -_initialLogValue), "linear", Math.floor(logValue.value));


        logValue.addEventListener('change', function(){
            logValue.value = roundThenRestrict(logValue.value, "log", 0);
            linearValue.value = roundThenRestrict(Math.pow(10, -this.value), "linear", Math.floor(logValue.value));
            logSlider.noUiSlider.set(logValue.value);
            handleEvents();
        });

        linearValue.addEventListener('change', function(){
            linearValue.value = roundThenRestrict(linearValue.value, "linear", Math.floor(-Math.log10(linearValue.value)));
            logValue.value = roundThenRestrict(-Math.log10(linearValue.value), "log", 0);
            logSlider.noUiSlider.set(logValue.value);
            handleEvents();
        });

        logSlider.noUiSlider.on('slide', function( values, handle ) {
            logValue.value = roundThenRestrict(values[handle], "log", 0);
            linearValue.value = roundThenRestrict(Math.pow(10, -values[handle]), "linear", Math.floor(logValue.value));
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


    var getPValue = function () {
        return $("#linearSlider-input").val();
    };


    return {
        create: create,
        isActive: isActive,
        getPValue: getPValue
    };

}());