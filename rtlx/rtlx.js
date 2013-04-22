(function($) {
    "use strict";
    var originalCss, originalAnimate;

    $(function() {
        // IE8 doesn't support 4-value background positions, so we have to measure and flip in realtime using javascript.
        if($.browser.msie && ($.browser.version.indexOf("8.") == 0)) {
            setTimeout(function(){ flipBg($("*")); }, 200);
        }

        // Hook jQuery's css function
        originalCss = $.fn.css;
        $.fn.css = cssOverride;
        originalAnimate = $.fn.animate;
        $.fn.animate = animateOverride;
    });

    function flipBg(sel) {
        var images = {};

        sel.each(function() {
            var $e = $(this);
            if(this.currentStyle) {
                var bpx = this.currentStyle.backgroundPositionX; // IE-only, but that's ok
                if(bpx.match(/px$/)) {
                    // http://stackoverflow.com/questions/3098404/get-the-size-of-a-css-background-image-using-javascript
                    var x = parseFloat(bpx.substr(0, bpx.length-2));
                    if(x === 0) {
                        $e.css("background-position-x", "100%");
                    } else {
                        if(!isNaN(x)) {
                            var url = $e.css("background-image").replace(/url\((['"]?)(.*?)\1\)/gi, '$2').split(',')[0];
                            if(!images[url]) images[url] = [];
                            images[url].push(function(image) {
                                var newx = $e.innerWidth() - image.width - x;
                                $e.css("background-position-x", newx + "px");
                            });
                        }
                    }
                }
            }
        });

        function loadHandler(url, image) {
            return function() {
                var fns = images[url];
                for(var i=0, ii=fns.length; i<ii; i++) fns[i](image);
            };
        }

        for(var url in images) {
            var image = new Image();
            image.onload = loadHandler(url, image);
            image.src = url;
        }
    }

    function swaplr(s) {
        return String(s).replace(/[Ll]eft|[Rr]ight/g,
                                 function(match) {
                                     switch(match) {
                                     case "Left": return "Right";
                                     case "left": return "right";
                                     case "Right": return "Left";
                                     case "right": return "left";
                                     default: return match;
                                     }
                                 });
    }

    function flipPropName(name) {
        var ret = swaplr(name);
        console.log("name: ", name, ret);
        return ret;
    }

    function flipPropValue(value) {
        var ret = swaplr(value);
        console.log("value: ", value, ret);
        return ret;
    }

    function flipCssObject(obj) {
        var ret = {};
        for(var p in obj) {
            ret[flipPropName(p)] = flipPropValue(obj[p]);
        }
        return ret;
    }

    function cssOverride() {
        if(arguments.length === 2) {
            return originalCss.call(this, flipPropName(arguments[0]), flipPropValue(arguments[1])); 
        } else if (arguments.length === 1) {
            if(typeof arguments[0] === "object") {
                return originalCss.call(this, flipCssObject(arguments[0]));
            } else {
                return originalCss.call(this, flipPropName(arguments[0]));
            }
        }
        // this shouldn't happen, but if it does - let the original function handle it.
        return originalCss.apply(this, arguments);
    }

    function animateOverride() {
        arguments[0] = flipCssObject(arguments[0]);
        return originalAnimate.apply(this, arguments);
    }
})(jQuery);
