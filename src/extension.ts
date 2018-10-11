'use strict';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
// @ts-ignore
import * as write from 'write';
import { genVueFile } from './vue/file';

interface Message {
    components: Array<{ name: string, children: Array<any>, path: string }>;
}

function createViewPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel('rete4vue', "Rete for Vue", vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'app', 'dist'))
        ]
    });

    return panel;
}


async function onDidReceiveMessage(msg: Message) {
   let root = vscode.workspace.rootPath;

    if(!root) {
        return vscode.window.showErrorMessage('Working folder isn\'t open');
    }
    if (!msg.components.length) { 
       return;
    }
   
    await Promise.all(msg.components.map(async c => {
        let path = root+'/rete2vue'+c.path+'Index.vue';
        await write.promise(path, genVueFile(c.children));

        console.log(`File wrote ${path}`);
    }));

    vscode.window.showInformationMessage(`Files have been written to ${root}/rete4vue folder`);
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.rete4vue', () => {

        const panel = createViewPanel(context);
        const htmlPath: vscode.Uri = vscode.Uri.file(
            path.join(context.extensionPath, 'app', 'dist', 'index.html')
        );
        const scriptPath: vscode.Uri = vscode.Uri.file(
            path.join(context.extensionPath, 'app', 'dist', 'main.js')
        );
        const scriptSrc = scriptPath.with({ scheme: 'vscode-resource' });

        panel.webview.html = fs.readFileSync(htmlPath.fsPath, 'utf8')
             .replace('main.js', scriptSrc.toString());

        panel.webview.onDidReceiveMessage(onDidReceiveMessage);
    }));
}


export function deactivate() {
}