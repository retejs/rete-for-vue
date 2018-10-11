function genImports(imports: any[]){
    return imports.map((i: any) => {
        let folders = i.path.split('/');
        let folder = folders[folders.length - 2];
    
        return `import ${i.name} from './${folder}';`;
    }).join('')
}

function genComponents(imports: any[]) {
    return imports.map((i: any) => i.name).join(',')
}

export function genVueFile(imports: any[]) {
    const imp = genImports(imports);
    const comps = genComponents(imports);

    return `
<template>

</template>

<script>
${imp?`${imp}

`:''}
export default {
    ${comps?`components: {
        ${comps}
    }`:''}
}
</script>`;
}