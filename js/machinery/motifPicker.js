var motifPicker = (function () {
    var _fileName = "motifPicker",
        _motifSummaries = [],
        _chosenMotifsSet = new Set(), //ToDo Change Set To Dictionary o(1)

        _maxResultCount;


    var create = function () {
        _maxResultCount = 5;

        promiseMotifSummaries().then(function (promisedMotifSummaries) {
            setMotifSummaries(promisedMotifSummaries);
            motifSearch.create();

            //ToDo initial state
            $("#motif-search").val("g");
            motifSearch.applySearch();
            $("#motif-list").children().first().children().first().children().first().click();
            $('body').click();
        });
    };


    var promiseMotifSummaries = function () {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/human/mono.json?summary=true"
            //"http://hocomoco.autosome.ru/human/mono.json" - Names only
        });
    };


    var setMotifSummaries = function (promisedMotifSummaries) {
        if (_motifSummaries.length != 0) {
            errorHandler.logError({"fileName": _fileName, "message": "warning, library is not empty"});
            console.log(_motifSummaries);
        }
        _motifSummaries = promisedMotifSummaries;
    };


    var setSuggestedMotifList = function (suggestedMotifs) {
        var topMotifs = suggestedMotifs.slice(0, _maxResultCount),
            ifMoreValue = ifMore(suggestedMotifs),

            motifContainers = $.map(topMotifs, wrapMotifInContainer).join(''),
            ifMoreContainer = wrapIfMoreValueInContainer(ifMoreValue);

        $('#motif-list').html(motifContainers);
        $('#ifMore-container').html(ifMoreContainer);
    };


    var ifMore = function (suggestedMotifs) {
        return (suggestedMotifs.length > _maxResultCount) ? (suggestedMotifs.length - _maxResultCount) : 0;
    };


    var wrapMotifInContainer = function (suggestedMotif) {
        var summary = suggestedMotif[0],
            primaryInfo = wrapSummaryPrimaryInformation(summary),
            additionalInfo = wrapSummaryAdditionalInformation(summary);


        return '<div class="motif-container">' +
            primaryInfo +
            '</div>';
    };


    var wrapSummaryPrimaryInformation = function (motifSummary) {
        var name = motifSummary["full_name"], family = motifSummary["motif_families"];

        return '<div class="suggestion"' + ' id="' + name + '">' +
            '<div class="motif-title feature">'+ name +'</div>' +
            '<div class="motif-family feature second">'+ family +'</div>' +
            '</div>';
    };


    var wrapSummaryAdditionalInformation = function (motifSummary) {
        return motifSummary["motif_subfamilies"];
    };


    var wrapIfMoreValueInContainer = function (ifMoreValue) {
        var ifMoreContainer = "";

        if (ifMoreValue != 0) {
            ifMoreContainer = '<div class="ifMore-value suggestion">'
                + 'And ' + ifMoreValue + ' more motifs.' +
                '</div>';
        }
        return ifMoreContainer;
    };


    var ifMotifIsChosen = function (motifName) {
        return _chosenMotifsSet.has(motifName);
    };


    var getRequestedMotifNames = function () {
        var $motifTitles = $(".chosen-motif > .motif-title"),
            requestedMotifNames = [];

        if ($motifTitles.length > 0) {
            $motifTitles.each(function () {
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


    var getChosenMotifSet = function () {
        return _chosenMotifsSet;
    };


    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };


    var testedAgainstSearch = function (motifName) {
        var val = $.trim($("#motif-search").val()),
            reg = new RegExp( RegExpEscape(val), 'i');
        return reg.test(motifName);
    };

    return {
        create: create,

        addChosenMotifToSet: addChosenMotifToSet,
        deleteChosenMotifFromSet: deleteChosenMotifFromSet,
        ifMotifIsChosen: ifMotifIsChosen,

        getMotifSummaries: getMotifSummaries,
        getRequestedMotifNames: getRequestedMotifNames,
        getChosenMotifContainer: getChosenMotifContainer,
        getChosenMotifSet: getChosenMotifSet,

        setSuggestedMotifList: setSuggestedMotifList,
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

        $search = $('#motif-search');
        $search.val("");

        $search.on('input', applySearch);

        $search.on("focusout", function () {
            if (    !($search.is(':hover') || $(".suggestions").is(':hover') ||
                $("#motif-list-selected-cmp").is(':hover'))  ) {
                    $(".suggestions").hide();
            }
        });
        $search.on("focus", function () {
            $(".suggestions").show();
        });
        $search.on("click", function () {
            $(".suggestions").show();
        });
    };


    var applySearch = function () {
        //ToDo binary search
        $('#motif-search').focus();

        var motifSummaries = motifPicker.getMotifSummaries(), //probably must be in picker
            regExpsToCheck = getRegExpsToCheck(),
            motifsToSuggest = getMotifsToSuggest(motifSummaries, regExpsToCheck);

        motifPicker.setSuggestedMotifList(motifsToSuggest);
    };


    var getMotifsToSuggest = function (motifSummaries, regExpsToCheck) {
        var suggestedMotifs = [];
        
        if (regExpsToCheck.length > 0) {
            var i, testResult = 0, currentSummary;

            for (i = 0; i < motifSummaries.length; i++) {
                currentSummary = motifSummaries[i];
                testResult = testMotif(currentSummary, regExpsToCheck);

                if (testResult != 0) {
                    suggestedMotifs.push([currentSummary, testResult]);
                }
            }
        }

        return suggestedMotifs;
    };


    var getRegExpsToCheck = function () {
        var searchInput = getSearchInput(),
            tokens = splitInputIntoTokens(searchInput);
        return $.map(tokens, tokenToRegExp);
    };


    var getSearchInput = function () {
        return $("#motif-search").val();
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


    var testMotif = function (motifSummary, regExpsToTest) {
        var motifName = motifSummary["full_name"];
        if (motifPicker.ifMotifIsChosen(motifName)) {
            return 0;
        } else {
            var testResult = 0, keysToTest = _keysToTest;
            for(var i = 0, key; i < keysToTest.length; i++) {
                key = keysToTest[i];
                testResult += testKeysWithRegExps(motifSummary[key], regExpsToTest);
            }
            return testResult;
        }
    };


    var testKeysWithRegExps = function (key, regExpsToTest) {
        var testString = keyToString(key);

        for (i = 0; i < regExpsToTest.length; i++) {
            if (!regExpsToTest[i].test(testString)) {
                return 0;
            }
        }
        return 1;
    };


    var keyToString = function (key) {
        var stringToTest = "";

        if (typeof key === 'undefined') {
            errorHandler.logError({"fileName": _fileName, "message": "motif summary key is undefined"});
        } else if (typeof key === "string") {
            stringToTest = key;
        } else {
            stringToTest = key.join(" "); //key is array and we join elements with " " separator
        }
        return stringToTest;
    };


    return {
        create: create,
        applySearch: applySearch
    };
}());