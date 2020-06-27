<template>
  <div class="container">
    <label>{{label}}</label>
    <select v-model="_value">
      <option value="0">{{fields[0]}}</option>
      <option value="1">{{fields[1]}}</option>
    </select>
    
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: { label: String, name: String, value: Number, fields: Array },

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
        this.action_setValue({ name: this.name, value: Number(_value) });
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 350px;
 
}
.container label {
  font-size: 12pt;
  display: block;
  color: #444;
}

.container select {
  width: 240px;
  height: 50px;
  text-align: left;
  font-size: 16pt;

  border: 2px solid #e3e9ee;
}

.container span {
  margin-left: 12px;
  font-size: 40pt;
  color: #444;
}
</style>