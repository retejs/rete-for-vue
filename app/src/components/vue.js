import { Component, Input, Output } from 'rete';
import { TextControl } from '../controls/text';
import Sockets from '../sockets';

export class VueComponent extends Component {
    constructor() {
        super("Vue");
    }

    builder(node) {
        var out1 = new Output('component', "Vue component", Sockets.vue);
        var inp1 = new Input('component', "Vue component", Sockets.vue);

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