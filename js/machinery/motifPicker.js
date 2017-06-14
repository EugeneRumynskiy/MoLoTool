var motifPicker = (function () {
    var _fileName = "motifPicker",
        _motifSummaries = [],
        _chosenMotifsSet = new Set(),
        _ifMoreValue = 0,

        _maxResultCount,
        _currentInterfaceState;


    var create = function () {
        _maxResultCount = 5;
        _currentInterfaceState = "hidden";

        promiseMotifSummaries().then(function (promisedMotifSummaries) {
            setMotifSummaries(promisedMotifSummaries);
            motifSearch.create();
        });
    };


    var promiseMotifSummaries = function () {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/human/mono.json?summary=true"
            //"http://hocomoco.autosome.ru/human/mono.json" - Names only
        });
    };


    var setMotifSummaries = function (promisedMotifSummaries){
        console.log(promisedMotifSummaries);

        if (!_motifSummaries.length == 0) {
            errorHandler.logError({"fileName": _fileName, "message": "warning, library is not empty"});
            console.log(_motifSummaries);
        }
        _motifSummaries = promisedMotifSummaries;
    };


    var setSuggestedMotifList = function (suggestedMotifs) {
        var motifContainers = $.map(suggestedMotifs.slice(0, _maxResultCount), wrapMotifInContainer).join(''),

            ifMoreValue = ifMore(suggestedMotifs);

        $('#motif-list').html(motifContainers);

        setIfMoreValue(ifMoreValue);
    };

    var ifMore = function (suggestedMotifs) {
        return (suggestedMotifs.length > _maxResultCount) ? (suggestedMotifs.length - _maxResultCount) : 0;
    };

    var setIfMoreValue = function (ifMoreValue) {
        var ifMoreBox = "";

        if (ifMoreValue != 0) {
            ifMoreBox = '<div class="ifMore-value suggestion">'
                + 'And ' + ifMoreValue + ' more motifs.' +
                '</div>';
        }

        $('#ifMore-container').html(ifMoreBox);
        _ifMoreValue = ifMoreValue;
    };


    var wrapMotifInContainer = function (suggestedMotif) {
        var motifName = suggestedMotif[0];
        return '<div class="motif-container suggestion"' + ' id="' + motifName + '">' +
            '<div class="motif-title">'+ motifName +'</div>' +
            '</div>';
    };


    var ifMotifIsChosen = function (motifName) {
        return _chosenMotifsSet.has(motifName);
    };


    var getRequestedMotifNames = function () {
        var $motifTitles = $(".chosen-motif > .motif-title"),
            requestedMotifNames = [];

        if ($motifTitles.length > 0) {
            $motifTitles.each(function (index) {
                requestedMotifNames.push($(this).text());
            });
        }

        return requestedMotifNames;
    };
    
    
    var getChosenMotifContainer = function (motifName) {
        var $motifContainer = $(jq(motifName));

        if ($motifContainer.hasClass("chosen-motif")) {
            return $motifContainer;
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "motif not chosen"});
            return 0;
        }
    };


    //wrap string in order to make id select
    var jq = function(myId) {
        return "#" + myId.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
    };


    var addChosenMotifToSet = function (motifName){
        _chosenMotifsSet.add(motifName);
    };


    var deleteChosenMotifFromSet = function (motifName){
        _chosenMotifsSet.delete(motifName);
    };


    var getMotifSummaries = function () {
        return _motifSummaries;
    };


    var setCurrentInterfaceState = function (classToSet) {
        _currentInterfaceState = classToSet;
    };

    var getCurrentInterfaceState = function () {
        return _currentInterfaceState;
    };



    var getChosenMotifSet = function () {
        return _chosenMotifsSet;
    };
    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };
    var testedAgainstSearch = function (motifName) {
        var val = $.trim($("#search").val()),
            reg = new RegExp( RegExpEscape(val), 'i');
        return reg.test(motifName);
    };
    var getCurrentIfMoreValue = function () {
        return _ifMoreValue;
    };

    return {
        create: create,

        addChosenMotifToSet: addChosenMotifToSet,
        deleteChosenMotifFromSet: deleteChosenMotifFromSet,

        ifMotifIsChosen: ifMotifIsChosen,

        getMotifSummaries: getMotifSummaries,

        getRequestedMotifNames: getRequestedMotifNames,
        getChosenMotifContainer: getChosenMotifContainer,

        setSuggestedMotifList: setSuggestedMotifList,

        getCurrentInterfaceState: getCurrentInterfaceState,
        setCurrentInterfaceState: setCurrentInterfaceState,
    };
}());
/**
 * Created by HOME on 02.02.2017.
 */


var motifSearch = (function () {
    var _fileName = "motifSearch",
        _keysToTest = [];


    var create = function() {
        _keysToTest = ["full_name", "motif_families"];

        $search = $('#search');
        $search.val("");

        $search.on('input', applySearch);
        $search.on( "focusout", function () {
            if (    !($search.is(':hover') || $(".suggestions").is(':hover') ||
                $("#motif-list-selected-cmp").is(':hover')  )) {
                    $(".suggestions").hide();
            }
        });
        $search.on( "focus", function () {
            $(".suggestions").show();
        });
    };


    var applySearch = function () {
        //ToDo binary search
        $('#search').focus();

        var motifSummaries = motifPicker.getMotifSummaries(), //probably must be in picker
            regExpsToCheck = getRegExpsToCheck();

        if (regExpsToCheck.length == 0) {
            motifPicker.setSuggestedMotifList([]);
        } else {
            var suggestedMotifs = [], testResult = 0, motifSummary;
            for (var i = 0; i < motifSummaries.length; i++) {
                motifSummary = motifSummaries[i];
                testResult = testMotif(motifSummary, regExpsToCheck);
                if (testResult) {
                    suggestedMotifs.push([motifSummary["full_name"], testResult]);
                }
            }
            motifPicker.setSuggestedMotifList(suggestedMotifs);
        }
    };



    var getRegExpsToCheck = function () {
        var searchInput = getSearchInput(),
            tokens = splitInputIntoTokens(searchInput),
            regExpsToCheck = $.map(tokens, tokenToRegExp);
        return regExpsToCheck;
    };

    var getSearchInput = function () {
        return $("#search").val();
    };

    var splitInputIntoTokens = function (searchString) {
        var trimmedString = $.trim(searchString),
            tokens = trimmedString.split(" ");
        return tokens.filter(function(s){ return s != "" });
    };

    var tokenToRegExp = function (token) {
        return new RegExp(RegExpEscape(token), 'i');
    };

    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };


    var testMotif = function (motifSummary, regExpsToCheck) {
        var motifName = motifSummary["full_name"];
        if (motifPicker.ifMotifIsChosen(motifName)) {
            return 0;
        } else {
            var testResult = 0, keysToTest = _keysToTest;
            for(var i = 0, key; i < keysToTest.length; i++) {
                key = keysToTest[i];
                testResult += testKeysWithRegExps(motifSummary[key], regExpsToCheck);
            }
            return testResult;
        }
    };

    var testKeysWithRegExps = function (key, regExpsToCheck) {
        var testString = "";

        if (typeof(key) == "string") {
            testString = key;
        } else {
            for (var i = 0; i < key.length; i++) {
                testString += " " + key[i];
            }
        }

        for (i = 0; i < regExpsToCheck.length; i++) {
            if (!regExpsToCheck[i].test(testString)) {
                return 0;
            }
        }
        return 1;
    };


    return {
        create: create,
        applySearch: applySearch
    };
}());