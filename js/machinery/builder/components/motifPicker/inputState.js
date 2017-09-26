var inputStateSwitcher = (function () {
    var _fileName = "inputStateSwitcher",
        $inputsToControl;


    var create = function (objectsToDisable) {
        $inputsToControl = objectsToDisable;
        disableInput();
    };


    var disableInput = function () {
        $inputsToControl.prop("disabled", true);
    };


    var enableInput = function () {
        $inputsToControl.prop("disabled", false);
    };


    return {
        create: create,
        disableInput: disableInput,
        enableInput: enableInput
    }
}());