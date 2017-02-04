var motifPicker = (function () {
    var _fileName = "motifPicker",
        _nameLibrary = [], _savedMotifs = [];


    //resolve promises for motifs _nameLibrary
    var init = function () {
        setMotifList();

        $('#motif-list').on('click', '.motif-title', function(event){
            var $motifTitle = $(event.target),
                $motifContainer = $motifTitle.parent();
            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);
            $motifContainer.appendTo('#motif-list-selected');

            var motifName = $motifTitle.text();
            motifLibrary.addUnit(motifName);

            console.log($motifTitle.text());
        });

        $('#motif-list-selected').on('click', '.motif-title', function(event){
            var $motifContainer = $(event.target).parent();
            $motifContainer.removeClass('chosen-motif');
            colorPicker.removeFrom($motifContainer);
            $motifContainer.appendTo('#motif-list');
        });

        $('#showMotifListButton').on('click', function(event){
            $('#motif-list').toggle();
        });
    };


    var setMotifList = function () {
        $.when(promiseNameLibrary())
            .then(function(){
                var motifContainers = $.map(_nameLibrary, createHTMLContainer).join('');
                $('#motif-list').html(motifContainers);
            });
    };


    //set promises for motifs _nameLibrary
    var promiseNameLibrary = function () {
        return $.ajax({
            dataType: "json",
            url: "http://hocomoco.autosome.ru/human/mono.json"
        }).then(setNameLibrary);
    };


    var setNameLibrary = function (nameLibrary){
        _nameLibrary = nameLibrary;
    };


    var createHTMLContainer = function (motifName) {
        return '<div class="motif-container"' + 'id="' + motifName + '">' +
            '<div class="motif-title">'+ motifName +'</div>' +
            '</div>';
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
    
    
    var getMotifColor = function () {
        var motifName = "ENOA_HUMAN.H10MO.A",
            $motifContainer = $(jq(motifName));

        if ($motifContainer.hasClass("chosen-motif")) {
            var $picker = $motifContainer.children(".motif-color-picker");
            return colorPicker.getPickerColor($picker);
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "motif not chosen"});
            return 0;
        }
    };


    var ifSelected = function (motifName) {
        return
    };


    //wrap string in order to make id select
    var jq = function(myid) {
        return "#" + myid.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
    };

    return {
        init: init,
        getUserRequestedNames: getUserRequestedNames,
        getMotifColor: getMotifColor
    };
}());/**
 * Created by HOME on 02.02.2017.
 */
