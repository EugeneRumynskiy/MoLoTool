var motifPicker = (function () {
    var _fileName = "motifPicker",
        _nameLibrary = [],
        _chosenMotifsSet = new Set();


    var init = function () {
        setupMotifPicker();

        $('#motif-list').on('click', '.motif-title', function(event){
            var $motifTitle = $(event.target), motifName = $motifTitle.text(),
                $motifContainer = $motifTitle.parent();
            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);

            addChosenMotifToSet(motifName);
            motifLibrary.addUnit(motifName);

            $motifContainer.appendTo('#motif-list-selected');
        });

        $('#motif-list-selected').on('click', '.motif-title', function(event){
            var $motifTitle = $(event.target), motifName = $motifTitle.text(),
                $motifContainer = $(event.target).parent();
            $motifContainer.removeClass('chosen-motif');
            colorPicker.removeFrom($motifContainer);

            deleteChosenMotifFromSet(motifName);

            if (testedAgainstSearch(motifName)) {
                $motifContainer.appendTo('#motif-list');
            }
        });

        $('#showMotifListButton').on('click', function(event){
            $('#motif-list').toggle();
        });
    };


    var setupMotifPicker = function () {
        promiseNameLibrary().then(function (nameLibrary) {
            setNameLibrarySet(nameLibrary);
            setMotifList(nameLibrary);
            setSearch();
        });
    };


    var promiseNameLibrary = function () {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/human/mono.json"
        });
    };


    var setNameLibrarySet = function (nameLibrary){
        _nameLibrary = nameLibrary;
    };


    var addChosenMotifToSet = function (motifName){
        _chosenMotifsSet.add(motifName);
    };


    var deleteChosenMotifFromSet = function (motifName){
        _chosenMotifsSet.delete(motifName);
    };



    var setMotifList = function (nameLibrary) {
        var motifContainers = $.map(nameLibrary, createHTMLContainer).join('');
        $('#motif-list').html(motifContainers);
    };


    var createHTMLContainer = function (motifName) {
        return '<div class="motif-container"' + ' id="' + motifName + '">' +
            '<div class="motif-title">'+ motifName +'</div>' +
            '</div>';
    };


    var setSearch = function () {
        $('#search').on('input', function () {
            var val = $.trim($(this).val()),
                reg = RegExp( RegExpEscape(val), 'i'),
                nameSelection = [];

            for (var i = 0; i < _nameLibrary.length; i++) {
                if ( (!_chosenMotifsSet.has(_nameLibrary[i])) && (reg.test(_nameLibrary[i])) ) {
                    nameSelection.push(_nameLibrary[i]);
                }
            }
            setMotifList(nameSelection);
        });
    };


    var testedAgainstSearch = function (motifName) {
        var val = $.trim($("#search").val()),
            reg = RegExp( RegExpEscape(val), 'i');
        console.log(reg.test(motifName));
        return reg.test(motifName);
    };

    var RegExpEscape = function( value ) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
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
    
    
    var getMotifColor = function (motifName) {
        var $motifContainer = $(jq(motifName));

        if ($motifContainer.hasClass("chosen-motif")) {
            var $picker = $motifContainer.children(".motif-color-picker");
            return colorPicker.getPickerColor($picker);
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "motif not chosen"});
            return 0;
        }
    };


    //wrap string in order to make id select
    var jq = function(myId) {
        return "#" + myId.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
    };

    return {
        init: init,
        getUserRequestedNames: getUserRequestedNames,
        getMotifColor: getMotifColor
    };
}());
/**
 * Created by HOME on 02.02.2017.
 */
