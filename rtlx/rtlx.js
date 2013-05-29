(function($) {
    "use strict";
    var originalCss, originalAnimate, originalOffset, originalPosition, originalScrollLeft;

    // Hook jQuery's css function
    originalCss = $.fn.css;
    $.fn.css = cssOverride;
    originalAnimate = $.fn.animate;
    $.fn.animate = animateOverride;
    originalOffset = $.fn.offset;
    $.fn.offset = offsetOverride;
    originalScrollLeft = $.fn.scrollLeft;
    $.fn.scrollLeft = scrollLeftOverride;
    // TODO:
    // originalPosition = $.fn.position;
    // $.fn.position = positionOverride;

    $(function() {
        // IE8 doesn't support 4-value background positions, so we have to measure and flip in realtime using javascript.
        if($.browser.msie && ($.browser.version.indexOf("8.") == 0)) {
            setTimeout(function(){ flipBg($("*")); }, 200);
        }
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
                            var url = $e.css("background-image").replace(/url\((['"]?)(.*?)\1\)/gi, '$2');
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
        if(name != "scrollLeft") return swaplr(name);
        else return name;
    }

    function flipPropValue(val) {
        if(typeof(val) === "string") return swaplr(val);
        else return val;
    }

    function flipCssProperty(p, v) {
        var ret = { p: flipPropName(p) };
        if(p == "scrollLeft") {
            if(typeof(v) === "string") {
                if(v[0] == "+") ret.v = "-" + v.substr(1);
                else if(v[0] == "-") ret.v = "+" + v.substr(1);
                else ret.v = v;
            } else {
                ret.v = v;
            }
        } else {
            ret.v = flipPropValue(v);
        }
        return ret;
    }

    function flipCssObject(obj) {
        var ret = {};
        for(var p in obj) {
            var f = flipCssProperty(p, obj[p]);
            ret[f.p] = f.v;
        }
        return ret;
    }

    function cssOverride() {
        var f;
        if(arguments.length === 2) {
            f = flipCssProperty(arguments[0], arguments[1]);
            return originalCss.call(this, f.p, f.v);
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

    function offsetOverride() {
        // Calling offset() without args should return the element's offset,  calling it with args
        // should set it.
        if(arguments.length == 0) {
            // Return the offset of the right side of the element from the right side of the document.
            var ret = originalOffset.apply(this, arguments);
            // ret.left = $(window).width() - ret.left - this.outerWidth();
            ret.left = $(window).width() - ret.left - this.outerWidth();
            return ret;
        } else {
            // I think that when setting the offset jQuery uses it's (already overidden) css method,
            // so there's nothing we need to do here.
            return originalOffset.apply(this, arguments);
        }
    }

    function scrollLeftOverride() {
        if(arguments.length == 0) return -originalScrollLeft.apply(this, arguments);
        else return originalScrollLeft.apply(this, arguments);
    }

})(jQuery);
