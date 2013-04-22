# Drupal RTL toolkit

Fully automated RTL (right-to-left) language support.

#### Installation

Clone this repo:
```bash
$ git clone git@github.com:yonatan/rtl-toolkit.git
```

Make sure that the ```rtlxgen``` script is in your executable path, either by changing your $PATH environment variable, or by creating a symlink (*not* a copy - ```rtlxgen``` and ```rtlx.Makefile``` must reside in the same directory):

```bash
$ ln -s /full/path/to/your/rtlxgen /usr/local/rtlxgen
```

Make sure you have all the required dependencies; ImageMagick, pyhton, GNU make, watch, find and sed. On Debian and Ubuntu do something like:

```bash
$ sudo apt-get install imagemagick python-minimal make procps findutils sed
```

For each Drupal 7 installation copy the rtlx directory into your modules directory, and enable the RTLx module.

#### Suggested usage

```bash
$ watch rtlxgen path/to/drupal/root
```

The [watch][1] utility will run ```rtlxgen``` continuously in the background so whenever you edit a CSS file, add a new module, or update an image the corresponding rtlx files will be automatically generated.





[1]: http://linux.die.net/man/1/watch
