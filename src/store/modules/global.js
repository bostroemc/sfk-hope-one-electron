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

  pressure: {
    value: 0,
    maximum: 0,
    minimum: 0,
    warning: false,
    alarm: false,
    scaling: 1  //temporary value
  },

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
      if (Object.prototype.hasOwnProperty.call(obj.subscription, "force")) {
        state.pressure.value = state.pressure.scaling * obj.subscription.force;

        if (state.pressure.value > state.pressure.maximum) {
          state.pressure.maximum = state.pressure.value;
        }
        if (state.pressure.value < state.pressure.minimum) {
          state.pressure.minimum = state.pressure.value;
        }
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
  },
  SET_PRESSURE_MAXMIN(state) {
    state.pressure.maximum = state.pressure.value;
    state.pressure.minimum = state.pressure.value;
  },
  SET_PRESSURE_ALARM(state, value) {
    state.pressure.alarm = value;
  },
  SET_PRESSURE_WARNING(state, value) {
    state.pressure.warning = value;
  },
  
  //temp
  SET_PRESSURE_SCALING(state, value) {
    state.pressure.scaling = value;
    console.log("scaling: " + state.pressure.scaling);
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

    let _vel = 1.0 * rootState.parameters.velocity;
    let _accel = 1.0 * rootState.parameters.acceleration;
    let _maxForce = rootState.parameters.maxForce;
    let _cycleTime = 60.0 / rootState.parameters.respirationRate;

    let _i = rootState.parameters.inspirationValue;
    let _e = rootState.parameters.expirationValue;

    let _time_i = _cycleTime * _i / (_i + _e);
    let _time_e = _cycleTime * _e / (_i + _e);

    let _startPosition = Number(rootState.parameters.startPosition) + Number(rootState.parameters.startPositionOffset);

    let _maxStroke = rootState.parameters.endPosition - _startPosition;
    let _stroke = _maxStroke * (rootState.parameters.compressionFactor / 100.0);

    let _delay = 0.25; //inspiration delay fixed at 250 ms
    let _moveTime_i = _time_i - _delay ;
    let _moveTime_e = _i < _e ? _moveTime_i : _time_e - _delay;

    let _v_i = moveTime(_stroke, _vel, _accel, _moveTime_i);
    let _v_e = moveTime(_stroke, _vel, _accel, _moveTime_e);

    if (_v_i == 0 || _v_e == 0) {
      return Promise.reject("Inconsistent parameterization.");
    }

    //Step 1: Positioning to fully extended position (bag compressed)
    program.functions[0].parameters[1].value = _v_i;
    program.functions[0].parameters[2].value = _accel;
    program.functions[0].parameters[3].value = _maxForce;
    program.functions[0].parameters[4].value = _startPosition + _stroke;

    //Step 2: Delay
    program.functions[1].parameters[0].value = Math.round(1000.0 * (_time_i - _moveTime_i));

    //Step 3: Postioning to retracted position
    program.functions[2].parameters[1].value = _v_e;
    program.functions[2].parameters[2].value = _accel;
    program.functions[2].parameters[3].value = _maxForce;
    program.functions[2].parameters[4].value = _startPosition;

    //Step 3: Delay
    program.functions[3].parameters[0].value = Math.round(1000.0 * (_time_e - _moveTime_e) - rootState.parameters.compensation);

    await axios.put('https://' + ipAddress + '/api/programs?keepLastModifiedDate=false', JSON.stringify(program), { headers: headers });

    await axios.put('https://' + ipAddress + '/api/programs/' + program.id, JSON.stringify(program), { headers: headers });
  },

  resetRespirationRate({ commit }) {
    setTimeout(()=> {
      commit('SET_RESPIRATION_RATE');
   }, 5000);
  },

  setPressureAlarm({ commit }, value) {
    commit('SET_PRESSURE_ALARM', value);
  },

  setPressureWarning({ commit }, value) {
    commit('SET_PRESSURE_WARNING', value);
  },  

  //temporary
  setPressureScaling({ commit, rootState }) {
  commit('SET_PRESSURE_SCALING', rootState.parameters.pressure_scaling);
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
  },

  ErrorStatus(state, getters, rootState) {
    var errorStatus = "OK";

    let error = state.errorID % 0x100000;

    if (error == 0xe2019) {
      errorStatus = "Warning, motor overtemperature shutdown";

    } else if (error == 0xe2021) {
      errorStatus =  "Motor temperature outside of measuring range";

    } else if (error == 0xe2028) {
      errorStatus =  "Warning, motor temperature monitor defective";

    } else if (error == 0xf2019) {
      errorStatus =  "Motor temperature shutdown";

    } else if (error == 0xf2020) {
      errorStatus =  "Motor temperature monitor defective";

    } else if (error == 0xf2028) {
      errorStatus =  "Excessive deviation";

    } else if (error == 0xf4034) {
      errorStatus =  "Loss of power";  

    } else if (error == 0xf8027) {
      errorStatus =  "Emergency stop active";

    } else if (error != 0x0000){
      errorStatus =  "See Rexroth documentation for more information.";
  
    } else if (state.pressure.alarm){
      errorStatus =  "Alarm: Pressure out of range";

    } else if (state.pressure.warning){
      errorStatus =  "Warning: Pressure nearing range limit";

    } else if (rootState.parameters.count >= rootState.parameters.threshold){
      errorStatus =  "Warning: cycle count threshold reached";
    }

    return errorStatus;
  },

  IsError(state, getters, rootState) {  //Summation of error condtions; used to trigger the red bar in the top banner
    var isError = false;

    if (state.errorID != 0x0000) {
      isError = true;

    } else if (state.pressure.alarm){
      isError =  true;

    } else if (state.pressure.warning){
      isError =  true;

    } else if (rootState.parameters.count >= rootState.parameters.threshold){
      isError =  true;
    }

    return isError;
  }
};

function moveTime (distance, velocity, acceleration, t) {      // Determine velocity=v required to move load distance in time t using given value of acceleration.  Maximum velocity=velocity, jerk-unbounded
  let v = 0;

  if (distance<0 || velocity<0 || acceleration<0 || t<=0) {    // Incorrect parameterization
      return v;
  }
 
  if (acceleration < 4.0 * distance / (t*t)) {                 // Accelation is too restrictive to move load given distance in time t; return 0
      return v;
  }

  let tau_max = Math.min(t - distance/velocity, t/2.0);
  let tau_min = t/2.0 - Math.sqrt(t*t/4.0 - distance/acceleration);

  if (tau_max < tau_min) {                                    // Invalid input; return 0
      return v;
  }

  let tau = tau_min + 0.0 * (tau_max - tau_min);              // Always use shape factor 0;
  v = acceleration * tau;

  return v;                                                   
}

export default {
  state,
  mutations,
  getters,
  actions

}