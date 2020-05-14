<template>
  <div class="container">
    <label>{{label}}</label>

    <div class="quantity">
      <button v-on:click="decrement">-</button>
      <input type="number" v-model.lazy="_value" :min="min" :max="max" />
      <button v-on:click="increment">+</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["label", "unit", "name", "value", "min", "max"],
  data: () => ({
      force: 0
    }),
  methods: {
    ...mapActions(["action_setValue"]),

    increment: function(){
        var temp = Number(this._value) + 1;

        this._value = (this.max == undefined) ? (temp) : (Math.min(this.max, temp));
    },
    decrement: function(){
        var temp = Number(this._value) - 1;

        this._value = (this.min == undefined) ? (temp) : (Math.max(this.min, temp));
    }
  },
  computed: {
    _value: {
      get() {
        this.force;
        return this.value;
      },
      set(_value) {
        var temp = Number(_value);

        if (temp < this.min || temp > this.max) {
          this.$notify("Value out of range.");
          this.force = (this.force + 1) %5;
 
        } else {
        console.log(_value);
        this.action_setValue({ name: this.name, value: Number(_value) });
        }
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
  background: none;
 
}

.quantity {
  display: flex;
}

.container label {
  font-size: 12pt;
  
  
  padding: 0 0 2px;
  color: #333;
}

.quantity button {
  font-size: 22pt;
  color: #333;
  background-color: #e3e9ee;
  min-width: 55px;

  border: 2px solid #e3e9ee;
  border-radius: 5px;

  cursor: pointer;
}

.quantity input {
  width: 120px;
  height: 50px;
  text-align: center;
  font-size: 16pt;
  background-color: #fff;
  left: 80px;
  border: 2px solid #e3e9ee;
}

.quantity input:focus {
  outline: 0;
}

.quantity-nav {
  height: 0px;
}



</style>