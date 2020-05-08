<template>
  <nav class="navigation">
    <ul>
      <router-link class="lnk" to="/">
        <font-awesome-icon icon="home" />
      </router-link>

      <button id="login" class="btn" v-on:click="openForm" v-show="!loginStatus">
        <font-awesome-icon icon="key" />
      </button>

      <form class="form-container" @submit="onSubmit" v-show="formStatus">
        <input
          type="password"
          v-model="password"
          inputmode="numeric"
          minlength="4"
          maxlength="6"
          size="6"
          placeholder="PIN"
        />
        <button type="submit" class="btn-login">LOGIN</button>
      </form>

      <button id="logout" class="btn" v-on:click="logout" v-show="loginStatus">
        <font-awesome-icon icon="sign-out-alt" />
      </button>
    </ul>

    <ul>
      <router-link class="lnk" v-show="loginStatus" to="/patient">
        <font-awesome-icon icon="user" />
      </router-link>
      <span class="lnk-disable" v-show="!loginStatus">
        <font-awesome-icon icon="user" />
      </span>

      <router-link class="lnk" v-show="loginStatus" to="/settings">
        <font-awesome-icon icon="cog" />
      </router-link>
      <span class="lnk-disable" v-show="!loginStatus">
        <font-awesome-icon icon="cog" />
      </span>
    </ul>
  </nav>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      password: "",
      temp: false,
      throttleTimeout: null,
      activityTimeout: null
    };
  },

  computed: {
    loginStatus() {
      return this.$store.state.global.loginStatus;
    },
    formStatus() {
      return this.temp;
    }
  },

  methods: {
    ...mapActions(["login", "logout"]),

    openForm: function() {
      this.temp = !this.temp;
    },
    onSubmit: async function(e) {
      e.preventDefault();
      try {
        await this.login(this.password); //this.$store.dispatch('login', this.password) //

        this.$notify({ text: "Login successful.", type: "info" });
        this.temp = false; 
        this.password = "";
      } catch {
        this.$notify({ text: "Login failed.", type: "fault" });
      }
    },

    resetMonitor: function() {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = setTimeout(() => {
        this.logout();
        this.$notify("User logged out due to inactivity.");
        
      }, 120000);
    },

    throttle: function() {
      if (!this.throttleTimeout & this.loginStatus) {
        this.throttleTimeout = setTimeout(() => {
          this.resetMonitor();

          clearTimeout(this.throttleTimeout);
          this.throttleTimeout = null;
        }, 100);
      }
    }
  },

  beforeMount() {
    window.addEventListener("mousemove", this.throttle);
    window.addEventListener("click", this.throttle);
    window.addEventListener("keydown", this.throttle);
    window.addEventListener("touchstart", this.throttle);
  },

  beforeDestroy() {
    window.removeEventListener("mousemove", this.throttle);
    window.removeEventListener("click", this.throttle);
    window.removeEventListener("keydown", this.throttle);
    window.removeEventListener("touchstart", this.throttle);

    clearTimeout(this.activityTimeout);
    clearTimeout(this.throttleTimeout);
  }
};
</script>


<style scoped>
ul {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.navigation {
  background-color: #e3e9ee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  position: relative;
  float: left;
  height: calc(100vh - 110px);
  width: 80px;
}

.btn {
  background: none;
  color: black;
  cursor: pointer;

  border: none;
  font-size: 28px;

  height: 60px;
  width: 60px;

  margin: 20px 40px 0 0;
}

.btn:hover {
  background-color: #00ccff;
  color: white;
  border-radius: 50%;

  padding: 20px 0 -20px 0;
}

.lnk {
  color: black;
  cursor: pointer;
  border: none;

  font-size: 28px;
  height: 60px;
  width: 60px;

  margin: 20px 40px 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lnk:hover {
  background-color: #00ccff;
  color: white;
  border-radius: 50%;
}

.lnk-disable {
  background-color: transparent;
  color: gray;
  border: none;

  font-size: 28px;
  height: 60px;
  width: 60px;

  margin: 20px 40px 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.router-link-exact-active {
  background-color: #00ccff;
  border-radius: 50%;
  color: white;
}

.form-container {
  display: inline-block;
  position: relative;
  bottom: 70px;
  left: 150px;
  z-index: 9999;

  padding: 10px;
  background-color: #e3e9ee;
  border: 2px solid #00ccff;
  display: flex;
}

.form-container input[type="text"],
.form-container input[type="password"] {
  width: 120px;
  height: 55px;
  border: none;
  padding-left: 10px;
  background: #fff;
  font-size: 16px;
}

.form-container input[type="text"]:focus,
.form-container input[type="password"]:focus {
  outline: 2px solid #00ccff;
}

.form-container .btn-login {
  background-color: #7f95a4;
  color: white;
  cursor: pointer;
  height: 55px;
  width: 100px;
  font-size: 16px;
  font-weight: 600;
  border: none;
}

.form-container .btn-login:hover {
  background-color: #97a9b5;
}
</style>