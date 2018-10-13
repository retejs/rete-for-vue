import * as fs from 'fs';
// @ts-ignore
import * as write from 'write';
import { generate } from './file';

async function writeFile(path: string, components: VueComponent[]) {
    if(fs.existsSync(path)) {
        const source = fs.readFileSync(path, "utf8");

        fs.writeFileSync(path, generate(source, components))
    } else {
        await write.promise(path, generate(null, components));
    }
}

export default async function (root : string, payload: Payload) {
    await Promise.all(payload.components.map(async c => {
        const path = `${root}/${payload.folder}${c.path}Index.vue`;

        writeFile(path, c.children);
    }));
}