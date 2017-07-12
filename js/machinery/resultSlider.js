var resultSlider = (function () {
    var _fileName = "resultSlider",
        _sliderRange = {"min": [1.3010], "max": [6]};


    var create = function () {
        setSlider();
    };


    var setSlider = function () {
        var slider = document.getElementById('result-slider');

        noUiSlider.create(slider, {
            start: 3,
            orientation: "horizontal",
            direction: 'rtl', //left to right
            connect: [false, true],
            behaviour: 'snap',
            range: _sliderRange
            /*pips: {
                stepped: false,
                mode: 'values',
                density: 5,
                values: [2, 3, 4, 5, 6]
            }*/
        });

        slider.noUiSlider.on('slide', function( values, handle ) {
            var $target = $('#result-cmp').children(".current-tab-result"),
                tabId = $target.attr("data-tab"),
                $sequence = $target.find(".sequence");
            console.log($sequence);
        });
    };


    var myPrivateFunction = function () {
        return something
    };


    return {
        create: create
    };
}());

/**
 * Created by swm on 04.07.17.
 */
