var uiBuilder = (function () {
    var _fileName = "uiBuilder",
        _eventHandler = undefined;


    var setUIEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function (event) {
        _eventHandler(event);
    };


    var buildUI = function () {
        setUIEventHandlerTo(motifHandler.handleMotifs);

        motifLibrary.create(handleEvent);
        colorPicker.create(handleEvent);

        motifPicker.create();
        buildExternalMotifPickerComponent();

        var table = motifTable.create();
        buildExternalTableComponent(table);

        pSlider.create(handleEvent);

        resultContainer.create();
        buildExternalResultContainerComponent();

        fileUploader.create(inputCallback);

        var tabIdRange = {"min": 1, "max": 10};
        sequenceLibrary.create(tabIdRange);
        resultTabs.create(
            tabIdRange,
            sequenceLibrary.isRecorded,
            sequenceLibrary.deleteTabContentById
        );

        uiButtons.create(handleEvent, inputCallback);

        inputParsing.create();

        window.setTimeout(function () {
            $("#demo-button").trigger("click");
        }, 800);
    };


    var clearSequenceLibrary = function () {
        $(".tab-result .close").trigger("click");
    };


    var inputCallback = function (inputString, replaceCurrent) {
        if (replaceCurrent === true) {
            clearSequenceLibrary();
        }

        var sequences = inputParsing.parseInput(inputString),
            libraryIds = $.map(sequences, sequenceLibrary.addTab);

        $.map(libraryIds, resultTabs.addIdToResult);
        handleEvent();

        if (comparisonMode.getCurrentMode() === "Multiply") {
            resultTabs.updateWidth("setToMaximum");
        }
    };


    var buildExternalMotifPickerComponent = function () {
        $('#motif-list').on('click', '.motif-title', function(event){
            event.preventDefault();

            var $motifTitle = $(event.target),
                motifName = $motifTitle.text(),
                $motifContainer = $motifTitle.parent();

            if (motifPicker.getChosenMotifSet().size === 0) {
                $('#motif-list-selected-cmp').removeClass("empty");
            }

            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);

            var $closeButton = $('<a href="#" class="close"></a>');
            $closeButton.insertAfter($motifContainer.children(".motif-title"));

            var hocomocoRef = "http://hocomoco.autosome.ru/motif/" + motifName,
                titleWithRef = '<a href=' + hocomocoRef + ' class=hocomoco-info target=_blank>' +
                    motifName + '</a>';
            $motifTitle.html(titleWithRef);

            motifPicker.addChosenMotifToSet(motifName);
            motifLibrary.addUnit(motifName);

            $motifContainer.appendTo('#motif-list-selected');
            motifSearch.applySearch();
        });


        $('#motif-list-selected').on('click', '.close', function(event){
            var $motifContainer = $(event.target).parent(),
                $motifTitle = $(event.target).siblings(".motif-title"), motifName = $motifTitle.text();

            $motifContainer.removeClass('chosen-motif');
            colorPicker.removeFrom($motifContainer);
            motifPicker.deleteChosenMotifFromSet(motifName);
            $motifContainer.remove();

            motifSearch.applySearch();

            if (motifPicker.getChosenMotifSet().size === 0) {
                $('#motif-list-selected-cmp').addClass("empty");
            }

            handleEvent();
        });


        //search bar usability
        //ToDo bad-bad-bad code
        $('body').click(function(event) {
            var $target = $(event.target);

            if (($target.parents(".search-container").length === 0) &&
                (!$target.hasClass("feature"))) {
                $(".suggestions").hide();
            }
        });
    };


    var buildExternalTableComponent = function (table) {
        var $motifTableTBody = $('#motif-table').find('tbody'),
            $result = $("#result-cmp");

        //highlight sequence
        $motifTableTBody
            .on( 'mouse' + 'enter', 'td', function () {
                var rowData = table.row( this ).data(),
                    $resultTab = $result.children(".current-tab-result").find(".tab-result-sequence");

                if (rowData !== undefined){
                    var start = rowData["Start Position"], finish = rowData["Finish Position"],
                        $segment,
                        firstID = start,
                        lastID;

                    while (start <= finish) {
                        $segment = $resultTab.children('[data-start=' + start + ']');
                        $segment.addClass("highlighted");
                        if ((finish - start + 1) === $segment.text().length) {
                            break
                        } else {
                            start = $segment.next().attr('data-start')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).addClass("first");
                    $('#' + lastID).addClass("last");
                }
            });

        $motifTableTBody
            .on( 'mouse' + 'leave', 'td', function () {
                var rowData = table.row( this ).data(),
                    $resultTab = $result.children(".current-tab-result").find(".tab-result-sequence");

                if (rowData  !== undefined) {
                    var start = rowData["Start Position"], finish = rowData["Finish Position"],
                        $segment,
                        firstID = start,
                        lastID;

                    while (start <= finish) {
                        $segment = $resultTab.children('[data-start=' + start + ']');
                        $segment.removeClass("highlighted");
                        if ((finish - start + 1) === $segment.text().length) {
                            break
                        } else {
                            start = $segment.next().attr('data-start');
                        }
                    }
                    lastID = start;

                    $('#' + firstID).removeClass("first");
                    $('#' + lastID).removeClass("last");
                }
            });
    };


    var buildExternalResultContainerComponent = function () {
        resultContainer.setExternalFocusObject(pSlider.isActive);
    };


    return {
        buildUI: buildUI
    };
}());