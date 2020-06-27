<template>
  <div class="content">
    <div>
      <Compression
        label="Compression [%]"
        max="100"
        min="0"
        name="compressionFactor"
        precision="0"
        :value="compression"
      />
      <RespirationRate
        label="Respiration rate [1/min]"
        max="35"
        min="5"
        name="respirationRate"
        precision="0"
        :value="respirationRate"
      />
      <PressureAlarmHigh
        label="Pressure, high alarm [cm H20]"
        max="50"
        min="0"
        name="pressure_alarm_hi"
        precision="0"
        :value="pressureAlarmHigh"
      />   
     <PressureAlarmLow
        label="Pressure, low alarm [cm H20]"
        max="50"
        min="0"
        name="pressure_alarm_lo"
        precision="0"
        :value="pressureAlarmLow"
      />  
     <PressureWarningHigh
        label="Pressure, high warning [cm H20]"
        max="50"
        min="0"
        name="pressure_warning_hi"
        precision="0"
        :value="pressureWarningHigh"
      />    
    </div>
    <div>
      <InspirationFactor
        label="Inspiration (I)"
        max="4"
        min="1"
        name="inspirationValue"
        precision="0"
        :value="inspiration"
      />
      <ExpirationFactor
        label="Expiration (E)"
        max="4"
        min="1"
        name="expirationValue"
        precision="0"
        :value="expiration"
      />
      <PressureDebounce
          label="Pressure alarm delay [ms]"
          max="10000"
          min="5"
          name="pressure_alarm_debounce"
          precision="0"
          :value="pressureDebounce"
        />   
        <PressureScaling
          label="Pressure signal scale factor (temp.)"
          name="pressure_scaling"
          :value="pressureScaling"
        />   

    </div>
    <div>
      <BagType
        label="Bag type"
        name="bagType"
        :fields="['Ambu Spur II Adult', 'Laerdal Bag II Adult']"
        :value="bagType"
      />
    </div>
    <button class="btn" v-on:click="update">UPDATE</button>
    <button class="btn-drawer" @click="drawer_up()">
      <font-awesome-icon icon="chevron-up" />
    </button>
  </div>
</template>

<script>
import Compression from "@/components/subcomponents/input_spinner.vue";
import RespirationRate from "@/components/subcomponents/input_spinner.vue";
import InspirationFactor from "@/components/subcomponents/input_spinner.vue";
import ExpirationFactor from "@/components/subcomponents/input_spinner.vue";
import BagType from "@/components/subcomponents/dropdown_selector.vue";

import PressureAlarmHigh from "@/components/subcomponents/input_spinner.vue";
import PressureAlarmLow from "@/components/subcomponents/input_spinner.vue";
import PressureWarningHigh from "@/components/subcomponents/input_spinner.vue";
import PressureDebounce from "@/components/subcomponents/input_spinner.vue";

//temp
import PressureScaling from "@/components/subcomponents/input_field_number_sm.vue";

import { mapActions } from "vuex";

export default {
  components: {
    Compression,
    RespirationRate,
    InspirationFactor,
    ExpirationFactor,
    BagType,
    PressureAlarmHigh,
    PressureAlarmLow,
    PressureWarningHigh,
    PressureDebounce,
    PressureScaling
  },
  computed: {
    compression() {
      return this.$store.state.parameters.compressionFactor;
    },
    respirationRate() {
      return this.$store.state.parameters.respirationRate;
    },
    inspiration() {
      return this.$store.state.parameters.inspirationValue;
    },
    expiration() {
      return this.$store.state.parameters.expirationValue;
    },
    bagType() {
      return this.$store.state.parameters.bagType;
    },
    pressureAlarmHigh() {
      return this.$store.state.parameters.pressure_alarm_hi;
    },
    pressureAlarmLow() {
      return this.$store.state.parameters.pressure_alarm_lo;
    },    
    pressureWarningHigh() {
      return this.$store.state.parameters.pressure_warning_hi;
    },
    pressureDebounce() {
      return this.$store.state.parameters.pressure_alarm_debounce;
    },

    //temp
    pressureScaling(){
      return this.$store.state.parameters.pressure_scaling;
    }
  },

  methods: {
    ...mapActions(["updateProgram", "action_saveStore","getProgramName"]),

    drawer_up: function() {
      this.$emit("drawer_up");
    },

    update: async function(e) {
      e.preventDefault();
      try {
        await this.updateProgram(); //this.$store.dispatch('login', this.password) //

        this.$notify({ text: "Program successfully updated.", type: "info" });
//        this.setProgramActive();
        this.action_saveStore();
      } catch (ex) {
        this.$notify({ text: "Program update failed." + ex, type: "fault" });
      }
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  background: linear-gradient(
    180deg,
    rgba(221, 221, 221, 1) 0,
    rgba(255, 255, 255, 1) 20px
  );
}

.btn {
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

.btn-drawer {
  background-color: transparent;
  color: black;
  cursor: pointer;

  border: none;
  font-size: 28px;
  padding: 10px 14px;
  margin: 20px;

  position: fixed;
  bottom: 20px;
  right: 20px;
}

.btn-drawer:hover {
  background-color: #00ccff;
  color: white;
  border-radius: 50%;
}
</style>