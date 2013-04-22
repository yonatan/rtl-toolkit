# Drupal RTL toolkit

Fully automated RTL (right-to-left) language support for Drupal 7.

#### Installation

Clone this repo:
```bash
$ git clone git@github.com:yonatan/rtl-toolkit.git
```

Make sure that the ```rtlxgen``` script is in your executable path, either by changing your $PATH environment variable, or by creating a symlink to it.

Note: don't just copy ```rtlxgen```, it needs to be in the same directory as ```rtlx.Makefile``` and ```cssjanus```.

```bash
$ ln -s /full/path/to/your/rtlxgen /usr/local/bin/rtlxgen
```

Make sure you have all the required dependencies; ImageMagick, pyhton, GNU make, watch, find and sed. On Debian and Ubuntu do something like:

```bash
$ sudo apt-get install imagemagick python-minimal make procps findutils sed
```

For each Drupal 7 installation copy the rtlx directory into your modules directory and enable the RTLx module.

#### Suggested usage

```bash
$ watch rtlxgen path/to/drupal/root
```

The [watch][1] utility will run ```rtlxgen``` continuously in the background so whenever you edit a CSS file, add a new module, or update an image the corresponding rtlx files will be automatically generated.

## How it works

#### Stylesheets
A modified version of [CSSJanus][2] is used by ```rtlxgen``` to create RTL stylesheets with inverted properties. These are saved as *original_name*-rtlx.css files. The RTLx Drupal module then uses these to replace both the original stylesheets and Locale's added -rtl.css files when an RTL language is in use.

#### Images
[ImageMagick][3]'s ```convert``` is used by ```rtlxgen``` to create horizontally flipped images for CSS backgrounds. They are saved as *original_name*-rtlx.*ext* files.

#### Javascript
IE8 does not support the [4-value background-position format][4], which makes it impossible to flip CSS background positions with unit lengths without knowing the HTML element's dimensions. To work around this limitation the RTLx module includes IE8-specific javascript which measures and flips CSS background-positions after page load. This is not a perfect solution, and things can go wrong if an element's width is changed dynamically.

RTLx javascript also overrides jQuery's css() and animate() methods and swaps 'left' and 'right' strings in property names and values. Again, not perfect, but works most of the time for code which uses Drupal's copy of jQuery.


[1]:http://linux.die.net/man/1/watch
[2]:https://code.google.com/p/cssjanus/
[3]:http://www.imagemagick.org/
[4]:https://developer.mozilla.org/en/docs/CSS/background-position
