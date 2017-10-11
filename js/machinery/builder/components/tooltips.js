var tooltips = (function () {
    var _fileName = "tooltips",
        _content = {};

    var create = function () {
        setContent();
        setEventListener();
    };


    var setContent = function () {
        _content = {
            "lock": "Lock scrolling of this tab",
            "copy-tab": "Copy markup",
            "close": "Remove",
            "input-method": "Shows if current sequences will be replaced with input"
        }
    };

    var getContent = function () {
        return _content;
    };

    var getContentFor = function ($target) {
        var content = getContent(),
            targetClass = getClassFrom($target);


        if (content.hasOwnProperty(targetClass) && content[targetClass] !== undefined) {
            return content[targetClass];
        } else {
            return undefined;
        }
    };


    var getClassFrom = function ($target) {
        var keys = Object.keys(_content);

        //event.currentTarget must be used but it is not compatible with Safari
        // younger than 10.0 (current version is 11.0)
        for (var i = 0; i < keys.length; i++) {
            if (($target.parents("." + keys[i]).length !== 0) ||
                ($target.hasClass(keys[i]))) {
                return keys[i];
            }
        }
        return undefined;
    };


    var setEventListener = function () {
        $(document).on('mouseover', '.tab-result .tooltip, .close, .input-method', function (event) {
            // Bind the qTip within the event handler
            console.log($(event.target));
            var content = getContentFor($(event.target));

            $(this).qtip({
                overwrite: false, // Make sure the tooltip won't be overridden once created
                content: content,
                position: {
                    my: 'top left',  // Position my top left...
                    at: 'bottom center' // at the bottom right of...
                },
                style: {
                    classes: 'qtip-tipsy'
                },
                show: {
                    delay: 700,
                    event: event.type, // Use the same show event as the one that triggered the event handler
                    ready: true // Show the tooltip as soon as it's bound, vital so it shows up the first time you hover!
                },
                hide: {
                    delay: 100
                }
            }, event); // Pass through our original event to qTip
        })

        // Store our title attribute in 'oldtitle' attribute instead
            .each(function (i) {
                $(this).attr('oldtitle', $.attr(this, 'title'));
                //this.removeAttribute('title');
            });
    };


    return {
        create: create
    }
}());