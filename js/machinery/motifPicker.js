var motifPicker = (function () {
    var _fileName = "motifPicker",
        _nameLibrary = [],
        _chosenMotifsSet = new Set(),
        _ifMoreValue = 0;


    var create = function () {
        setupMotifPicker();
    };


    var setupMotifPicker = function () {
        promiseNameLibrary().then(function (motifNames) {
            setNameLibrary(motifNames);
            motifSearch.setSearch();
        });
    };


    var promiseNameLibrary = function () {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/human/mono.json"
        });
    };


    var setNameLibrary = function (motifNames){
        _nameLibrary = motifNames;
    };


    var setSuggestedMotifList = function (suggestedMotifs, ifMoreValue) {
        var motifContainers = $.map(suggestedMotifs, createHTMLContainer).join('');
        $('#motif-list').html(motifContainers);
        setIfMoreValue(ifMoreValue);
    };

    var setIfMoreValue = function (ifMoreValue) {
        _ifMoreValue = ifMoreValue;
        if (ifMoreValue != 0) {
            var ifMoreBox = '<div class="ifMore-value suggestion">'+ 'And ' + ifMoreValue + ' more motifs.' + '</div>';
            $('#ifMore-container').html(ifMoreBox);
        } else {
            $('#ifMore-container').html("");
        }
    };

    var getCurrentIfMoreValue = function () {
        return _ifMoreValue;
    };


    var createHTMLContainer = function (suggestedMotif) {
        var motifName = suggestedMotif[0];
        return '<div class="motif-container suggestion"' + ' id="' + motifName + '">' +
            '<div class="motif-title">'+ motifName +'</div>' +
            '</div>';
    };


    var motifIsChosen = function (motifName) {
        return _chosenMotifsSet.has(motifName);
    };


    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };


    var testedAgainstSearch = function (motifName) {
        var val = $.trim($("#search").val()),
            reg = new RegExp( RegExpEscape(val), 'i');
        return reg.test(motifName);
    };


    var getUserRequestedNames = function () {
        var $motifTitles = $(".chosen-motif > .motif-title"),
            userSetNames = [];
        if ($motifTitles.length == 0) {
            return userSetNames;
        }
        else {
            $motifTitles.each(function (index) {
                userSetNames.push($(this).text());
            });
            return userSetNames
        }
    };
    
    
    var getSelectedMotifContainer = function (motifName) {
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

    var getChosenMotifSet = function () {
        return _chosenMotifsSet;
    };

    var getNameLibrary = function () {
        return _nameLibrary;
    };

    return {
        create: create,

        addChosenMotifToSet: addChosenMotifToSet,
        deleteChosenMotifFromSet: deleteChosenMotifFromSet,

        motifIsChosen: motifIsChosen,
        getChosenMotifSet: getChosenMotifSet,
        getNameLibrary: getNameLibrary,

        testedAgainstSearch: testedAgainstSearch,
        getUserRequestedNames: getUserRequestedNames,
        getSelectedMotifContainer: getSelectedMotifContainer,
        getCurrentIfMoreValue: getCurrentIfMoreValue,

        setSuggestedMotifList: setSuggestedMotifList,
        setIfMoreValue: setIfMoreValue
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
            //console.log($(".full-spectrum:hover").size());
            //var ifChosenMotifIsHovered = (($(".full-spectrum").size() != 0) && ($(".full-spectrum:hover")));
            //console.log(ifChosenMotifIsHovered);

            if (!($search.is(':hover') || $(".suggestions").is(':hover') ||
                $("#motif-list-selected-cmp").is(':hover')    )) {
                    $(".suggestions").hide();
            }
        });
        $search.on( "focus", function () {
            $(".suggestions").show();
        });
    };


    var applySearch = function () {
        $('#search').focus();

        var searchString = $("#search").val(),
            nameLibrary = motifPicker.getNameLibrary(),
            tokens = splitSearchStringIntoTokens(searchString),
            transformedTokens = $.map(tokens, tokenToRegExp),
            motifName = "",
            suggestedMotifs = [], testResult = 0;

        if (tokens.length == 0) {
            motifPicker.setSuggestedMotifList([], ifMore(suggestedMotifs));
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
        if (motifPicker.motifIsChosen(motifName)) {
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