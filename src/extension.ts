import * as vscode from 'vscode';
import { spawn, exec } from 'child_process';
import * as path from 'path';

var pandocOutputChannel = vscode.window.createOutputChannel('Pandoc');

function setStatusBarText(what, docType) {
    var date = new Date();
    var text = what + ' [' + docType + '] ' + date.toLocaleTimeString();
    vscode.window.setStatusBarMessage(text, 1500);
}

/**
 * Get the extension configuration
 * @return the current extension configuration
 */
function getConfiguration() {
    return vscode.workspace.getConfiguration('pandoc');
}
/**
 * Get pandoc options for a specific output format
 * @param quickPickLabel output format
 * @return pandoc options from the configuration
 */
function getPandocOptions(quickPickLabel) {
    var pandocOptions, optionKey;

    optionKey = quickPickLabel + 'OptString';
    pandocOptions = getConfiguration().get(optionKey)
    console.log(`${optionKey} = ${pandocOptions}`);
    return pandocOptions;
}
/**
 * Fetch the managed pandoc type from configuration
 * @return array of string
 */
function getPandocTypes() {
    var pandocType = [];
    for (let option in getConfiguration()) {
        // Check if current key is an "OptString" type
        if (option.match(/OptString$/)) {
            pandocType.push(option.replace('OptString', ''));
        }
    }
    return pandocType;
}

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-pandoc" is now active!');

    var disposable = vscode.commands.registerCommand('pandoc.render', () => {

        var editor = vscode.window.activeTextEditor;
        var fullName = path.normalize(editor.document.fileName);
        var filePath = path.dirname(fullName);
        var fileName = path.basename(fullName);
        var fileNameOnly = path.parse(fileName).name;

        let items: vscode.QuickPickItem[] = [];
        // Fetch types from settings and build command list from it
        items = getPandocTypes().map((value) => { return { label: value, description: `Render a ${value} document` } })

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
            var targetExec = 'pandoc' + space + inFile + space + '-o' + space + outFile + space + pandocOptions;
            console.log('debug: exec ' + targetExec);

            var child = exec(targetExec, { cwd: filePath }, function (error, stdout, stderr) {
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
                } else {
                    setStatusBarText('Launching', qpSelection.label);
                    switch (process.platform) {
                        case 'darwin':
                            exec('open ' + outFile);
                            break;
                        case 'linux':
                            exec('xdg-open ' + outFile);
                            break;
                        default:
                            exec(outFile);
                    }
                }
            });
        });
    });

    context.subscriptions.push(disposable);
}