var motifPicker = (function () {
    var _fileName = "motifPicker",
        _nameLibrary = [], _savedMotifs = [];


    //resolve promises for motifs _nameLibrary
    var init = function () {
        console.log("init");
        setMotifList();

        $('#motif-list').on('click', '.motif-title', function(event){
            var $motifContainer = $(event.target).parent();
            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);
            $motifContainer.appendTo('#motif-list-selected');
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
        return '<div class="motif-container"' + 'id="' + inputParsing.removeSeparators(motifName, ".") + '">' +
            '<div class="motif-title">'+ motifName +'</div>' +
            '</div>';
    };


    var getUserSetNames = function () {
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

    return {
        init: init,
        getUserSetNames: getUserSetNames
    };
}());/**
 * Created by HOME on 02.02.2017.
 */
