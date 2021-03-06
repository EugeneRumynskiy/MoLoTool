var tooltips = (function () {
    var _fileName = "tooltips",
        _content = {};

    var create = function () {
        setContent();
        setEventListener();

        destroyOnScroll.create();
    };


    var setContent = function () {
        _content = {
            "lock": "Lock scrolling of this tab",
            "copy-tab": "Copy markup",
            "close": "Remove",
            "input-method": inputMethodButton.getTooltip
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
        $(document).on('mouseover', '.tab-result .tooltip,' +
            '.tab-result .close,' +
            '.chosen-motif .close,' +
            ' .input-method', function (event) {
            // Bind the qTip within the event handler
            var content = getContentFor($(event.target));

            $(this).qtip({
                overwrite: false, // Make sure the tooltip won't be overridden once created
                content: content,
                position: {
                    my: 'top left',  // Position my top left...
                    at: 'bottom center' // at the bottom right of...
                },
                style: {
                    classes: 'qtip-dark qtip-rounded qtip-shadow customTooltipStyle'
                    //classes: 'qtip-tipsy'
                },
                show: {
                    delay: 500,
                    event: event.type, // Use the same show event as the one that triggered the event handler
                    ready: true // Show the tooltip as soon as it's bound, vital so it shows up the first time you hover!
                },
                hide: {
                    delay: 100,
                    event: "unfocus click"
                }
            }, event); // Pass through our original event to qTip
        })

        // Store our title attribute in 'oldtitle' attribute instead
            .each(function () {
                $(this).attr('oldtitle', $.attr(this, 'title'));
                //this.removeAttribute('title');
            });
    };


    return {
        create: create
    }
}());


var destroyOnScroll = (function() {
    // var supportOffset = window.pageYOffset !== undefined,
    //     lastKnownPos = 0,
    //     ticking = false,
    //     scrollDir, currYPos;


    var destroyTips = function() {
        $('.qtip').qtip('destroy', true)
    };


    var create = function () {
        // window.addEventListener('wheel', function(e) {
        //     currYPos = supportOffset ? window.pageYOffset : document.body.scrollTop;
        //     scrollDir = lastKnownPos > currYPos ? 'up' : 'down';
        //     lastKnownPos = currYPos;
        //
        //     if (!ticking) {
        //         window.requestAnimationFrame(function () {
        //             destroyTips(lastKnownPos, scrollDir);
        //             ticking = false;
        //         });
        //     }
        //     ticking = true;
        // });


        //another version
        $(window).bind('mousewheel DOMMouseScroll', function(){
            destroyTips();
        });
    };



    return {
        create: create
    }
})();