<template>
  <div class="patient" >
     <div>
      <FirstName label="First name" placeholder="John" name="firstName" :value="firstName"/>
      <LastName label="Last name" placeholder="Doe" name="lastName" :value="lastName"/>
      <Age label="Age" placeholder="65" name="age"  :value="age"/>
      <Sex label="Sex" name="sex" :value="sex"/>
    </div>

    <div>
      <Height label="Height [cm]" name="height" :value="height"/>
      <Weight label="Weight [kg]" name="weight" :value="weight"/>
    </div>
    <button class="btn" v-on:click="save">SAVE</button>
    
  </div>
</template>

<script>
import FirstName from "@/components/subcomponents/input_field_text_sm.vue";
import LastName from "@/components/subcomponents/input_field_text_sm.vue";
import Age from "@/components/subcomponents/input_field_number_sm.vue";
import Height from "@/components/subcomponents/input_field_number_sm.vue";
import Weight from "@/components/subcomponents/input_field_number_sm.vue";
import Sex from "@/components/subcomponents/input_field_text_sm.vue";

export default {
  name: "Patient",

  data: function() {
    return {
      show: false
    };
  },
  components: {
    FirstName,
    LastName,
    Age,
    Height,
    Weight,
    Sex
  },
  methods: {
    save: function() {
      this.$store.commit("savePatientData");
      this.$notify({ text: "Patient data saved.", type: "info" });
    },
    
  },
   computed: {
    firstName() {
      return this.$store.state.parameters.firstName;
    },
    lastName() {
      return this.$store.state.parameters.lastName;
    },
    age() {
      return this.$store.state.parameters.age;
    },
    height() {
      return this.$store.state.parameters.height;
    },
    weight() {
      return this.$store.state.parameters.weight;
    },
   sex() {
      return this.$store.state.parameters.sex;
    }    
  }
};
</script>

<style scoped>
.patient{
  display: flex;
   background: linear-gradient(
    180deg,
    rgba(221, 221, 221, 1) 0,
    rgba(255, 255, 255, 1) 20px
  );

}

.btn{
  background-color: #7f95a4;
  color: white;
  cursor: pointer;
  height: 60px;
  width: 120px;
  font-size: 16pt;
  border: none;
  margin: 40px 10px 0 0;
  position: absolute;
  right: 20px;
  
}


</style>