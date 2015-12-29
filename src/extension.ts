import * as vscode from 'vscode'; 
import {spawn, exec} from 'child_process';

function setStatusBarText(what, docType){
    var date=new Date();
    var text=what + ' [' + docType + '] ' + date.toLocaleTimeString();
    vscode.window.setStatusBarMessage(text, 1500);  
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-pandoc" is now active!'); 
    
	var disposable = vscode.commands.registerCommand('pandoc.render', () => {        
        
        var editor = vscode.window.activeTextEditor;
        var fullName = editor.document.fileName;
        
        var path = fullName.split('\\').slice( 0, -1 ).join('\\') + '\\';
        var fileName = fullName.replace(/^.*[\\\/]/, '');
        var fileNameOnly = fileName.split('\.')[0];
                
        var inFile = path + fileName;
        var outExt;
        
        let items: vscode.QuickPickItem[] = [];
        items.push({ label: 'pdf', description: 'Render as pdf document' });
        items.push({ label: 'docx', description: 'Render as word document' });
        items.push({ label: 'html', description: 'Render as html document' });
                                 
        vscode.window.showQuickPick(items).then((qpSelection) => {
            if (!qpSelection) {
                return;
            }
                    
            var outFile = path + fileNameOnly + '.' + qpSelection.label;
            
            setStatusBarText('Generating', qpSelection.label);            
            var child = exec('pandoc ' + inFile + ' -o ' + outFile, function(error, stdout, stderr) {           
                
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
                    exec(outFile);
                }
            });
        });
    });
	
    context.subscriptions.push(disposable);
}