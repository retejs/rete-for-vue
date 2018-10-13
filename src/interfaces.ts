interface VueComponent {
    name: string;
    children: Array<VueComponent>;
    path: string;
}

interface Payload {
    components: Array<VueComponent>;
    folder: string;
}

interface Message {
    type: string;
    payload: Payload;
}