'use strict';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {

        const panel = vscode.window.createWebviewPanel('catCoding', "Cat Coding", vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'app', 'dist'))
            ]
         });
        
        const htmlPath: vscode.Uri = vscode.Uri.file(
            path.join(context.extensionPath, 'app', 'dist', 'index.html')
        );
        const scriptPath: vscode.Uri = vscode.Uri.file(
            path.join(context.extensionPath, 'app', 'dist', 'main.js')
        );
        const scriptSrc = scriptPath.with({ scheme: 'vscode-resource' });

        panel.webview.html = fs.readFileSync(htmlPath.fsPath, 'utf8')
            .replace('main.js', scriptSrc.toString());

        panel.webview.onDidReceiveMessage(console.log);
    });

    context.subscriptions.push(disposable);
}


export function deactivate() {
}