
const state = {
    ipAddress: "192.168.0.1",
    username: "admin",
    
    count: 0,
    threshold: 10000,

    velocity: 150,
    acceleration: 500,
    inspirationValue: 1,
    expirationValue: 2,
    compressionFactor: 100,
    respirationRate: 10,
    bagType: 0,
    startPositionOffset: 0,
    startPosition: 40,
    endPosition: 145,
    compensation: 100,
    maxForce: 50,

    pressure_alarm_hi: 37,
    pressure_warning_hi: 34,
    pressure_alarm_lo: 3,
    pressure_alarm_debounce: 2000,
    pressure_scaling: 1,
  
    firstName: "John",
    lastName: "Doe",
    age: 45,
    weight: 75,
    height: 180,
    sex: "Male"
    
};

const mutations = {
    setValue(state, payload) {
        state[payload.name] = payload.value;
 
        console.log(state);
    },
    initialiseStore(state){
        if(localStorage.getItem('params')){
            console.log(JSON.parse(localStorage.getItem('params')));
            Object.assign(state, JSON.parse(localStorage.getItem('params')));
        }
    },
    saveStore(state){
        localStorage.setItem('params', JSON.stringify(state));
        console.log(JSON.stringify(state));
    },
    savePatientData(state) {
        if (localStorage.getItem('params')) {
            const s = JSON.parse(localStorage.getItem('params'));
            const { firstName, lastName, age, weight, height, sex } = state;

            Object.assign(s, { firstName, lastName, age, weight, height, sex });

            localStorage.setItem('params', JSON.stringify(s));
        } else {
            localStorage.setItem('params', JSON.stringify(state));
            console.log(JSON.stringify(state));
        }
    },
    incrementCounter(state) {
        state.count += 1;

        if (localStorage.getItem('params')) {
            const s = JSON.parse(localStorage.getItem('params'));
            const { count } = state;

            Object.assign(s, { count });

            localStorage.setItem('params', JSON.stringify(s));
        }
    },
    resetCounter(state) {
        state.count = 0;

        if (localStorage.getItem('params')) {
            const s = JSON.parse(localStorage.getItem('params'));
            const { count } = state;

            Object.assign(s, { count });

            localStorage.setItem('params', JSON.stringify(s));
        }
    }
   
    
};

const actions = {
    action_setValue: ({ commit }, payload) => {
        commit('setValue', payload)
        console.log("action called ", payload);
    },
    action_saveStore:  ({ commit }) => {
        commit('saveStore')
        console.log("action saveStore called ");
    }

};

const getters = {
    TidalVolume(state) {

        let x = state.compressionFactor;
        

        switch (state.bagType) {
            case 0:   // Ambu Spur II Adult
                return Math.max(0, 0.0714*x**2 + 4.0859*x - 26.933);  //tidal volumn calculation determined empirically.  See report Greg Filek "HMI modifications ased on new BVM holder" 6/12/2020; values updated 6/19/2020
    
            case 1:    // Laerdal Bag II Adult
                return Math.max(0, 0.0704*x**2 + 5.319*x - 35.406);
    
            default:
                return 0.0;  
        }        

    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
