
const state = {
    ipAddress: "192.168.0.1",
    username: "admin",
    
    count: 0,
    threshold: 10000,

    velocity: 50,
    acceleration: 500,
    inspirationValue: 1,
    expirationValue: 2,
    compressionFactor: 100,
    respirationRate: 10,
    bagType: 0,
    startPositionOffset: 0,
    startPosition: 40,
    endPosition: 135,
    compensation: 100,

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
    savePatientData(state){
        const s = JSON.parse(localStorage.getItem('params'));
        const { firstName, lastName, age, weight, height, sex } = state;

        Object.assign(s, { firstName, lastName, age, weight, height, sex });

        localStorage.setItem('params', JSON.stringify(s));
        console.log(state);
    },
    incrementCounter(state){
        state.count += 1;

        const s = JSON.parse(localStorage.getItem('params'));
        const { count } = state;

        Object.assign(s, { count });

        localStorage.setItem('params', JSON.stringify(s));
    },
    resetCounter(state){
        state.count = 0;

        const s = JSON.parse(localStorage.getItem('params'));
        const { count } = state;

        Object.assign(s, { count });

        localStorage.setItem('params', JSON.stringify(s));
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

export default {
    state,
    mutations,
    actions
}

