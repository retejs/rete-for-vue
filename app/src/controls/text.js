import { Control } from 'rete';
import Component from './TextControl.vue';

export class TextControl extends Control {

    constructor(emitter, key, readonly) {
        super(key);
        this.component = Component;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}