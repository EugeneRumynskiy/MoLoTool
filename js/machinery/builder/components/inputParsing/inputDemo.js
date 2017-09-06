var inputDemo = (function () {
    var _fileName = "inputDemo",
        _demoInput;


    var create = function (defaultInputDemo) {
        setDemoInput(defaultInputDemo);
    };


    var getDemoInput = function () {
        return _demoInput;
    };


    var setDemoInput = function (newDemoInput) {
        _demoInput = newDemoInput;
    };


    return {
        create: create,
        getDemoInput: getDemoInput
    }
}());