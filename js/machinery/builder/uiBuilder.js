var uiBuilder = (function () {
    /*http://hocomoco11.autosome.ru/human/mono.json?summary=true&full=true
     http://hocomoco11.autosome.ru/human/mono.json?summary=true&full=false*/

    var _fileName = "uiBuilder",
        _eventHandler = undefined,

        _motifSummariesSource = "http://hocomoco11.autosome.ru/human/mono.json?summary=true&full=false";


    var getObjectsToDisable = function () {
        var $objectsToDisable = $(".search-container")
            .find("input")
            .add("#clear-button, #demo-button");

        return $objectsToDisable;
    };


    var getMotifSummariesSource = function () {
        return _motifSummariesSource;
    };


    var setMotifSummariesSource = function (newUrl) {
        _motifSummariesSource = newUrl;
    };


    var setUIEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function (event) {
        var sitesCount = _eventHandler(event);
        console.log(sitesCount, "sitesCount");
    };


    var buildUI = function () {
        setUIEventHandlerTo(motifHandler.handleMotifs);

        motifLibrary.create(handleEvent);

        colorPicker.create(handleEvent);

        motifPicker.create(getMotifSummariesSource, getObjectsToDisable());
        buildExternalMotifPickerComponent();

        var motifFeatureTitles = motifLibrary.getTitlesForDisplayedFeatures(),
            motifFeaturesRequest = motifLibrary.getMotifFeaturesForTable,
            table = motifTable.create(motifFeatureTitles, motifFeaturesRequest);
        buildExternalTableComponent(table);

        pSlider.create(handleEvent);

        chosenMotifHighlight.create();

        fileUploader.create(inputCallback); //input

        var tabIdRange = {"min": 1, "max": 15};
        sequenceLibrary.create(tabIdRange); //input
        resultTabs.create(
            tabIdRange,
            sequenceLibrary.isRecorded,
            sequenceLibrary.deleteTabContentById,
            handleEvent
        );

        uiButtons.create(handleEvent, inputCallback, collectionSwitchCallback);

        inputParsing.create();//input

        /*window.setTimeout(function () {
            $("#demo-button").trigger("click");
        }, 100);*/

        tooltips.create();
    };


    var collectionSwitchCallback = function (newUrl) {
        setMotifSummariesSource(newUrl);
        motifPicker.updateMotifSummaries();
    };


    var resizeCallback = function () {
        comparisonMode.turnOffLocks();
        resultTabs.updateMarginForCurrentTab();
    };


    var inputCallback = function (inputString, replaceCurrent, status) {
        inputErrors.clearErrorStatus();


        if ($.isEmptyObject( motifPicker.getRequestedMotifNames() )) {
            inputErrors.addToLog("motifListIsEmpty"); //1
        }


        if (status === "fileIsTooBig") {
            inputErrors.addToLog("fileIsTooBig"); //2
            inputErrors.showErrors();
            return false;
        }


        var sequences = inputParsing.parseInput(inputString);//4

        var inputParsedInto,
            checkValue = inputErrors.checkSequenceCharacterError();
        if (checkValue !== false) {
            inputParsedInto = inputParsing.assembleParsedValues(sequences, checkValue.rawSequence);
        } else {
            inputParsedInto = inputParsing.assembleParsedValues(sequences, "");
        }
        $("#manual-seq-input").find("textarea").val(inputParsedInto);

        if (sequences.length === 0) {
            inputErrors.addToLog("sequenceListIsEmpty"); //3
            inputErrors.showErrors();
            return false;
        }



        if (replaceCurrent === true) {
            var scrollPosition = $("html").scrollTop();
            sequenceLibrary.clear();
        }
        var libraryIds = $.map(sequences, sequenceLibrary.addTab);
        $.map(libraryIds, resultTabs.addIdToResult); //5
        if (replaceCurrent === true) {
            $("html").scrollTop(scrollPosition);
        }

        inputErrors.showErrors(status);

        handleEvent();


        if (comparisonMode.getCurrentMode() === "Multiply") {
            resultTabs.updateWidth("setToMaximum");
        }

        return inputErrors.checkIfNoImportantErrors();
    };


    var buildExternalMotifPickerComponent = function () {
        $('#motif-list').on('click', '.motif-title', function (event) {
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

            var hocomocoRef = "http://hocomoco11.autosome.ru/motif/" + motifName,
                titleWithRef = '<a href=' + hocomocoRef + ' class=hocomoco-info target=_blank>' +
                    motifName + '</a>';
            $motifTitle.html(titleWithRef);

            motifPicker.addChosenMotifToSet(motifName);
            motifLibrary.addUnit(motifName);

            $motifContainer.appendTo('#motif-list-selected');
            var geneName = $motifContainer.find(".third").html(),
                family = $motifContainer.find(".second").html(),
                description = geneName + " - " + family,
                $description = $("<div class='description'>" + description + "</div>");

            $motifContainer.find(".third, .second").remove();
            $motifContainer.append($description);

            motifSearch.applySearch();
        });


        $('#motif-list-selected').on('click', '.close', function (event) {
            var $motifContainer = $(event.target).parent(),
                $motifTitle = $(event.target).siblings(".motif-title"), motifName = $motifTitle.text();

            $(event.target).qtip("hide");///hiding tooltip

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
        $('body').click(function (event) {
            var $target = $(event.target);

            if (
                (($target.parents(".search-container").length === 0) && (!$target.hasClass("feature")))
                || ($target.parents(".collection-dialog, .collection-dialog").length !== 0)
            )
            {
                $(".suggestions").hide();
            }

            if (!$target.closest('.collection-dialog, .collection-settings').length) {
                if ($('.collection-dialog').is(":visible")) {
                    $('.collection-dialog').addClass("hidden");
                }
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


    return {
        buildUI: buildUI,
        resizeCallback: resizeCallback
    };
}());