var clipboardCopy = (function () {
    var _fileName = "clipboardCopy",
        clipboard;

    var create = function () {
        clipboard = new Clipboard('.copy-tab', {
            target: function(trigger) {
                var tabId = trigger.getAttribute("data-tab");
                return $(".tab-result-sequence[data-tab=" + tabId + "]").get(0);
            }
        });

        clipboard.on('success', function(e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

            setTimeout(function () {
                e.clearSelection();
            }, 150);
        });
    };

    return {
        create: create
    };
} ());
