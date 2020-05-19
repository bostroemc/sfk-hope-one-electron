import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';

Vue.use(Vuex);

const state = {
  password: "1606",
  loginStatus: false,
  driveConnected: false,
  errorID: 0,
  parameterMode: false,
  powerOn: false,
  referenceSet: false,
  token: 0,
  position: 0,
  velocity: 0,
  cycleTime: 0,
  step: 0,
  respirationRateActual: 0,
  stopPending: false,

  program: {
    name: "undefined",        //human readable name
    id: "default",        //encoded name (ref. drive.ProgActiveName)
    driveID: "undefined",   //temp value for initialization, only used on getProgramName API call
    active: false,             //program is active (ref. drive.ProgActive)
    data: ""
  },

  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
  }

};

const mutations = {
  PARSE_SOCKET_MESSAGE(state, message) {
    let obj = JSON.parse(message.data);

    if (Object.prototype.hasOwnProperty.call(obj, "subscription")) {
      if (Object.prototype.hasOwnProperty.call(obj.subscription, "cycleTime")) {
        state.cycleTime = obj.subscription.cycleTime;
        state.respirationRateActual = 60.0 / state.cycleTime;
      }
      if (Object.prototype.hasOwnProperty.call(obj.subscription, "position")) {
        state.position = obj.subscription.position;
      }
      if (Object.prototype.hasOwnProperty.call(obj.subscription, "velocity")) {
        state.velocity = obj.subscription.velocity;
      }
    }
    if (Object.prototype.hasOwnProperty.call(obj, "state")) {
      if (Object.prototype.hasOwnProperty.call(obj.state, "device")) {
        state.driveConnected = obj.state.device;
      }
    }

    if (Object.prototype.hasOwnProperty.call(obj, "drive")) {
      if (Object.prototype.hasOwnProperty.call(obj.drive, "ProgActive")) {
        state.program.active = obj.drive.ProgActive;
      }
      if (Object.prototype.hasOwnProperty.call(obj.drive, "ProgActiveName")) {
        state.program.id = obj.drive.ProgActiveName;
      }
      if (Object.prototype.hasOwnProperty.call(obj.drive, "ActEMCStep")) {
        state.step = obj.drive.ActEMCStep;
      }      
    }

    if (Object.prototype.hasOwnProperty.call(obj, "rpc")) {
      if (Object.prototype.hasOwnProperty.call(obj.rpc, "ErrorID")) {
        state.errorID = obj.rpc.ErrorID;
      }
      if (Object.prototype.hasOwnProperty.call(obj.rpc, "parameterMode")) {
        state.parameterMode = obj.rpc.parameterMode;
      }
      if (Object.prototype.hasOwnProperty.call(obj.rpc, "powerOn")) {
        state.powerOn = obj.rpc.powerOn;
      }
      if (Object.prototype.hasOwnProperty.call(obj.rpc, "referenceSet")) {
        state.referenceSet = obj.rpc.referenceSet;
      }
    }
  },
  SET_TOKEN(state, token) {
    state.token = token
  },

  SET_PROGRAM_NAME(state, name) {
    state.program.name = name
  },

  SET_DRIVE_ID(state, value) {
    state.program.driveID = value
  },
  SET_LOGIN_STATUS(state, value) {
    state.loginStatus = value
  },
  SET_PROGRAM_DATA(state, data) {
    state.program.data = data
  },
  SET_RESPIRATION_RATE(state) {
    state.respirationRateActual = 0
  },
  SET_STOP_PENDING(state, value) {
    state.stopPending = value
  } 
};

const actions = {
  async login({ commit, rootState }, password) {

    const ipAddress = rootState.parameters.ipAddress;

    const user = {
      "username": rootState.parameters.username,
      "password": password
    };

    console.log(user);

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*"
    }

    commit("SET_LOGIN_STATUS", false);

    const response = await axios.post('https://' + ipAddress + '/api/authenticate', user, { headers: headers });
    commit("SET_TOKEN", response.data.token);
    commit("SET_LOGIN_STATUS", true);
    console.log("token: " + response.data.token);

  },

  logout({ commit }) {

    commit("SET_LOGIN_STATUS", false);
    commit("SET_TOKEN", 0);

  },

  async getProgramName({ commit, rootState }) {
    const ipAddress = rootState.parameters.ipAddress;

    const headers = {
      "Authorization": "Bearer"
    }

    try {
      const response = await axios.get('https://' + ipAddress + '/api/programs?page=1&size=1', { headers: headers });
      commit("SET_PROGRAM_NAME", response.data[0].name);
      commit("SET_DRIVE_ID", response.data[0].driveId);

    } catch (error) {
      if (error.response) { console.log(error.response.status); }
    }
  },

  async updateProgram({ commit, rootState }) {
    const ipAddress = rootState.parameters.ipAddress;

    const headers = {
      "Authorization": "Bearer " + state.token,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }

    if (state.token == 0) {
      return Promise.reject("User login required.");
    }

    const response = await axios.get('https://' + ipAddress + '/api/programs/active', { headers: headers });
    console.log(response.data);

    if (response.data == null) {
      return Promise.reject("Program activation required.");
    }

    commit("SET_PROGRAM_DATA", JSON.stringify(response.data));


    let program = response.data;

    let _vel = rootState.parameters.velocity;
    let _accel = rootState.parameters.acceleration;
    let _maxForce = rootState.parameters.maxForce;
    let _cycleTime = 60.0 / rootState.parameters.respirationRate;

    let _i = rootState.parameters.inspirationValue;
    let _e = rootState.parameters.expirationValue;

    let _startPosition = Number(rootState.parameters.startPosition) + Number(rootState.parameters.startPositionOffset);

    let _maxStroke = rootState.parameters.endPosition - _startPosition;
    let _stroke = _maxStroke * (rootState.parameters.compressionFactor / 100.0);

    let _moveTime = -1;
    if (_stroke < _vel * _vel / _accel) {
      _moveTime = 2.0 * Math.sqrt(_stroke / _accel);
    } else {
      _moveTime = _stroke / _vel + _vel / _accel;
    }

    let _delayTotal = _cycleTime - 2.0 * _moveTime;

    let _delay_1 = Math.round(1000.0 * _delayTotal * _i / (_i + _e));
    let _delay_2 = Math.round(1000.0 * _delayTotal * _e / (_i + _e) - rootState.parameters.compensation);

    if (_delay_1 < 0 || _delay_2 < 0) {
      return Promise.reject("Inconsistent parameterization.");
    }

    //Step 1: Positioning to fully extended position (bag compressed)
    program.functions[0].parameters[1].value = _vel;
    program.functions[0].parameters[2].value = _accel;
    program.functions[0].parameters[3].value = _maxForce;
    program.functions[0].parameters[4].value = _startPosition + _stroke;

    //Step 2: Delay
    program.functions[1].parameters[0].value = _delay_1;

    //Step 3: Postioning to retracted position
    program.functions[2].parameters[1].value = _vel;
    program.functions[2].parameters[2].value = _accel;
    program.functions[2].parameters[3].value = _maxForce;
    program.functions[2].parameters[4].value = _startPosition;

    //Step 3: Delay with output (Ausgang setzen)
    program.functions[3].parameters[2].value = _delay_2;

    await axios.put('https://' + ipAddress + '/api/programs?keepLastModifiedDate=false', JSON.stringify(program), { headers: headers });

    await axios.put('https://' + ipAddress + '/api/programs/' + program.id, JSON.stringify(program), { headers: headers });
  },
  resetRespirationRate({ commit }) {
    setTimeout(()=> {
      commit('SET_RESPIRATION_RATE');
   }, 5000);
  }
};

const getters = {
  ProcessStatus(state) {
    var processStatus;

    if (!state.driveConnected) {
      processStatus = "Drive not connected";

    } else if (state.errorID > 0) {
      processStatus = "Error";

    } else if (state.parameterMode) {
      processStatus = "Parameter mode active";

    } else if (!state.powerOn) {
      processStatus = "Power required";

    } else if (!state.referenceSet) {
      processStatus = "Reference not set";

    } else if (state.program.active) {
      processStatus = "Running";

    } else {
      processStatus = "Ready";
    }

    return processStatus;
  }



};


export default {
  state,
  mutations,
  getters,
  actions

}