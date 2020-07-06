<template>
  <div class="container">
    <label>{{label}}</label>
    <div class="sub">
    <input type="number" v-model="_numerator" readonly value="0" />
    <p>:</p>
     <input type="number" v-model="_denominator" readonly value="0" />
     </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: [
    "label",
    "name_numerator",
    "numerator",
    "name_denominator",
    "denominator"
  ],
  methods: {
    ...mapActions(["action_setValue"])
  },
  computed: {
    _numerator: {
      get() {
        return this.numerator;
      },
      set(_numerator) {
        this.action_setValue({name: this.name_numerator, value: Number(_numerator)
        });
      }
    },
    _denominator: {
      get() {
        return this.denominator;
      },
      set(_denominator) {
        this.action_setValue({name: this.name_denominator, value: Number(_denominator)
        });
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
  width: 200px;
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
.sub p {
  font-size: 42pt;
  margin: 0;
}

.sub input {
  text-align: center;
  width: 60%;
  font-size: 42pt;
  border: none;
  padding-left: 20px;
  background: none;
}
</style>