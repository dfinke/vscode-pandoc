/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activate: () => (/* binding */ activate)
/* harmony export */ });
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vscode */ "vscode");
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vscode__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! child_process */ "child_process");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);



var pandocOutputChannel = vscode__WEBPACK_IMPORTED_MODULE_0__.window.createOutputChannel('Pandoc');
function setStatusBarText(what, docType) {
    var date = new Date();
    var text = what + ' [' + docType + '] ' + date.toLocaleTimeString();
    vscode__WEBPACK_IMPORTED_MODULE_0__.window.setStatusBarMessage(text, 1500);
}
function getPandocOptions(quickPickLabel) {
    var pandocOptions;
    switch (quickPickLabel) {
        case 'pdf':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('pdfOptString');
            break;
        case 'docx':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('docxOptString');
            break;
        case 'html':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('htmlOptString');
            break;
        case 'asciidoc':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('asciidocOptString');
            break;
        case 'docbook':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('docbookOptString');
            break;
        case 'epub':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('epubOptString');
            break;
        case 'rst':
            pandocOptions = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('rstOptString');
            break;
    }
    return pandocOptions;
}
function openDocument(outFile) {
    switch (process.platform) {
        case 'darwin':
            (0,child_process__WEBPACK_IMPORTED_MODULE_1__.exec)('open ' + outFile);
            break;
        case 'linux':
            (0,child_process__WEBPACK_IMPORTED_MODULE_1__.exec)('xdg-open ' + outFile);
            break;
        default:
            (0,child_process__WEBPACK_IMPORTED_MODULE_1__.exec)(outFile);
    }
}
function getPandocExecutablePath() {
    // By default pandoc executable should be in the PATH environment variable.
    var pandocExecutablePath;
    console.log(vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('executable'));
    if (vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').has('executable') &&
        vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('executable') !== '') {
        pandocExecutablePath = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('executable');
    }
    return pandocExecutablePath;
}
function activate(context) {
    var disposable = vscode__WEBPACK_IMPORTED_MODULE_0__.commands.registerCommand('pandoc.render', () => {
        const editor = vscode__WEBPACK_IMPORTED_MODULE_0__.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let fullName = path__WEBPACK_IMPORTED_MODULE_2__.normalize(editor.document.fileName);
        var filePath = path__WEBPACK_IMPORTED_MODULE_2__.dirname(fullName);
        var fileName = path__WEBPACK_IMPORTED_MODULE_2__.basename(fullName);
        var fileNameOnly = path__WEBPACK_IMPORTED_MODULE_2__.parse(fileName).name;
        let items = [];
        items.push({ label: 'pdf', description: 'Render as pdf document' });
        items.push({ label: 'docx', description: 'Render as word document' });
        items.push({ label: 'html', description: 'Render as html document' });
        items.push({ label: 'asciidoc', description: 'Render as asciidoc document' });
        items.push({ label: 'docbook', description: 'Render as docbook document' });
        items.push({ label: 'epub', description: 'Render as epub document' });
        items.push({ label: 'rst', description: 'Render as rst document' });
        vscode__WEBPACK_IMPORTED_MODULE_0__.window.showQuickPick(items).then((qpSelection) => {
            if (!qpSelection) {
                return;
            }
            var inFile = path__WEBPACK_IMPORTED_MODULE_2__.join(filePath, fileName).replace(/(^.*$)/gm, "\"" + "$1" + "\"");
            var outFile = (path__WEBPACK_IMPORTED_MODULE_2__.join(filePath, fileNameOnly) + '.' + qpSelection.label).replace(/(^.*$)/gm, "\"" + "$1" + "\"");
            setStatusBarText('Generating', qpSelection.label);
            var pandocOptions = getPandocOptions(qpSelection.label);
            var pandocExecutablePath = getPandocExecutablePath();
            var useDocker = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('useDocker');
            var targetExec = useDocker
                ? `docker run --rm -v "${filePath}:/data" pandoc/latex:latest "${fileName}" -o "${fileNameOnly}.${qpSelection.label}" ${pandocOptions}`
                : `"${pandocExecutablePath}" ${inFile} -o ${outFile} ${pandocOptions}`;
            var child = (0,child_process__WEBPACK_IMPORTED_MODULE_1__.exec)(targetExec, { cwd: filePath }, function (error, stdout, stderr) {
                if (stdout !== null) {
                    pandocOutputChannel.append(stdout.toString() + '\n');
                }
                if (stderr !== null) {
                    if (stderr !== "") {
                        vscode__WEBPACK_IMPORTED_MODULE_0__.window.showErrorMessage('stderr: ' + stderr.toString());
                        pandocOutputChannel.append('stderr: ' + stderr.toString() + '\n');
                    }
                }
                if (error !== null) {
                    vscode__WEBPACK_IMPORTED_MODULE_0__.window.showErrorMessage('exec error: ' + error);
                    pandocOutputChannel.append('exec error: ' + error + '\n');
                }
                else {
                    var openViewer = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.getConfiguration('pandoc').get('render.openViewer');
                    if (openViewer) {
                        setStatusBarText('Launching', qpSelection.label);
                        openDocument(outFile);
                    }
                }
            });
        });
    });
    context.subscriptions.push(disposable);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;