var moduleName = (function () {
    var _myPrivateVariable = "moduleName";


    var myPublicFunction = function () {
        return something;
    };


    var myPrivateFunction = function () {
        return something
    };


    return {
        myPublicFunctionName: myPublicFunction
    };
}());