import Rete from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import { AppComponent } from './components/app';
import { VueComponent } from './components/vue';

const vscode = acquireVsCodeApi();


var container = document.getElementById("nodeEditor");
var editor = new Rete.NodeEditor("demo@0.1.0", container);

editor.use(ConnectionPlugin);
editor.use(VueRenderPlugin);
editor.use(ContextMenuPlugin);

var engine = new Rete.Engine("demo@0.1.0");

[new AppComponent(), new VueComponent()].map(c => {
    editor.register(c);
    engine.register(c);
});


editor.on("process connectioncreated connectionremoved nodecreated noderemoved", async () => {
    let args = { components: [] };
    await engine.abort();
    await engine.process(editor.toJSON(), null, args);
    vscode.postMessage(args)
    //console.log(await CodePlugin.generate(engine, editor.toJSON()))
});

editor.view.resize();


editor.fromJSON({"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{},"inputs":{},"outputs":{"component":{"connections":[{"node":3,"input":"component","data":{}},{"node":4,"input":"component","data":{}}]}},"position":[-660.5,-31],"name":"App"},"3":{"id":3,"data":{"name":"Header"},"inputs":{"component":{"connections":[{"node":1,"output":"component","data":{}}]}},"outputs":{"component":{"connections":[{"node":5,"input":"component","data":{}},{"node":6,"input":"component","data":{}}]}},"position":[-270.5,-185],"name":"Vue"},"4":{"id":4,"data":{"name":"Footer"},"inputs":{"component":{"connections":[{"node":1,"output":"component","data":{}}]}},"outputs":{"component":{"connections":[]}},"position":[-205.5,48],"name":"Vue"},"5":{"id":5,"data":{"name":"Menu"},"inputs":{"component":{"connections":[{"node":3,"output":"component","data":{}}]}},"outputs":{"component":{"connections":[]}},"position":[58.5,-138],"name":"Vue"},"6":{"id":6,"data":{"name":"Logo"},"inputs":{"component":{"connections":[{"node":3,"output":"component","data":{}}]}},"outputs":{"component":{"connections":[]}},"position":[47.5,-329],"name":"Vue"}}})
.then(() => {
    AreaPlugin.zoomAt(editor);
});