# Drupal RTL toolkit

This is an attempt at a *fully* automated RTL (right-to-left) language solution for Drupal 7. It includes ```rtlxgen```, a script which creates RTL CSS and images for an entire site (core, modules and themes), and a module which loads the generated CSS and includes some javascript hacks to convert css set at runtime with jQuery's css() and animate() methods.

#### Installation

*This section is for development machines. Don't do this on your production server.*

Clone this repo:

    git clone git@github.com:yonatan/rtl-toolkit.git

You might want to add ```rtlxgen``` to your executable path, or create a symlink to it from a location already on your path.

    ln -s /full/path/to/your/rtlxgen /usr/local/bin/rtlxgen

Note: don't just copy ```rtlxgen```, it needs to be in the same directory as ```rtlx.Makefile``` and ```cssjanus```.

Make sure you have all the required dependencies; GraphicsMagick, pyhton, GNU make, watch, find and sed. On Debian and Ubuntu do something like:

    sudo apt-get install graphicsmagick python-minimal make procps findutils sed

#### Suggested usage
For each Drupal 7 installation copy the rtlx directory into your modules directory and enable the RTLx module.

When starting to work on a Drupal site, open a new shell and run:

    watch rtlxgen path/to/drupal/root

The [watch][1] utility will run ```rtlxgen``` continuously in the background so whenever you edit a CSS file, add a new module, or update an image the corresponding rtlx files will be automatically generated.

## How it works

#### Stylesheets
A modified version of [CSSJanus][2] is used by ```rtlxgen``` to create RTL stylesheets with inverted properties. These are saved as *original_name*-rtlx.css files. The RTLx Drupal module then uses these to replace both the original stylesheets and Locale's added -rtl.css files when an RTL language is in use.

If you want to exclude some CSS from RTL conversion CSSJanus supports a ```/* @noflip */``` annotation which can be added before a specific rule or property.

#### Images
GraphicsMagick's ```gm convert``` is used by ```rtlxgen``` to create horizontally flipped images for CSS backgrounds. The resulting files have -rtlx added to their name.

#### Javascript
IE8 does not support the [4-value background-position syntax][3], which makes it impossible to flip CSS background positions with unit lengths without knowing the HTML element's dimensions. To work around this limitation the RTLx module includes IE8-specific javascript which measures and flips CSS background-positions after page load. This is not a perfect solution, and things can go wrong if an element's width is changed dynamically.

RTLx javascript also overrides jQuery's ```css()``` and ```animate()``` methods and swaps 'left' and 'right' strings in property names and values. Again, not perfect, but works most of the time for code which uses Drupal's copy of jQuery.

[1]:http://linux.die.net/man/1/watch
[2]:https://code.google.com/p/cssjanus/
[3]:https://developer.mozilla.org/en/docs/CSS/background-position
