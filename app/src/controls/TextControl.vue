<template lang="pug">
input(
  type="text"
  :readonly="readonly"
  :value="value"
  @input="change($event)"
)
</template>

<script>
export default {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
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
</script>


<style lang="sass" scoped>

</style>
