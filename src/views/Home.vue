<template>
  <div class="home">
    <Header />
    <ContentHome />
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import ContentHome from '@/components/Content_Home.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Header,
    ContentHome,
    Footer
  },

  
}
</script>

<style scoped>

</style>