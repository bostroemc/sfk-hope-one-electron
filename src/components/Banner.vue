<template>
  <div :class="monitor">
    <div style="display: flex; justify-content: flex-start; align-items: center; color: gray;">
      <img
        src="@/assets/Rexroth-Logo_4C.png"
        alt="rexroth"
        style="width:150px;height:auto; margin: 0 40px 0 10px"
      />
      <h3>BVM Assist</h3>
      <button class="btn-comm" :disabled="!communicationStatus">
        <font-awesome-icon icon="network-wired" />
      </button>
    </div>

    <div style="display: flex; justify-content: flex-end;">
      <button class="btn-reset" v-on:click="reset">
        <font-awesome-icon icon="check" />
      </button>

      <div class="vertical-line"></div>
      <Status label="Status" :value.sync="processStatus" />

      <div class="vertical-line"></div>
      <ActiveProgram label="Active program" :value.sync="programName" />

      <div>
        <button class="btn-stop" v-on:click="stop">
          <font-awesome-icon icon="square" />
        </button>
        <button id="btn-start" class="btn-start" v-on:click="startSequence" :disabled="ready">
          <font-awesome-icon icon="play" />&nbsp;START
        </button>
        <div v-show="false">{{count}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import ActiveProgram from "@/components/subcomponents/status_field_text_sm.vue";
import Status from "@/components/subcomponents/status_field_text_sm.vue";

export default {
  name: "Banner",

  components: {
    ActiveProgram,
    Status
  },

  computed: {
    processStatus() {
      return this.$store.getters.ProcessStatus;
    },
    ready() {
      return this.$store.getters.ProcessStatus != "Ready";
    },
    programName() {
      return this.$store.state.global.program.name;
    },
    count() {
      if (this.$store.state.global.step == 3) {
        this.$store.commit("incrementCounter");
      }
      if (
        this.$store.state.global.step == 4 &&
        this.$store.state.global.stopPending
      ) {
        this.$socket.send(
          `{ "command": "cancel", "params": [], "handle": ${new Date().getTime()} }`
        );
        this.$store.dispatch("resetRespirationRate");
      }
      return this.$store.state.parameters.count;
    },
    communicationStatus() {
      if (this.$store.state.global.socket.isConnected) {
        if (
          this.$store.state.global.program.driveID == "undefined" ||
          this.$store.state.global.program.driveID !=
            this.$store.state.global.program.id
        ) {
          this.initializeProgramData();
        }
      }

      return this.$store.state.global.socket.isConnected;
    },
    monitor() {
      return  this.$store.getters.IsError  //this.$store.state.parameters.count < this.$store.state.parameters.threshold
        ? "banner-warning"
        : "banner";
    }
  },

  methods: {
    ...mapActions(["getProgramName"]),

    startSequence: function() {
      this.activateProgram();

      setTimeout(() => {
        this.start();
      }, 250);
    },

    start: function() {
      console.log("program starting...");
      this.$store.commit("SET_STOP_PENDING", false);
      this.$socket.send(
        `{ "command": "startProgram", "params": [false], "handle": ${new Date().getTime()} }`
      );
    },

    stop: function() {
      console.log("program stopping...");
      this.$store.commit("SET_STOP_PENDING", true);
      this.$notify({ text: "Stop pending.", type: "info" });
    },

    reset: function() {
      console.log("reseting...");

      this.$store.commit("SET_PRESSURE_MAXMIN");
      this.$store.commit("SET_PRESSURE_ALARM", false);
      this.$store.commit("SET_PRESSURE_WARNING", false);

      this.$socket.send(
          `{ "command": "clearError", "params": [], "handle": ${new Date().getTime()} }`
        );
      },

    activateProgram: function() {
      console.log("id: " + this.$store.state.global.program.id);
      console.log("driveID: " + this.$store.state.global.program.driveID);

      let _id = this.$store.state.global.program.id;
      if (_id != "default" && _id != "undefined" && _id != "") {
        this.$socket.send(
          `{ "command": "setProgramActive", "params": ["${_id}"], "handle": ${new Date().getTime()} }`
        );

        this.$notify({ text: `Activating program id: ${_id}.`, type: "info" });
      } else {
        _id = this.$store.state.global.program.driveID;

        if (_id != "default" && _id != "undefined" && _id != "") {
          this.$socket.send(
            `{ "command": "setProgramActive", "params": ["${_id}"], "handle": ${new Date().getTime()} }`
          );

        this.$notify({ text: `Activating program driveID: ${_id}.`, type: "info" });  
        }
      }
    },
    
    initializeProgramData: function() {
      if (this.$store.state.global.program.driveID == "undefined") {
        this.getProgramName(); //Get program details from database
      }

      setTimeout(() => {
        this.activateProgram(); //Activate program
      }, 2000);
    }
  }
};
</script>


<style scoped>
.banner {
  background-color: #fff;

  display: flex;
  justify-content: space-between;
  height: 110px;
}

.banner-warning {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 80%,
    rgba(255, 0, 0, 1) 100%
  );
}

.vertical-line {
  width: 15px;
  border-right: thin solid #444;
  padding: 15px 0;
}

.btn-start {
  background-color: #7f95a4;
  color: white;
  cursor: pointer;
  height: 60px;
  width: 160px;
  border-radius: 0 30px 30px 0;
  font-size: 22px;
  border: none;
  margin: 20px 10px 0 2px;
}

.btn-start:hover {
  background-color: #97a9b5;
}

.btn-start:disabled {
  background-color: #c0cfd6;
  opacity: 0.5;
  pointer-events: none;
}

.btn-stop {
  background-color: #7f95a4;
  color: white;
  cursor: pointer;
  height: 60px;
  width: 70px;
  border-radius: 30px 0 0 30px;
  font-size: 22px;
  border: none;
}

.btn-stop:hover {
  background-color: #97a9b5;
}

.btn-reset {
  background-color: #7f95a4;
  color: white;
  cursor: pointer;
  height: 60px;
  width: 60px;
  border-radius: 30px;
  font-size: 22px;
  border: none;
  margin: 20px 10px 0 2px;
}

.btn-reset:hover {
  background-color: #97a9b5;
}

.btn-comm {
  background: none;
  color: gray;
  font-size: 22px;
  border: none;
  padding: 0 20px 0 40px;
}

.btn-comm:disabled {
  color: #c0cfd6;
}
</style>