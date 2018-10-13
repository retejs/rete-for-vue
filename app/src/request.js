const vscode = acquireVsCodeApi();

function method(type, payload) {
    console.log({ type, payload });
    vscode.postMessage({
        type,
        payload
    })
}

export default {
    generate(payload) { method('GENERATE', payload) },
    reverse(payload) { method('REVERSE', payload) }
}