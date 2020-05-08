<template>
  <div class="settings" >
    <Content @drawer_up="drawer_up"/>
    <transition name="fade">
      <Advanced v-show="show" @drawer_down="drawer_down"/>
    </transition>
  </div>
</template>

<script>
import Content from "@/components/Content_Settings.vue";
import Advanced from "@/components/Content_Settings_Advanced.vue";

export default {
  name: "Settings",
  data: function() {
    return {
      show: false
    };
  },
  components: {
    Content,
    Advanced
  },
  methods: {
    drawer_up: function() {
      this.show = true;
    },
    drawer_down: function() {
      this.show = false;
    }
  }
};
</script>

<style scoped>


.fade-enter-active, .fade-leave-active {
  transition: all 0.75s ease;
  
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {

  height: 120px;
  opacity: 0.5;
}

</style>