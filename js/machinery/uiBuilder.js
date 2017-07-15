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

        colorPicker.init(handleEvent);

        motifPicker.create();
        buildExternalMotifPickerComponent();

        var table = motifTable.create();
        buildExternalTableComponent(table);

        pSlider.create(handleEvent);

        resultContainer.create();
        buildExternalResultContainerComponent();

        fileUploader.create(fileUploadCallback);

        var tabIdRange = {"min": 1, "max": 10};
        sequenceLibrary.create(tabIdRange);
        resultTabs.create(
            tabIdRange,
            sequenceLibrary.isRecorded,
            sequenceLibrary.deleteTabContentById
        );
        buildExternalTabComponent();
        buildSwitchComparisonModeButton();

        resultSlider.create();

        inputParsing.create();
        //debug
        window.setTimeout(function () {
            var test = inputParsing.inputTest();
            fileUploadCallback(test);
        }, 800);
    };


    var clearSequenceLibrary = function () {
        $(".tab-result .close").trigger("click");
    };


    var fileUploadCallback = function (inputString) {
        clearSequenceLibrary();
        var sequences = inputParsing.parseInput(inputString),
            libraryIds = $.map(sequences, sequenceLibrary.addTab);

        $.map(libraryIds, resultTabs.addIdToResult);
        console.log(libraryIds);
        handleEvent("fileUpload");
    };


    var buildSwitchComparisonModeButton = function () {
        $("#cmp-mode-button").on('click', function(event){
            var newMode = resultTabs.switchComparisonMode();
            $(this).html("Comparison mode - " + newMode);
        });
    };


    var buildExternalMotifPickerComponent = function () {
        $('#motif-list').on('click', '.motif-title', function(event){
            event.preventDefault();

            var $motifTitle = $(event.target), motifName = $motifTitle.text(),
                $motifContainer = $motifTitle.parent();

            if (motifPicker.getChosenMotifSet().size === 0) {
                $('#motif-list-selected-cmp').removeClass("empty");
            }

            var $closeButton = $('<a href="#" class="close"></a>');
            $closeButton.insertAfter($motifContainer.children(".motif-title"));

            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);


            var hocomocoRef = "http://hocomoco.autosome.ru/motif/" + motifName,
                $hocomocoInfo = $('<a href=' + hocomocoRef + ' "class=hocomoco-info target=_blank">HOCOMOCO</a>');
            $hocomocoInfo.insertAfter($motifContainer.children(".full-spectrum"));

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


        motifPickerButtons.create();


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


    var buildExternalTabComponent = function () {
        $(".tab-link .add").on("click", function (event) {
            event.preventDefault();

            var $target = $(event.target);
            $target.siblings(".tab-name").click();
            $target.siblings(".close").css("display", "inherit");
            $target.css("display", "none");

            var currentTabId = $(".current-tab").attr("data-tab");
            resultTabs.addIdToResult(currentTabId);
        });


        $(".tab-link .close").on("click", function (event) {
            event.preventDefault();

            var $target = $(event.target),
                tabId = $target.parent(".tab-link").attr("data-tab");
            resultTabs.closeTab($(".tab-result[data-tab=" + tabId + "]"));

            $target.siblings(".tab-name").click();
            $target.css("display", "none");
            $target.siblings(".add").css("display", "inherit");
        });


        $('#sequence-input').on('input', function (event) {
            var newSequence = $(event.target).val();
            sequenceLibrary.updateCurrentTabSequence(newSequence);
            handleEvent();
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

/**
 * Created by HOME on 12.02.2017.
 */
