var motifPickerButtons = (function () {
    var _fileName = "motifPickerButtons",
        _currentClass,
        _nextClass;



    var create = function () {
        _currentClass = "flattened";
        _nextClass = initClasses(["hidden", "full-screen", "flattened"]);

        setButtons();
    };


    var initClasses = function (classesToSet) {
        var nextClass = {};

        if ((classesToSet == undefined) || (classesToSet.length < 2)) {
            errorHandler.logError({"fileName": _fileName, "message": "initClasses are undefined"});
        } else {
            for (var i = 0; i < classesToSet.length - 1; i++) {
                nextClass[classesToSet[i]] = classesToSet[i + 1];
            }

            i = classesToSet.length - 1;
            nextClass[classesToSet[i]] = classesToSet[0];
        }

        return nextClass;
    };


    var getCurrentClass = function () {
        return _currentClass;
    };


    var setCurrentClassTo = function (newCurrentClass) {
        _currentClass = newCurrentClass;
    };


    var getNextClass = function (currentClass) {
        if (!(currentClass in _nextClass)) {
            errorHandler.logError({"fileName": _fileName, "message": "getNextClass, currentClass not in _nextClass"});
        }
        return _nextClass[currentClass];
    };


    var setButtons = function () {
        setViewButton();
        setTitleButton();
    };


    var setViewButton = function () {
        var $button = $("#change-sequence-view");
        $button.on('click', function(event) {
            event.preventDefault();

            var $source = $(this),
                $target = $("#" + $source.attr("data-apply-to-id")),
                currentClass = getCurrentClass(),
                nextClass = getNextClass(currentClass);

            $target.removeClass(currentClass);
            $target.addClass(nextClass);
            setCurrentClassTo(nextClass);
        });
    };


    var setTitleButton = function () {
        var $button = $("#show-title-button");
        $button.on('click', function(event) {
            event.preventDefault();

            $("#sequence-input").toggleClass("hidden");
            $("#title-input").toggleClass("hidden");
        });
    };


    return {
        create: create,
    };
}());
/**
 * Created by swm on 06.07.17.
 */
