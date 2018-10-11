import { Component, Output } from 'rete';
import Sockets from '../sockets';

export class AppComponent extends Component {

    constructor() {
        super("App");
    }

    builder(node) {
        var out1 = new Output('component', "Vue component", Sockets.vue);

        return node
            .addOutput(out1);
    }

    worker(node, inputs, outputs, args) {
        const name = 'App';

        outputs.component = { name, path: '/', children: [] }

        args.components.push(outputs.component);
    }
}