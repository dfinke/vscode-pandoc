# vscode-pandoc

The vscode-pandoc [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=chrischinchilla.vscode-pandoc) extension lets you render markdown files as a pdf, word document, or html file.

_Thanks to the previous work of [@dfinke](https://github.com/dfinke) on this extension._

## Prerequisites

You need to [**install Pandoc**](http://pandoc.org/installing.html) - a universal document converter.

## Usage

Two ways to run the extension. You need to have a markdown file open.

1. press `F1` on Windows (`shift+cmd+P` on Mac), type `pandoc`, press `Enter`
1. Or - press the key chord `ctrl+K` then `P` (`cmd+K` then `P` on Mac)

Then choose from the list what document type you want to render and press `enter` (you can also type in the box rather than cursor around).

## Releases

* May 10th, 2023
  * Package updates
  * Added build workflows
  * Read me updates
* October 6th, 2020
  * Add ability to specify pandoc binary thanks @feeper
  * Stops rendered document opening automatically thanks @bno93
* April 22nd, 2020
  * Shift to new fork
  * Expose further conversion options
* July 9, 2016
  * Update package.json and launch.json
  * Add PR #11
  * Add output of the error (use OutputChannel and showErrorMessage)
* January 17, 2016
  * Set pandoc options for document types
* January 16, 2016
  * Handling of the path that contains spaces
  * Add the open command (xdg-open) in linux

## **Setting additional pandoc options**

1. choose 'Preference -> UserSettings'
1. Find: pandoc in Default Settings
1. Copy and paste
1. to settings.json

example:

```json
//-------- Pandoc Option Configuration --------

// pandoc .pdf output option template that you would like to use
"pandoc.pdfOptString": "",

// pandoc .docx output option template that you would like to use
"pandoc.docxOptString": "",

// pandoc .html output option template that you would like to use
"pandoc.htmlOptString": "",

// path to the pandoc executable. By default gets from PATH variable
"pandoc.executable": ""
```

* if necessary to set options for each output format.
  * default: `$ pandoc inFile.md -o outFile.{pdf|word|html}`

## Example: Setting for Japanese document

* PDF

  `"pandoc.pdfOptString": "--pdf-engine=lualatex -V documentclass=ltjarticle -V geometry:a4paper -V geometry:margin=2.5cm -V geometry:nohead",`

  * `--pdf-engine=lualatex`: need to create a Japanese PDF
  * `-V documentclass=ltjarticle`: need to create a Japanese PDF
  * `-V geometry:a4paper -V geometry:margin=2.5cm -V geometry:nohead"`: geometory options

* Word(docx)

  `pandoc.docxOptString": "",`
  * It will work even if you do not set the options.

* HTML5

  `"pandoc.htmlOptString": "-s -t html5"`

  * `-s`: produce a standalone document
  * `-t html5`: HTML5 output format

For more information please refer to the [Pandoc User's Guide](http://pandoc.org/README.html).
