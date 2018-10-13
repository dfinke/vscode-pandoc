import * as vscode from 'vscode'; 
import {spawn, exec} from 'child_process';
import * as path from 'path';

var pandocOutputChannel = vscode.window.createOutputChannel('Pandoc');

function setStatusBarText(what, docType){
    var date=new Date();
    var text=what + ' [' + docType + '] ' + date.toLocaleTimeString();
    vscode.window.setStatusBarMessage(text, 1500);
}

function getPandocOptions(quickPickLabel) {
    var pandocOptions;
    var pandocConfiguration = vscode.workspace.getConfiguration('pandoc');
    switch (quickPickLabel) {
        case 'pdf':
            if (pandocConfiguration.has('pdfOptString')) {
                pandocOptions = pandocConfiguration.get('pdfOptString');
            }
            else {
                pandocOptions = '';
            }
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'docx':
            if (pandocConfiguration.has('docxOptString')) {
                pandocOptions = pandocConfiguration.get('docxOptString');
            }
            else {
                pandocOptions = '';
            }
            console.log('pdocOptstring = ' + pandocOptions);
            break;
        case 'html':
            if (pandocConfiguration.has('htmlOptString')) {
                pandocOptions = pandocConfiguration.get('htmlOptString');
            }
            else {
                pandocOptions = '';
            }
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
        items.push({ label: 'pdf',  description: 'Render as pdf document'  });
        items.push({ label: 'docx', description: 'Render as word document' });
        items.push({ label: 'html', description: 'Render as html document' });

        vscode.window.showQuickPick(items).then((qpSelection) => {
            if (!qpSelection) {
                return;
            }
            
            var inFile = path.join(filePath, fileName).replace(/(^.*$)/gm,"\"" + "$1" + "\"");
            var outFile = (path.join(filePath, fileNameOnly) + '.' + qpSelection.label).replace(/(^.*$)/gm,"\"" + "$1" + "\"");
            
            setStatusBarText('Generating', qpSelection.label);
            
            var pandocOptions = getPandocOptions(qpSelection.label);

            if (pandocOptions === undefined)
                pandocOptions = ''
            
            // debug
            console.log('debug: outFile = ' + inFile);
            console.log('debug: inFile = ' + outFile);
            console.log('debug: pandoc ' + inFile + ' -o ' + outFile + pandocOptions);
            
            var space = '\x20';            
            var targetExec = 'pandoc' + space + inFile + space + '-o' + space + outFile + space + pandocOptions;
            console.log('debug: exec ' + targetExec);
            
            var child = exec(targetExec, { cwd: filePath }, function(error, stdout, stderr) {
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
                    switch(process.platform) {
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