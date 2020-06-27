<template>
  <div class="content-home">
    <div class="col-1">
      <Compression
        label="Compression"
        unit="%"
        name="compressionFactor"
        precision="0"
        :value="compression"
      />
      <TidalVolume label="Tidal volume" unit="ml" precision="0" :value="tidalVolume" />
    </div>
    <div class="col-1">
      <RespirationRate
        label="Respiration rate"
        unit="1/min"
        name="velocity"
        precision="1"
        :value="respirationRate"
      />
      <IERatio
        label="I : E"
        name_numerator="inspirtaionValue"
        :numerator="inspiration"
        name_denominator="expirationValue"
        :denominator="expiration"
      />
    </div>
    <div class="vertical-line"></div>
    <div class="gauge">
      <Pressure
        label="Pressure"
        :value="pressure"
        :minimum="pressureMin"
        :maximum="pressureMax"
        range_max="50"
        range_min="0"
        :alarm_hi="pressureAlarmHigh"
        :warning_hi="pressureWarningHigh"
        :alarm_lo="pressureAlarmLow"
      />
    </div>
  </div>
</template>

<script>
import Compression from "@/components/subcomponents/status_field_lg.vue";
import TidalVolume from "@/components/subcomponents/status_field_lg.vue";
import RespirationRate from "@/components/subcomponents/status_field_lg.vue";
import IERatio from "@/components/subcomponents/status_ratio_field_sm.vue";
import Pressure from "@/components/subcomponents/stacktree_sm.vue";

export default {
  name: "ContentHome",
  data() {
    return {
      alarm_hi : {
        flag: false,
        latch: false
      },
      alarm_lo : {
        flag: false,
        latch: false
      },      
      warning_hi : {
        flag: false,
        latch: false
      }
    };
  },

  components: {
    Compression,
    TidalVolume,
    RespirationRate,
    IERatio,
    Pressure
  },
  computed: {
    compression() {
      return this.$store.state.parameters.compressionFactor;
    },
    tidalVolume() {
      return this.$store.getters.TidalVolume;
    },
    respirationRate() {
      return this.$store.state.global.respirationRateActual;
    },
    inspiration() {
      return this.$store.state.parameters.inspirationValue;
    },
    expiration() {
      return this.$store.state.parameters.expirationValue;
    },
    pressure() {
      this.monitorPressureAlarmHigh();
      this.monitorPressureAlarmLow();
      this.monitorPressureWarningHigh();

      return this.$store.state.global.pressure.value;
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
    pressureMin() {
      return this.$store.state.global.pressure.minimum;
    },
    pressureMax() {
      return this.$store.state.global.pressure.maximum;
    },
    delay() {
      return this.$store.state.parameters.pressure_alarm_debounce;
    }    
  },
  methods: {
    monitorPressureAlarmHigh: function() {
      if (this.$store.state.global.pressure.value > this.pressureAlarmHigh && !this.alarm_hi.latch && !this.$store.state.global.pressure.alarm) {
        this.alarm_hi.flag = true;
        this.alarm_hi.latch = true;

        setTimeout(() => {
          this.alarm_hi.latch = false;
          if (this.alarm_hi.flag && !this.$store.state.global.pressure.alarm) {
            this.$store.commit("SET_PRESSURE_ALARM", true);
          }
        }, this.delay);
      } else if (this.$store.state.global.pressure.value < this.pressureAlarmHigh) {
        this.alarm_hi.flag = false;
      }
    },
    monitorPressureAlarmLow: function() {
     if (this.$store.state.global.pressure.value < this.pressureAlarmLow && !this.alarm_lo.latch && !this.$store.state.global.pressure.alarm) {
        this.alarm_lo.flag = true;
        this.alarm_lo.latch = true;

        setTimeout(() => {
          this.alarm_lo.latch = false;
          if (this.alarm_lo.flag && !this.$store.state.global.pressure.alarm) {
            this.$store.commit("SET_PRESSURE_ALARM", true);
          }
        }, this.delay);
      } else if (this.$store.state.global.pressure.value > this.pressureAlarmLow) {
        this.alarm_lo.flag = false;
      }
    },
    monitorPressureWarningHigh: function() {
      if (this.$store.state.global.pressure.value > this.pressureWarningHigh && !this.warning_hi.latch && !this.$store.state.global.pressure.warning) {
        this.warning_hi.flag = true;
        this.warning_hi.latch = true;

        setTimeout(() => {
          this.warning_hi.latch = false;
          if (this.warning_hi.flag  && !this.$store.state.global.pressure.warning) {
            this.$store.commit("SET_PRESSURE_WARNING", true);
          }
        }, this.delay);
      } else if (this.$store.state.global.pressure.value < this.pressureWarningHigh) {
        this.warning_hi.flag = false;
      }
    }    
  }
};
</script>

<style scoped>
.content-home {
  height: calc(100vh - 300px);
  display: flex;
  justify-content: space-evenly;

  background: rgb(245, 245, 245);
}

.col-1 {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.gauge {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vertical-line {
  width: 15px;
  border-right: thin solid rgb(215, 215, 215);
}
</style>

