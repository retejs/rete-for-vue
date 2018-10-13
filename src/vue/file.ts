const genDefault = () : string => `<script>
export default {
  components: {
  }
}
</script>`;

function genImports(components: VueComponent[]) {
    return components.map((i: any) => {
        let folders = i.path.split('/');
        let folder = folders[folders.length - 2];
    
        return `import ${i.name} from './${folder}';`;
    }).join('\n');
}

function genComponents(components: VueComponent[]) {
    return components.map((i: any) => i.name+',').join('');
}

function syncScript(source: string, components: VueComponent[]): string {
    const imp = genImports(components);
    const comps = genComponents(components);

    return imp+source.replace('components: {',
    `components: {${comps}`); // need more stable replacing
}

function syncComponents(source: string, components: VueComponent[]) {
 
    const regexp = new RegExp('((.|\n)*<script.*?>\n?)((.|\n)*)(<\/script>(.|\n)*)', 'g');
    const match = regexp.exec(source);

    if(!match) { throw new Error('No match'); }

    return match[1]+syncScript(match[3], components)+match[5];
}

export function generate(source: string | null, components: VueComponent[]) {
    return syncComponents(source || genDefault(), components);
}
