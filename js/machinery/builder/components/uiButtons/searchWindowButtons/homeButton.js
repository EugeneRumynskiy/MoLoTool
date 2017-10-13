var homeButton = (function () {
    var $button,

        $interface,
        $tutorial,
        $help;


    var switchMode = function () {
        if ($interface.hasClass("hidden")) {
            if (!$tutorial.hasClass("hidden")) {
                tutorialButton.switchMode();
            } else if (!$help.hasClass("hidden")) {
                helpButton.switchMode();
            }
        }
    };


    var init = function () {
        $button = $(".the-nav .title-container span");

        $interface = $(".interface-area");
        $tutorial = $("#tutorial-cmp");
        $help = $("#help-cmp");

        $button
            .on('click', function(event) {
                event.preventDefault();
                switchMode();
            });
    };


    return {
        init: init,
        switchMode: switchMode
    }
}());
