import * as vscode from 'vscode'; 
import {spawn, exec} from 'child_process';
import * as path from 'path';

function setStatusBarText(what, docType){
    var date=new Date();
    var text=what + ' [' + docType + '] ' + date.toLocaleTimeString();
    vscode.window.setStatusBarMessage(text, 1500);
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
            var inFile = path.join(filePath, fileName).replace(/ /g, '\\ ');
            var outFile = path.join(filePath, fileNameOnly).replace(/ /g, '\\ ') + '.' + qpSelection.label;
            
            // Stores the contribution objects in package.json
            var pdocOptions;
            
            switch (qpSelection.label) {
              case 'pdf':
                pdocOptions = vscode.workspace.getConfiguration('pandoc').get('pdfOptString');
                console.log('pdocOptstring = ' + pdocOptions);
                break;
              case 'docx':
                pdocOptions = vscode.workspace.getConfiguration('pandoc').get('docxOptString');
                console.log('pdocOptstring = ' + pdocOptions);
                break;
              case 'html':
                pdocOptions = vscode.workspace.getConfiguration('pandoc').get('htmlOptString');
                console.log('pdocOptstring = ' + pdocOptions);
                break;
            }
            
            setStatusBarText('Generating', qpSelection.label);
            
            // debug
            console.log('debug: outFile = ' + inFile);
            console.log('debug: inFile = ' + outFile);
            console.log('debug: pandoc ' + inFile + ' -o ' + outFile + pdocOptions);
            var child = exec('pandoc' + '\x20' + inFile + '\x20' + '-o' + '\x20' + outFile + '\x20' + pdocOptions, function(error, stdout, stderr) {
                
                if (stdout !== null) {
                    console.log(stdout.toString());
                }
                
                if (stderr !== null) {
                    console.log(stderr.toString());
                }
                
                if (error !== null) {
                    console.log('exec error: ' + error);
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