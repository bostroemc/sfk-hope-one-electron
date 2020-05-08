<template>
  <div :class="monitor">
    <IPAddress label="IP address" name="ipAddress" :value="ipAddress" />
    <BMV label="BMV" name="bagType"  :value="bagName" />
    <RespirationRate label="Respiration rate" name="respirationRate" precision="1" :value="respirationRate" />
    <Name label="Patient"  :value="patientName" />
    <Counter label="Count"  :value="count" />
    <button class="btn-reset" :disabled="!loginStatus" v-on:click="reset">RESET</button>
  </div>
</template>

<script>
import IPAddress from "@/components/subcomponents/status_field_text_sm_spl.vue";
import BMV from "@/components/subcomponents/status_field_text_sm.vue";
import RespirationRate from "@/components/subcomponents/status_field_sm.vue";
import Name from "@/components/subcomponents/status_field_text_sm.vue";
import Counter from "@/components/subcomponents/status_field_sm.vue";

export default {
  name: "Header",
   data() {
    return {
      step : 0
    };
  },
  components: {
    IPAddress,
    BMV,
    RespirationRate,
    Name,
    Counter
  },
  computed: {
    ipAddress() {
      return this.$store.state.parameters.ipAddress;
    },
    bagType() {
      return this.$store.state.parameters.bagType;
    },
    respirationRate() {
      return this.$store.state.parameters.respirationRate;
    },
    bagName() {
        switch(this.$store.state.parameters.bagType) {
        case 0:
            return "Ambu Spur II Adult";
            
        case 1:
            return "Laerdal Bag II Adult";
            
        case 2:
            return "Vyaire Adult";
                       
        default:
            return "Unknown";
        }
    },
    patientName() {
      return this.$store.state.parameters.lastName + ", " + this.$store.state.parameters.firstName;
    },
    count() {
      if (this.$store.state.global.step == 4 ){
        this.$store.commit('incrementCounter');
      }
      return this.$store.state.parameters.count;
    },
    monitor() {
      return (this.$store.state.parameters.count < this.$store.state.parameters.threshold) ? "header" : "header-warning";
    },
    loginStatus() {
      return this.$store.state.global.loginStatus;
    }
  },
    methods: {
    reset: function() {
      this.$store.commit("resetCounter");
      this.$notify({ text: "Cycle counter reset to zero.", type: "info" });
    } 
   
  }

};
</script>

<style scoped>
.header{
    display: flex;
    background: linear-gradient(180deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 20%);

}

.header-warning{
    display: flex;
    background: linear-gradient(180deg, rgba(255,140,110,1) 0%, rgba(255,153,153,1) 20%);
}

.btn-reset{
  background-color: #7f95a4;
  color: white;
  cursor: pointer;
  height: 60px;
  width: 120px;
  font-size: 16pt;
  border: none;
  margin: 20px 10px 0 0;
  border-radius: 30px;
}

.btn-reset:disabled {
  background-color: #c0cfd6;
  opacity: 0.5;
  pointer-events: none;
}


</style>