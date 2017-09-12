var inputStateSwitcher = (function () {
    var _fileName = "inputStateSwitcher",
        $inputsToControl;


    var create = function (objectsToDisable) {
        $inputsToControl = objectsToDisable;
        disable();
    };


    var disable = function () {
        $inputsToControl.prop("disabled", true);
    };


    var enable = function () {
        $inputsToControl.prop("disabled", false);
    };


    return {
        create: create,
        disable: disable,
        enable: enable
    }
}());