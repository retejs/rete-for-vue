'use strict';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import generate from './vue/generate';
import reverse from './vue/reverse';

function createViewPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel('rete4vue', "Rete for Vue", vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
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

    switch (msg.type) {
        case 'GENERATE': 
            try {
                await generate(root, msg.payload);
                vscode.window.showInformationMessage(`Files have been written to ${root}/rete4vue folder`);
            } catch (e) {
                vscode.window.showErrorMessage(e.message);
            }
            break;
        case 'REVERSE':
            try {
                await reverse(root, msg.payload);
                vscode.window.showInformationMessage(`Files have been written to ${root}/rete4vue folder`);
            } catch (e) {
                vscode.window.showErrorMessage(e.message);
            }
        break;
    }
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