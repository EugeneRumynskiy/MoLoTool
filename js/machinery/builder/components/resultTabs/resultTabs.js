/**
 * Created by swm on 27.06.17.
 */
var resultTabs = (function () {
    var _fileName = "resultTabs",

        _libraryIdCheck,
        _libraryIdDelete;


    var create = function (tabIdRange, libraryIdCheck, libraryIdDelete) {
        resultTabsStates.create(tabIdRange);

        _libraryIdCheck = libraryIdCheck;
        _libraryIdDelete= libraryIdDelete;


        comparisonMode.create("Multiply");
        digitGuidance.create(10000);

        clipboardCopy.create();

        if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
            $("#result-cmp").addClass("empty");
        }
    };


    var getCurrentMode = function () {
        return comparisonMode.getCurrentMode();
    };//n


    var getIdsToHandle = function () {
        if (getCurrentMode() === "Single") {
            return getCurrentTabId();
        } else {
            return resultTabsStates.getOpenedIds();
        }
    };//n


    var getCurrentTabId = function () {
        if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
            return []
        }

        var $currentTab = $(".tab-result.current-tab"),
            currentTabId = $currentTab.attr("data-tab");

        if (($currentTab.length !== 1) || currentTabId === undefined) {
            errorHandler.logError({"fileName": _fileName, "message": "currentTab Id is undefined"});
            return [];
        } else {
            return [currentTabId];
        }
    };


    ///
    var addIdToResult = function (tabId) {
        if (!_libraryIdCheck(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, id not in sequenceLibrary"});
        } else if (resultTabsStates.idIsOpened(tabId)) {
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be added to result, it's already in result"});
        } else {
            var $targetTab = $("#result-tabs"),
                $resultTab = createResultTab(tabId),

                $targetSequence = $("#result-sequences"),
                $resultSequence = createResultSequence(tabId);


            $targetTab.append($resultTab);
            $targetSequence.append($resultSequence);


            if (getCurrentMode() === "Single") {
                $resultSequence.addClass("hidden full-screen");
                $resultSequence.removeClass("flattened");

                if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
                    setToCurrent(tabId);
                }
            } else if (getCurrentMode() === "Multiply") {
                $resultSequence.addClass("flattened");
            }

            if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
                $("#result-cmp").removeClass("empty");
            }

            resultTabsStates.openId(tabId);
            updateHeight();
        }
    };


    var updateHeight = function () {
        var resultHeight = parseFloat($("#result-tabs").css("height")),
            sliderShift = 5;
        $("#result-sequences").height(resultHeight + sliderShift + "px");
    };//n


    var updateWidth = function (event) {
        var $tabs = $(".tab-result-sequence"),
            $sequences = $tabs.find(".sequence");

        if (event === "reset") {
            $tabs.css({"width": "unset"});


        } else if (event === "setToMaximum")  {
            for (var i = 0, max = -1; i < $sequences.length; i++) {
                if (max < $sequences[i].scrollWidth) {
                    max = $sequences[i].scrollWidth;
                }
            }

            $tabs.css({
                "width": max + 5 + "px"
            });


        } else {
            errorHandler.logError({"fileName": _fileName, "message": "can't update with"});
        }
    };//n


    var createResultTab = function (tabId) {
        var lockMode = (getCurrentMode() === "Single") ? "hidden" : "",

            fullName = sequenceLibrary.getItemById(tabId).seqValues.title,
            tabName = (fullName.length <= 14) ? fullName : fullName.slice(0, 12) + "..",

            $resultTab = $(
                '<div class="tab-result" data-tab=' + tabId + '>' +
                '<a href="#" class="tab-result-name" data-tab=' + tabId + '>' + tabName + '</a>' +
                '<a href="#" class="close"></a>' +
                '<a href="#" class="lock tooltip '+ lockMode + '">' +
                    '<i class="material-icons md-dark">lock_open</i>' +
                '</a>' +
                '<a href="#" class="copy-tab tooltip" data-tab=' + tabId + '>' +
                    '<i class="material-icons md-dark">content_copy</i>' +
                '</a>' +
                '<a href="#" class="show-title" data-tab=' + tabId + '>' + "Show name" + '</a>' +
                '</div>'
            );

        $resultTab.on("click", function(event) {
            event.preventDefault();
            var $target = $(event.target);

            if ($target.hasClass("close")) {
                closeTab(this);
                motifHandler.handleMotifs();
            } else if (getCurrentMode() === "Multiply") {
                if ($target.parent().hasClass("lock")) {
                    comparisonMode.switchLock($target);
                }

                if ($target.hasClass("show-title")) {
                    showTitle($target);
                }
            } else if (getCurrentMode() === "Single") {
                var tabId = $(this).attr('data-tab');
                if (getCurrentTabId()[0] !== tabId) {
                    setToCurrent(tabId);
                    motifHandler.handleMotifs();
                } else {
                    if ($target.hasClass("show-title")) {
                        showTitle($target);
                    }
                }
            }
        });

        return $resultTab;
    };


    var showTitle = function ($target) {
        var tabId = $target.parent().attr("data-tab"),
            $tab = $(".tab-result-sequence[data-tab=" + tabId + "]");

        $target.toggleClass("title-shown");
        if ($target.hasClass("title-shown")) {
            $target.html("Show seq.");
        } else {
            $target.html("Show name");
        }

        $tab.find(".sequence, .title").toggleClass("hidden");
    };


    var createResultSequence = function (tabId) {
        return  $('<div class="tab-result-sequence" data-tab=' + tabId + '>'
            + '<div class="digits"></div>'
            + '<div class="sequence"></div>'
            + '<div class="title hidden"></div>'
            + '</div>');
    };


    var updateTab = function (tabId, content) {
        if (resultTabsStates.idIsOpened(tabId)) {
            var digits = digitGuidance.getDigitsFor(getDigitsLength(tabId)),

                title = "<span class=\"segment\">" +
                    sequenceLibrary.getItemById(tabId).seqValues.title +
                    "</span>",

                $resultLine = $(".tab-result-sequence[data-tab=" + tabId + "]"),

                $sequence = $resultLine.find(".sequence"),
                $digits = $resultLine.find(".digits"),
                $title = $resultLine.find(".title");

            $sequence.empty().html(content);
            $digits.empty().html(digits);
            $title.empty().html(title);

            updateMargin(tabId);
        } else {
            console.log(tabId);
            errorHandler.logError({"fileName": _fileName, "message": "tab cannot be updated it's not opened"});
        }
    };
    
    
    var getDigitsLength = function (tabId) {
        var seqLength = sequenceLibrary.getItemById(tabId).seqValues.sequence.length,
            titleLength = sequenceLibrary.getItemById(tabId).seqValues.title.length;

        return Math.max(seqLength, titleLength);
    };


    var updateMargin = function (tabId) {
        if (getCurrentMode() === "Single") {
            var $resultLine = $(".tab-result-sequence[data-tab=" + tabId + "]"),
                $sequence = $resultLine.find(".sequence"),
                $digits = $resultLine.find(".digits"),
                $title = $resultLine.find(".title"),

                digitsHeight = parseFloat($digits.css("height")),
                shift = parseFloat($digits.css("line-height")) / 2,
                marginTop = digitsHeight - shift;

            $sequence.css("margin-top", "-" + marginTop + "px");
            $title.css("margin-top", "-" + marginTop + "px");
        }
    };


    var updateMarginForCurrentTab = function () {
        if (getCurrentMode() === "Single" ) {
            var currentId = getCurrentTabId();
            if (!$.isEmptyObject(currentId)) {
                updateMargin(currentId);
            }
        }

        else if (getCurrentMode() === "Multiply") {
            updateWidth("reset");
            updateWidth("setToMaximum");
        }
    };


    var closeTab = function (source) {
        var $tab = $(source),
            tabId = $tab.attr('data-tab');

        resultTabsStates.closeId(tabId);

        _libraryIdDelete(tabId);

        $tab.remove();
        $(".tab-result-sequence[data-tab=" + tabId + "]").remove();
        updateHeight();

        if (getCurrentMode() === "Multiply" ) {
            updateWidth("reset");
            updateWidth("setToMaximum");
        } else if (getCurrentMode() === "Single" &&
            !$.isEmptyObject(resultTabsStates.getOpenedIds()) ) {

            var newCurrentTabId = $(".tab-result").first().attr("data-tab");
            setToCurrent(newCurrentTabId);
        }

        if ($.isEmptyObject(resultTabsStates.getOpenedIds())) {
            $("#result-cmp").addClass("empty");
        }
    };


    var setToCurrent = function (tabId) {
        $(".tab-result").removeClass("current-tab");
        $(".tab-result[data-tab=" + tabId + "]").addClass("current-tab");

        $(".tab-result-sequence").addClass("hidden");
        $(".tab-result-sequence[data-tab=" + tabId + "]").removeClass("hidden");
    };


    return {
        create: create,
        addIdToResult: addIdToResult,

        getIdsToHandle: getIdsToHandle,
        getCurrentMode: getCurrentMode,

        updateTab: updateTab,
        updateWidth: updateWidth,
        updateMarginForCurrentTab: updateMarginForCurrentTab
    };
}());