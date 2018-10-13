import createEditor from './editor';
import Req from './request';

let input = document.querySelector("#source")
let components = '';

document.querySelector("#reverse-button").addEventListener('click', () => {
    Req.reverse({ components, folder: input.value });
});
document.querySelector("#generate-button").addEventListener('click', () => {
    Req.generate({ components, folder: input.value });
});

createEditor(document.querySelector("#nodeEditor"), args => {
    components = args.components;
});