<template>
  <div class="container">
    <label>{{label}}</label>
    <input type="number" v-model="_value" :min="min" :max="max"/>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["label", "unit", "name", "value", "min", "max"],
  methods: {
    ...mapActions(["action_setValue"])
  },
  computed: {
     _value: {
      get() {
        return this.value;
      },
      set(_value) {
        console.log(_value);
        this.action_setValue({ name: this.name, value: _value });
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px 0 20px 40px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: left;
}

.container label {
  text-align: left;
  font-size: 12pt;
  padding: 0 0 2px;
  color: #333;
  
}

.container input {
  width: 250px;
  height: 50px;
  text-align: left;
  font-size: 16pt;
  background: #fff;
  border: none;
  color: #000;
  padding-left: 5px;
 border: 2px solid #e3e9ee;
}
</style>