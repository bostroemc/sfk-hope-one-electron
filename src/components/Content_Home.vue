<template>
  <div class="content-home">
    <div class="col-1">
      <Compression label="Compression" unit="%" name="compressionFactor" precision="0" :value="compression" />
      <TidalVolume label="Tidal volume" unit="ml" precision="0" :value="tidalVolume" />
    </div>
    <div class="col-1">
      <RespirationRate label="Respiration rate" unit="1/min" name="velocity" precision="1" :value="respirationRate" />
      <IERatio label="I : E" name_numerator="inspirtaionValue" :numerator="inspiration" name_denominator="expirationValue" :denominator="expiration" />
    </div>
  </div>
</template>

<script>
import Compression from "@/components/subcomponents/status_field_lg.vue";
import TidalVolume from "@/components/subcomponents/status_field_lg.vue";
import RespirationRate from "@/components/subcomponents/status_field_lg.vue";
import IERatio from "@/components/subcomponents/status_ratio_field_sm.vue";

export default {
  name: "ContentHome",
  components: {
    Compression,
    TidalVolume,
    RespirationRate,
    IERatio
  },
  computed: {
    compression() {
      return this.$store.state.parameters.compressionFactor;
    },
    tidalVolume() {
      return this.$store.state.parameters.compressionFactor * 2.8;
    },
    respirationRate() {
      return this.$store.state.global.respirationRateActual;
    },
    inspiration() {
      return this.$store.state.parameters.inspirationValue;
    },
    expiration() {
      return this.$store.state.parameters.expirationValue;
    }
  }
};
</script>

<style scoped>
.content-home {
  height: calc(100vh - 300px);
  display: flex;
  justify-content: space-evenly;

    background: rgb(245,245,245);
  
}

.col-1 {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>

