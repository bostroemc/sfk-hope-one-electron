<template>
  <div class="container">
    <label >{{label}}</label>
    <input  type="text" v-model="_value" readonly value="undefined" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["label", "name", "value"],
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
  padding: 15px 0 0 30px;
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
  text-align: left;
  font-size: 12pt;
  background: none;
  border: none;
  color: red;
  padding: 20px 0;
 
}
</style>