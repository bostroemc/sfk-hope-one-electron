<template>
  <div class="banner">
    <div style="display: flex; justify-content: flex-start; align-items: center; color: gray;">
      <img
        src="@/assets/Rexroth-Logo_4C.png"
        alt="rexroth"
        style="width:150px;height:auto; margin: 0 40px 0 10px"
      />
      <h3>HOPE ONE</h3>
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions} from "vuex";

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
      return this.$store.getters.ProcessStatus
    },
    ready() {
      return (this.$store.getters.ProcessStatus != "Ready")
    },
    programName(){
      return this.$store.state.global.program.name
    }
  },

  methods: {
    ...mapActions(["getProgramName"]),

    startSequence: function() {
      this.setProgramActive();

      setTimeout(()=> {
        this.start();
      }, 250);
    },

    start: function() {
      console.log("program starting...");
      this.$store.commit("SET_STOP_PENDING", false);
      this.$socket.send(`{ "command": "startProgram", "params": [false], "handle": ${new Date().getTime()} }`);
    },

    stop: function() {
      console.log("program stopping...");
      this.$store.commit("SET_STOP_PENDING", true);
      this.$notify({ text: "Stop pending.", type: "info" });

      // this.$socket.send(`{ "command": "cancel", "params": [], "handle": ${new Date().getTime()} }`);

    },

    reset: function() {
      console.log("reseting...");
      this.$socket.send(`{ "command": "clearError", "params": [], "handle": ${new Date().getTime()} }`);
    },

    setProgramActive: function() {
      let _id =  this.$store.state.global.program.id == "default" ? this.$store.state.global.program.driveID : this.$store.state.global.program.id;
      this.$socket.send(`{ "command": "setProgramActive", "params": ["${_id}"], "handle": ${new Date().getTime()} }`);
    }

  },

  created: function() {
      setTimeout(()=> {
        this.getProgramName();
      }, 1500);

      setTimeout(()=> {
        this.setProgramActive();
      }, 3000);     
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
</style>