/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __importStar(__webpack_require__(/*! vscode */ "vscode"));
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const path = __importStar(__webpack_require__(/*! path */ "path"));
var pandocOutputChannel = vscode.window.createOutputChannel('Pandoc');
function setStatusBarText(what, docType) {
    var date = new Date();
    var text = what + ' [' + docType + '] ' + date.toLocaleTimeString();
    vscode.window.setStatusBarMessage(text, 1500);
}
function getPandocOptions(quickPickLabel) {
    var pandocOptions;
    switch (quickPickLabel) {
        case 'pdf':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('pdfOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'docx':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('docxOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'html':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('htmlOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'asciidoc':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('asciidocOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'docbook':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('docbookOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'epub':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('epubOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'rst':
            pandocOptions = vscode.workspace.getConfiguration('pandoc').get('rstOptString');
            console.log('pdocOptstring = ' + pandocOptions);
            break;
    }
    return pandocOptions;
}
function openDocument(outFile) {
    switch (process.platform) {
        case 'darwin':
            (0, child_process_1.exec)('open ' + outFile);
            break;
        case 'linux':
            (0, child_process_1.exec)('xdg-open ' + outFile);
            break;
        default:
            (0, child_process_1.exec)(outFile);
    }
}
function getPandocExecutablePath() {
    // By default pandoc executable should be in the PATH environment variable.
    var pandocExecutablePath;
    console.log(vscode.workspace.getConfiguration('pandoc').get('executable'));
    if (vscode.workspace.getConfiguration('pandoc').has('executable') &&
        vscode.workspace.getConfiguration('pandoc').get('executable') !== '') {
        pandocExecutablePath = vscode.workspace.getConfiguration('pandoc').get('executable');
    }
    return pandocExecutablePath;
}
function activate(context) {
    // console.log('Congratulations, your extension "vscode-pandoc" is now active!');
    var disposable = vscode.commands.registerCommand('pandoc.render', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let fullName = path.normalize(editor.document.fileName);
        var filePath = path.dirname(fullName);
        var fileName = path.basename(fullName);
        var fileNameOnly = path.parse(fileName).name;
        let items = [];
        items.push({ label: 'pdf', description: 'Render as pdf document' });
        items.push({ label: 'docx', description: 'Render as word document' });
        items.push({ label: 'html', description: 'Render as html document' });
        items.push({ label: 'asciidoc', description: 'Render as asciidoc document' });
        items.push({ label: 'docbook', description: 'Render as docbook document' });
        items.push({ label: 'epub', description: 'Render as epub document' });
        items.push({ label: 'rst', description: 'Render as rst document' });
        vscode.window.showQuickPick(items).then((qpSelection) => {
            if (!qpSelection) {
                return;
            }
            var inFile = path.join(filePath, fileName).replace(/(^.*$)/gm, "\"" + "$1" + "\"");
            var outFile = (path.join(filePath, fileNameOnly) + '.' + qpSelection.label).replace(/(^.*$)/gm, "\"" + "$1" + "\"");
            setStatusBarText('Generating', qpSelection.label);
            var pandocOptions = getPandocOptions(qpSelection.label);
            // debug
            console.log('debug: outFile = ' + inFile);
            console.log('debug: inFile = ' + outFile);
            console.log('debug: pandoc ' + inFile + ' -o ' + outFile + pandocOptions);
            var space = '\x20';
            var pandocExecutablePath = getPandocExecutablePath();
            console.log('debug: pandoc executable path = ' + pandocExecutablePath);
            var targetExec = '"' + pandocExecutablePath + '"' + space + inFile + space + '-o' + space + outFile + space + pandocOptions;
            console.log('debug: exec ' + targetExec);
            var child = (0, child_process_1.exec)(targetExec, { cwd: filePath }, function (error, stdout, stderr) {
                if (stdout !== null) {
                    console.log(stdout.toString());
                    pandocOutputChannel.append(stdout.toString() + '\n');
                }
                if (stderr !== null) {
                    console.log(stderr.toString());
                    if (stderr !== "") {
                        vscode.window.showErrorMessage('stderr: ' + stderr.toString());
                        pandocOutputChannel.append('stderr: ' + stderr.toString() + '\n');
                    }
                }
                if (error !== null) {
                    console.log('exec error: ' + error);
                    vscode.window.showErrorMessage('exec error: ' + error);
                    pandocOutputChannel.append('exec error: ' + error + '\n');
                }
                else {
                    var openViewer = vscode.workspace.getConfiguration('pandoc').get('render.openViewer');
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
exports.activate = activate;


/***/ }),

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/extension.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;