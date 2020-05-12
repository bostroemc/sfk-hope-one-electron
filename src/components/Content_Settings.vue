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
        max="25"
        min="5"
        name="respirationRate"
        precision="0"
        :value="respirationRate"
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
    </div>
    <div>
      <BagType
        label="Bag type"
        name="bagType"
        :fields="['Ambu Spur II Adult', 'Laerdal Bag II Adult', 'Vyaire Adult']"
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

import { mapActions } from "vuex";

export default {
  components: {
    Compression,
    RespirationRate,
    InspirationFactor,
    ExpirationFactor,
    BagType
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
    }
  },

  methods: {
    ...mapActions(["updateProgram", "action_saveStore"]),

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
    },
    setProgramActive: function() {
      if (this.$store.state.global.program.id != "default"){
        let _id = this.$store.state.global.program.id;
        this.$socket.send(`{ "command": "setProgramActive", "params": ["${_id}"], "handle": ${new Date().getTime()} }`);
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