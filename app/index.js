import Rete from 'rete/build/rete.debug';
import ConnectionPlugin from 'rete-connection-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';

var vueSocket = new Rete.Socket("Vue");

var comp = {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template: '<input type="text" :readonly="readonly" :value="value" @input="change($event)"/>',
    data() {
        return {
            value: 0,
        }
    },
    methods: {
        change(e){
            this.value = e.target.value;
            this.update();
        },
        update() {
            if (this.ikey)
                this.putData(this.ikey, this.value)
            this.emitter.trigger('process');
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
}

class TextControl extends Rete.Control {

    constructor(emitter, key, readonly) {
        super(key);
        this.component = comp;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}

class AppComponent extends Rete.Component {

    constructor() {
        super("App");
    }

    builder(node) {
        var out1 = new Rete.Output('component', "Vue component", vueSocket);

        return node
            .addOutput(out1);
    }

    worker(node, inputs, outputs, args) {
        const name = 'App';

        outputs.component = { name, path: '/', children: [] }

        args.components.push(outputs.component);
    }
}

class VueComponent extends Rete.Component {

    constructor() {
        super("Vue");
    }

    builder(node) {
        var out1 = new Rete.Output('component', "Vue component", vueSocket);
        var inp1 = new Rete.Input('component', "Vue component", vueSocket);

        return node
            .addControl(new TextControl(this.editor, 'name'))
            .addInput(inp1)
            .addOutput(out1);
    }

    worker(node, inputs, outputs, args) {
        const { name } = node.data;
        outputs.component = { name, path: inputs.component[0].path+name+'/', children: [] }

        inputs.component[0].children.push(outputs.component);

        args.components.push(outputs.component);
    }
}

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

const vscode = acquireVsCodeApi();

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