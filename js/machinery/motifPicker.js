var motifPicker = (function () {
    var _fileName = "motifPicker",
        _motifSummaries = [],
        _chosenMotifsSet = new Set(),
        _ifMoreValue = 0;


    var create = function () {
        promiseMotifSummaries().then(function (promisedMotifSummaries) {
            setMotifSummaries(promisedMotifSummaries);
            motifSearch.setSearch();
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
        //ToDo
        if (_motifSummaries == []) {
            errorHandler.logError({"fileName": _fileName, "message": "warning, library is not empty"});
        }

        for(var i = 0; i < promisedMotifSummaries.length; i++) {
            _motifSummaries.push(promisedMotifSummaries[i].full_name);
        }

        //_motifSummaries = promisedMotifSummaries;
    };


    var setSuggestedMotifList = function (suggestedMotifs, ifMoreValue) {
        var motifContainers = $.map(suggestedMotifs, wrapMotifInContainer).join('');

        $('#motif-list').html(motifContainers);

        setIfMoreValue(ifMoreValue);
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


    var getNameLibrary = function () {
        return _motifSummaries;
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

        getNameLibrary: getNameLibrary,

        getRequestedMotifNames: getRequestedMotifNames,
        getChosenMotifContainer: getChosenMotifContainer,

        setSuggestedMotifList: setSuggestedMotifList
    };
}());
/**
 * Created by HOME on 02.02.2017.
 */


var motifSearch = (function () {
    var _fileName = "motifSearch",
        _maxResultCount = 5;


    var setSearch = function() {
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
        $('#search').focus();

        var searchString = getSearchRequest(),
            nameLibrary = motifPicker.getNameLibrary(),

            tokens = splitSearchStringIntoTokens(searchString),
            transformedTokens = $.map(tokens, tokenToRegExp),

            motifName = "",
            suggestedMotifs = [], testResult = 0;

        if (tokens.length == 0) {
            motifPicker.setSuggestedMotifList([], ifMore([]));
        } else {
            for (var i = 0; i < nameLibrary.length; i++) {
                motifName = nameLibrary[i];
                testResult = testMotifAgainstTokens(motifName, transformedTokens);
                if (testResult) {
                    suggestedMotifs.push([motifName, testResult]);
                }
            }

            motifPicker.setSuggestedMotifList(suggestedMotifs.slice(0, 5), ifMore(suggestedMotifs));
        }
    };


    var getSearchRequest = function () {
        return $("#search").val();
    };


    var ifMore = function (suggestedMotifs) {
        return (suggestedMotifs.length > _maxResultCount) ? (suggestedMotifs.length - _maxResultCount) : 0;
    };


    var splitSearchStringIntoTokens = function (searchString) {
        var trimmedString = $.trim(searchString),
            tokens = trimmedString.split(" ");
        return tokens.filter(function(s){ return s != "" });
    };


    var tokenToRegExp = function (token) {
        return new RegExp( RegExpEscape(token), 'i');
    };


    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };


    var testMotifAgainstTokens = function (motifName, transformedTokens) {
        if (motifPicker.ifMotifIsChosen(motifName)) {
            return 0;
        } else {
            for (var i = 0; i < transformedTokens.length; i++) {
                if (!transformedTokens[i].test(motifName)) {
                    return 0;
                }
            }
        }
        return 1;
    };


    return {
        setSearch: setSearch,
        applySearch: applySearch
    };
}());