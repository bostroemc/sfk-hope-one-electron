<template>
  <div class="container">
    <label>Pressure</label>

    <div class="sub">
      <input type="number" v-model="_value" readonly />
      <span class="unit">cm H<sub>2</sub>O</span>
    </div>

    <svg width="300" height="300">
      <g class="bars">
        <rect fill="#e3e9ee" stroke="#666" stroke-width="2" x="75" y="1" height="275" width="40"/>
        <line :stroke="_color" stroke-width="38" x2="95" :y2="_value_scaled" x1="95" y1="275" />
 
        <line stroke="#666" stroke-width="2" x2="75" :y2="_alarm_hi_scaled" x1="140" :y1="_alarm_hi_scaled" />
        <text class="labels" x="120" :y="_alarm_hi_scaled-2" >{{this.alarm_hi}}</text>

        <line stroke="#666" stroke-width="2" x2="75" :y2="_warning_hi_scaled" x1="170" :y1="_warning_hi_scaled"/>
        <text class="labels" x="150" :y="_warning_hi_scaled-2" >{{this.warning_hi}}</text>  

        <line stroke="#666" stroke-width="2" x2="75" :y2="_alarm_lo_scaled" x1="140" :y1="_alarm_lo_scaled"/>
        <text class="labels" x="120" :y="_alarm_lo_scaled-2" >{{this.alarm_lo}}</text>  

        <line stroke="#666" stroke-width="4" x2="75" :y2="_minimum_scaled" x1="115" :y1="_minimum_scaled"/>
        <text class="maxmin" x="18" :y="_minimum_scaled+8" >{{_minimum}}</text>            
 
         <line stroke="#666" stroke-width="4" x2="75" :y2="_maximum_scaled" x1="115" :y1="_maximum_scaled"/>
        <text class="maxmin" x="18" :y="_maximum_scaled+8" >{{_maximum}}</text>                
      </g>
    </svg>
 
  </div>
</template>

<script>
export default {
  props: [
    "label",
    "unit",
    "value",
    "minimum",    
    "maximum",
    "alarm_hi",
    "alarm_lo",
    "warning_hi",
    "range_max",
    "range_min"
  ],

  computed: {
    _value: {
      get() {
        return parseFloat(this.value).toFixed(1)
      }
    },
    _value_scaled: {
      get() {
        return (
          275 * (1 - (this.value - this.range_min) / (this.range_max - this.range_min))
        );
      }
    },
    _minimum: {
      get() {
        return parseFloat(this.minimum).toFixed(1)
      }
    },
    _minimum_scaled: {
      get() {
        return (
          275 * (1 - (this.minimum - this.range_min) / (this.range_max - this.range_min))
        );
      }
    },    
    _maximum: {
      get() {
        return parseFloat(this.maximum).toFixed(1)
      }
    },
    _maximum_scaled: {
      get() {
        return (
          275 * (1 - (this.maximum - this.range_min) / (this.range_max - this.range_min))
        );
      }
    },
   _alarm_hi_scaled: {
      get() {
        return (
          275 * (1 - (this.alarm_hi - this.range_min) / (this.range_max - this.range_min))
        );
      }
    },

   _warning_hi_scaled: {
      get() {
        return (
          275 * (1 - (this.warning_hi - this.range_min) / (this.range_max - this.range_min)) 
        );
      }
    },  
    
   _alarm_lo_scaled: {
      get() {
        return (
          275 * (1 - (this.alarm_lo - this.range_min) / (this.range_max - this.range_min))
        );
      }
    },      

    _color: {
      get() {
        if (this.value > this.alarm_hi || this.value < this.alarm_lo) {
          return "rgb(225,0,0, 0.5)";
        } else if (this.value > this.warning_hi || this.value < this.warning_lo) {
          return "rgb(225,225,0, 0.5)";
        } else{
          return "rgb(0,225,0, 0.5";
        }
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 45px 0 0 80px;
  
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 300px;
}

.container label {
  text-align: left;
  font-size: 26pt;
  color: #444;
}

.sub {
  display: flex;
  align-items:baseline;
}

.sub input {
  text-align: right;
  width: 50%;
  font-size: 42pt;
  border: none;
  padding-left: 0px;
  background: none;
}

.sub span {
  font-size: 18pt;
  color: #444;
}

.labels {
  font-size: 16pt;
  font-style: oblique;
  color: #444;

}

.maxmin {
  font-size: 18pt;
  color: #fff;
}
</style>