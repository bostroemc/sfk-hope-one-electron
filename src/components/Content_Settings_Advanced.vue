<template>
  <div class="advanced">
    <div>
      <IpAddress label="IP address" name="ipAddress" :value="ipAddress" placeholder="192.168.0.1" />
      <Username label="Username" name="username" :value="username" placeholder="admin" />
    </div>

    <div>
      <Velocity label="Velocity [mm/s]" name="velocity"  min="0" :value="velocity"/>
      <Acceleration label="Acceleration [mm/s^2]" name="acceleration"  min="0" :value="acceleration"/>
      <StartPositionOffset label="Start position, offset [mm]" name="startPositionOffset" :value="startPositionOffset"/>
    </div>

    <div>
      <CycleCompensation label="Cycle compensation [ms]" name="compensation"  min="0" :value="compensation"/>
      <CounterThreshold label="Counter threshold [#]" name="threshold"  min="0" :value="threshold"/>
      <MaxForce label="Max. force [N]" name="maxForce" min="10" max="1000" :value="maxForce"/>
    </div>

    <button class="btn" @click="drawer_down()">
      <font-awesome-icon icon="chevron-down" />
    </button>
  </div>
</template>

<script>
import IpAddress from "@/components/subcomponents/input_field_text_sm.vue";
import Username from "@/components/subcomponents/input_field_text_sm.vue";
import Velocity from "@/components/subcomponents/input_field_number_sm.vue";
import Acceleration from "@/components/subcomponents/input_field_number_sm.vue";
import StartPositionOffset from "@/components/subcomponents/input_field_number_sm.vue";
import CycleCompensation from "@/components/subcomponents/input_field_number_sm.vue";
import CounterThreshold from "@/components/subcomponents/input_field_number_sm.vue";
import MaxForce from "@/components/subcomponents/input_field_number_sm.vue";

export default {
  components: {
    IpAddress,
    Username,
    Velocity,
    Acceleration,
    StartPositionOffset,
    CycleCompensation,
    CounterThreshold,
    MaxForce
  },

  computed: {
    ipAddress() {
      return this.$store.state.parameters.ipAddress;
    },
    username() {
      return this.$store.state.parameters.username;
    },
    velocity() {
      return this.$store.state.parameters.velocity;
    },
    acceleration() {
      return this.$store.state.parameters.acceleration;
    },
    startPositionOffset() {
      return this.$store.state.parameters.startPositionOffset;
    },
    compensation() {
      return this.$store.state.parameters.compensation;
    },
    threshold() {
      return this.$store.state.parameters.threshold;
    },
    maxForce() {
      return this.$store.state.parameters.maxForce;
    }
  },

  methods: {
    drawer_down() {
      this.$emit("drawer_down");
    }
  }
};
</script>

<style scoped>
.advanced {
  display: flex;

  position: fixed;
  background: linear-gradient(
    180deg,
    rgba(221, 221, 221, 1) 0,
    rgba(255, 255, 255, 1) 20px
  );
  height: 400px;
  z-index: 9999;
  width: calc(100% - 90px);
  bottom: 20px;
  right: 0;
}

.btn {
  background-color: transparent;
  color: black;
  cursor: pointer;

  border: none;
  font-size: 28px;
  padding: 10px 14px;
  margin: 20px;

  position: absolute;
  top: 20px;
  right: 20px;
}

.btn:hover {
  background-color: #00ccff;
  color: white;
  border-radius: 50%;
}
</style>