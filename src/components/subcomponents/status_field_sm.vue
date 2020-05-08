<template>
  <div class="container">
    <label>{{label}}</label>
    <input type="number" v-model="_value" readonly value="0" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["label", "unit", "name", "value", 'precision'],
  methods: {
    ...mapActions(["action_setValue"])
  },
  computed: {
    _value: {
      get() {
        return parseFloat(this.value).toFixed(parseInt(this.precision));
      },
      set(_value) {
        console.log(_value);
        this.action_setValue({ name: this.name, value: Number(_value) });
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 15px 0 0 30px;
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.container label {
  font-size: 12pt;
  color: #444;
  text-align: left;
  
}

.container input {
  text-align: left;
  font-size: 12pt;
  background: none;
  border: none;
  color: #00ccff;
  padding: 20px 0;
 
}
</style>