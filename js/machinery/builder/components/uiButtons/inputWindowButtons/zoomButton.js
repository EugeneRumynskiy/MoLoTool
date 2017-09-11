var zoomButton = (function () {
    var $button,
        $target,

        getSettingsFor = {
            "default":   {"title":"Font size: ", "zoomIn": "zoom_in", "zoomOut": "zoom_out"},
            "threshold": ""
        },
        defaultFontSize,
        lineHeightConst = 1.6;

    var getNewFontSize = function (deltaSize) {
        var newFontSize = calculateNewFontSize(deltaSize);
        return cutWithThresholds(newFontSize);
    };

    var calculateNewFontSize = function (deltaSize) {
        return parseFloat($target.css("font-size")) + parseFloat(deltaSize) + "px";
    };

    var cutWithThresholds = function (fontSize) {
        var value = parseFloat(fontSize),
            top = getSettingsFor.threshold.top,
            bottom = getSettingsFor.threshold.bottom;
        if (value > top) {
            value = top;
        } else if (value < bottom) {
            value = bottom;
        }

        return value + "px";
    };

    var getLineHeight = function (fontSize) {
        return parseFloat(fontSize) * lineHeightConst + "px";
    };

    var zoom = function (eventType) {
        var newFontSize = (eventType === "zoom_in") ? getNewFontSize("1px") : getNewFontSize("-1px");
        $target.css({"font-size": newFontSize, "line-height": getLineHeight(newFontSize)});

        resultTabs.updateMarginForCurrentTab();

        $button
            .find("span")
            .empty()
            .html(getSettingsFor.default.title + newFontSize);
    };

    var init = function (defaultFontSizeToSet, thresholds) {
        $button = $("#manual-seq-input").find(".zoom-button");
        $target = $("#result-sequences").add($("#manual-seq-input").find("textarea"));
        getSettingsFor["threshold"] = thresholds;
        defaultFontSize = cutWithThresholds(defaultFontSizeToSet);

        $target.css({"font-size": defaultFontSize, "line-height": getLineHeight(defaultFontSize)});
        resultTabs.updateMarginForCurrentTab();

        var content =  "<span class=\"icon icon-medium\">"+ getSettingsFor.default.title + defaultFontSize + "</span>" +
            "<i class=\"material-icons md-dark\">" + getSettingsFor.default.zoomIn + "</i>\n" +
            "<i class=\"material-icons md-dark\">" + getSettingsFor.default.zoomOut + "</i>\n";

        $button
            .empty()
            .html(content)
            .on('click', function(event) {
                event.preventDefault();

                var eventType = $(event.target).html();
                if (eventType === "zoom_in" || eventType === "zoom_out") {
                    zoom(eventType);
                }
            });
    };

    var reset = function () {
        $target.css({"font-size": defaultFontSize, "line-height": getLineHeight(defaultFontSize)});

        resultTabs.updateMarginForCurrentTab();

        $button
            .find("span")
            .empty()
            .html(getSettingsFor.default.title + defaultFontSize);
    };

    return {
        init: init,
        reset: reset
    }
}());
