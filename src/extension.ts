import * as vscode from 'vscode';
import { spawn, exec } from 'child_process';
import * as path from 'path';

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

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vscode-pandoc" is now active!');

    var disposable = vscode.commands.registerCommand('pandoc.render', () => {

        var editor = vscode.window.activeTextEditor;
        var fullName = path.normalize(editor.document.fileName);
        var filePath = path.dirname(fullName);
        var fileName = path.basename(fullName);
        var fileNameOnly = path.parse(fileName).name;

        let items: vscode.QuickPickItem[] = [];
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