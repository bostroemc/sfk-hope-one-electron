<template>
  <div class="about">
    <img
      src="@/assets/Rexroth-Logo_4C.png"
      alt="rexroth"
      style="margin-top: 60px; width: 250px; height: auto;"
    />
    <div class="info-box">
      <h3>HOPE ONE interface for Rexroth Smart Function Kit</h3>
      <h4>Version: {{version}}</h4>
      <h4>Copyright &copy; 2020 Bosch Rexroth AG</h4>
      <h4>Bosch Rexroth AG</h4>
    </div>

    <div class="info-box">
      <h4>Open Source Licenses:</h4>
      <div class="license-box">{{data}}</div>
    </div>
  </div>
</template>

<script>
import licenses from "!!raw-loader!../assets/licenses.txt";

export default {
  name: "About",

  components: {},

  data: function() {
    return {
      data: licenses,
      version: process.env.VERSION
    };
  },

  methods: {}
};
</script>

<style scoped>
.about {
  background: linear-gradient(
    180deg,
    rgba(221, 221, 221, 1) 0,
    rgba(255, 255, 255, 1) 20px
  );

  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-box {
  border: 2px solid gray;
  width: 750px;
  padding-left: 20px;
  text-align: start;
  margin-top: 40px;
}

.license-box {
  width: 728px;
  height: 250px;
  border: 2px solid lightgray;
  font-size: 10pt;
  text-align: start;
  margin-bottom: 12px;
  overflow-y: scroll;
}
</style>