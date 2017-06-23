var uiBuilder = (function () {
    var _fileName = "uiBuilder",
        _eventHandler = undefined;


    var setUIEventHandlerTo = function (eventHandler) {
        _eventHandler = eventHandler;
    };


    var handleEvent = function () {
        _eventHandler();
    };


    var buildUI = function () {
        setUIEventHandlerTo(motifHandler.handleMotifs);

        motifLibrary.create(handleEvent);

        colorPicker.init(handleEvent);

        motifPicker.create();
        buildExternalMotifPickerComponent();

        var table = motifTable.create();
        buildExternalTableComponent(table);

        pSlider.create();
        buildExternalSliderComponent();

        resultContainer.create();
        buildExternalResultContainerComponent();

        fileUploader.create();

        sequenceTabs.create();
        buildExternalTabComponent();
    };


    var buildExternalMotifPickerComponent = function () {
        $('#motif-list').on('click', '.motif-title', function(event){
            event.preventDefault();

            var $motifTitle = $(event.target), motifName = $motifTitle.text(),
                $motifContainer = $motifTitle.parent();

            if (motifPicker.getChosenMotifSet().size == 0) {
                $('#motif-list-selected-cmp').removeClass("empty");
            }

            var $closeButton = $('<a href="#" class="close"></a>');
            $closeButton.insertAfter($motifContainer.children(".motif-title"));

            $motifContainer.addClass('chosen-motif');
            colorPicker.addTo($motifContainer);


            var hocomocoRef = "http://hocomoco.autosome.ru/motif/" + motifName;
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

            if (motifPicker.getChosenMotifSet().size == 0) {
                $('#motif-list-selected-cmp').addClass("empty");
            }

            handleEvent();
        });



        var buttonStates = ["hidden", "full-screen", "flattened"], button;
        for(var i = 0; i < buttonStates.length; i++) {
            button = ".to-" + buttonStates[i] + "-button";

            $(button).on('click', function(event) {
                event.preventDefault();

                var $source = $(this),  $target = $("#" + $source.attr("applyToId")),
                    classToSet = $source.attr("state"),
                    currentClass = motifPicker.getCurrentInterfaceState();

                $target.removeClass(currentClass);
                if (currentClass == classToSet) {
                    //toggle class
                    motifPicker.setCurrentInterfaceState("default");
                    $target.addClass("default");
                } else {
                    //add new class
                    motifPicker.setCurrentInterfaceState(classToSet);
                    $target.addClass(classToSet);
                }
            });
        }


        //search bar usability
        //ToDo bad-bad-bad code
        $('body').click(function(e) {
            var $target = $(e.target);
            console.log("boo");
            if ($target.attr('id') != "search") {
                if (!$target.parent().hasClass("chosen-motif")) {
                    //if motif has this class than it's JUST chosen
                    $(".suggestions").hide();
                } else {
                    if (!$target.hasClass("feature")) {
                        if (($target.closest('.suggestions').length == 0)) {
                            $(".suggestions").hide();
                        }
                    }
                }
            }
        });
    };


    var buildExternalTabComponent = function () {
        var defaultSequence = "AAAGTGCTGCTGAGGCGTAGAGCGTCGGCTGATGCGCTTGACTAGACTAACGTTA";
        sequenceTabs.addTab({"title": "", "sequence": defaultSequence},
            makeCurrent=true);
        sequenceTabs.addTab({"title": "", "sequence": defaultSequence},
            makeCurrent=true);
        sequenceTabs.addTab({"title": "", "sequence": defaultSequence},
            makeCurrent=true);



        $("#add-tab-button").on("click", function (event) {
            event.preventDefault();

            sequenceTabs.addTab({"title": "", "sequence": ""});
        });

        $('#sequence-input').on('input', function (event) {
            var newSequence = $(event.target).val();
            sequenceTabs.updateCurrentTabSequence(newSequence);
            handleEvent();
        });
    };



    var buildExternalTableComponent = function (table) {
        var $motifTableTBody = $('#motif-table').find('tbody'),
            $result = $("#result");

        //highlight sequence
        $motifTableTBody
            .on( 'mouse' + 'enter', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData["Start Position"], finish = rowData["Finish Position"],
                        segment,
                        firstID = start,
                        lastID;

                    while (start <= finish) {
                        segment = $result.children('[start=' + start + ']');
                        segment.addClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('start')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).addClass("first");
                    $('#' + lastID).addClass("last");
                }
            });

        $motifTableTBody
            .on( 'mouse' + 'leave', 'td', function () {
                var rowData = table.row( this ).data();
                if (rowData  != undefined){
                    var start = rowData["Start Position"], finish = rowData["Finish Position"],
                        segment,
                        firstID = start,
                        lastID;

                    while (start <= finish) {
                        segment = $result.children('[start=' + start + ']');
                        segment.removeClass("highlighted");
                        if ((finish - start + 1) == segment.text().length) {
                            break
                        } else {
                            start = segment.next().attr('start')
                        }
                    }
                    lastID = start;

                    $('#' + firstID).removeClass("first");
                    $('#' + lastID).removeClass("last");
                }
            });
    };


    var buildExternalSliderComponent = function () {
        pSlider.setEventHandlerTo(handleEvent);
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
