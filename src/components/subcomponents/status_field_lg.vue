<template>
  <div class="container">
    <label>{{label}}</label>
    <div class="sub">
      <input type="number" v-model="_value" readonly />
      <span class="unit">{{unit}}</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["label", "unit", "name", "value", "precision"],
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
  padding: 20px 0;
  
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 280px;
}

.container label {
  text-align: left;
  font-size: 26pt;
  color: #444;
}

.sub {
  display: flex;
  align-items:baseline;
}


.sub input {
  text-align: right;
  width: 50%;
  font-size: 42pt;
  border: none;
  padding-left: 20px;
  background: none;
}

.sub span {
  
  font-size: 18pt;
  color: #444;
}
</style>