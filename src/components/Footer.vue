<template>
  <div class="footer">
    <CycleTime label="Cycle time [s]" name="cycleTime" precision="1" :value.sync="cycleTime" />
    <Position label="Position [mm]" name="position"  precision="1" :value.sync="position" />
    <Velocity label="Velocity [mm/s]" name="velocity" precision="1" :value.sync="velocity" />
    <ErrorCode label="Error code" name="errorID"  :value.sync="errorID" />
  </div>
</template>

<script>
import CycleTime from "@/components/subcomponents/status_field_sm.vue";
import Position from "@/components/subcomponents/status_field_sm.vue";
import Velocity from "@/components/subcomponents/status_field_sm.vue";
import ErrorCode from "@/components/subcomponents/status_field_text_sm.vue";

export default {
  name: "Header",
  components: {
    CycleTime,
    Position,
    Velocity,
    ErrorCode
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
      return this.$store.state.global.errorID;
    }
  }
};
</script>

<style scoped>
.footer{
    display: flex;
    background: linear-gradient(180deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 20%);

}

</style>