<template >
  <main>
    <div id="app">
      <Banner class="banner" />
      <Navigation class="navigation" />
      <router-view />
    </div>
    <notifications class="toast" position="top left"/>
  </main>
</template>

<script>
// @ is an alias to /src
import Banner from "@/components/Banner.vue";
import Navigation from "@/components/Navigation.vue";

export default {
  name: "App",
  components: {
    Banner,
    Navigation
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.toast  {
  padding: 10px 10px;

}

.toast .notification-content {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    height: 40px;
         
  }

  .toast .notification-title {
    width: 800px;
  }

   .toast .info {
    background:#00ccff;
    border-left: 5px solid #4ddbff;
  }

    .toast .fault {
    background: #df0024;
    border-left: 5px solid #ff3355;
  }
 

</style>
