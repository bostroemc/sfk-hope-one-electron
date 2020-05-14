<template>
  <div class="footer">
    <CycleTime label="Cycle time [s]" name="cycleTime" precision="1" :value.sync="cycleTime" />
    <Position label="Position [mm]" name="position" precision="1" :value.sync="position" />
    <Velocity label="Velocity [mm/s]" name="velocity" precision="1" :value.sync="velocity" />
    <ErrorCode label="Error code" name="errorID" :value.sync="errorID" />
    <ErrorMsg label="Message" :value.sync="errorMsg" v-show="isError" />
  </div>
</template>

<script>
import CycleTime from "@/components/subcomponents/status_field_sm.vue";
import Position from "@/components/subcomponents/status_field_sm.vue";
import Velocity from "@/components/subcomponents/status_field_sm.vue";
import ErrorCode from "@/components/subcomponents/status_field_text_sm.vue";
import ErrorMsg from "@/components/subcomponents/error_field_text_sm.vue";

export default {
  name: "Header",
  components: {
    CycleTime,
    Position,
    Velocity,
    ErrorCode,
    ErrorMsg
  },
  computed: {
    cycleTime() {
      return this.$store.state.global.cycleTime;
    },
    position() {
      return this.$store.state.global.position;
    },
    velocity() {
      return this.$store.state.global.velocity;
    },
    errorID() {
      return this.$store.state.global.errorID.toString(16).toUpperCase();
    },
    isError() {
      return this.$store.state.global.errorID != 0;
    },
    errorMsg() {
      let error = this.$store.state.global.errorID % 0x100000;

      if (error == 0xe2019) {
        return "Warning, motor overtemperature shutdown";
      } else if (error == 0xe2021) {
        return "Motor temperature outside of measuring range";
      } else if (error == 0xe2028) {
        return "Warning, motor temperature monitor defective";
      } else if (error == 0xf2019) {
        return "Motor temperature shutdown";
      } else if (error == 0xf2020) {
        return "Motor temperature monitor defective";
      } else if (error == 0xf2028) {
        return "Excessive deviation";
      } else if (error == 0xf8027) {
        return "Emergency stop active";
      } else {
        return "See Rexroth documentation for more information.";
      }
    }
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  background: linear-gradient(
    180deg,
    rgba(221, 221, 221, 1) 0%,
    rgba(255, 255, 255, 1) 20%
  );
}
</style>