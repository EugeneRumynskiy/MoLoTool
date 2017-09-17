var scrollPositionStorage = (function () {
    var add = function (key, val) {
        sessionStorage.setItem(key, val);
    };


    var save = function (key) {
        var helpScrollPos = $("html").scrollTop();
        sessionStorage.setItem(key, helpScrollPos);
    };


    var restore = function (key) {
        var helpScrollPos = sessionStorage.getItem(key);
        $("html").scrollTop(helpScrollPos);
    };


    return {
        add: add,

        save: save,
        restore: restore
    };
}());