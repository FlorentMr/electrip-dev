const axios = require('axios');

const state = {
    trajects: [
        //{ brand: 'Renault', model: 'Zoé', years: '2019', matriculationNbr: 'XC-24D6-FD', autonomy: '120' },
    ],
    origin: null,
    destination: null,
    originName: null,
    destinationName: null,
    calendarOverlay: false,
    date: null,
    carOverlay: false,
    carId: null,
};

const getters = {
    getTrajects: state => state.cars,
    getOrigin: state => state.origin,
    getDestination: state => state.destination,
    getOriginName: state => state.originName,
    getDestinationName: state => state.destinationName,
    getCalendarOverlay: state => state.calendarOverlay,
    getCarOverlay: state => state.carOverlay,
};

const actions = {
    /*async fetchTrajects({commit},userId){
        /*const response = await axios.get({
            method: 'GET',
            url: 'http://localhost:3000/cars',
            headers: {
                'Authorization': token
            },
            data: {
                userId: userId
            },
        });
        const response = await axios.get('http://localhost:5555/trajects/user/'+userId);
        console.log("Trajects : "+response.data);
        commit('setTrajects',response.data);
    },*/
    async addtraject({commit},userId){
        const url = 'https://api.mapbox.com/directions/v5/'+
            'mapbox/driving/'+
            state.origin+';'+state.destination+
            '?overview=full&'+
            'annotations=distance&'+
            'geometries=geojson&'+
            'steps=true&'+
            'banner_instructions=true&'+
            'language=fr&'+
            'access_token=pk.eyJ1IjoibWF4aGFzaCIsImEiOiJja2h5dXRoajAwOGpnMnlvaDh1bTEwMDY4In0.k8O0vTEqjd0t6WHOHiS_8A'
        const infos = await axios.get(url);
        const waypoints = infos.data.waypoints.length;
        const origin = state.originName.split(',')[0];
        const destination = state.destinationName.split(',')[0];
        const label = origin+" -> "+destination;
        console.log(infos);
        const payload = {
            name: label,
            startCoord: infos.data.waypoints[0].location,
            startName: infos.data.waypoints[0].name != "" ? infos.data.waypoints[0].name : origin,
            endCoord: infos.data.waypoints[waypoints-1].location,
            endName: infos.data.waypoints[waypoints-1].name != "" ? infos.data.waypoints[waypoints-1].name : destination,
            userId: userId,
            distance: infos.data.routes[0].distance,
            date: state.date,
            carId: state.carId,
            //coordinates: infos.data.routes[0].geometry.coordinates,
        }
        console.log(payload);
        const trajet = await axios.post('http://localhost:5555/trajects/create',payload);
        console.log(trajet);
        commit('newTraject',trajet.data);
    }
};

const mutations = {
    setTrajects: (state, trajects) => state.trajects = trajects,
    setDestination: (state, destination) => state.destination = destination,
    setOrigin: (state, origin) => state.origin = origin,
    setDate: (state, date) => state.date = date,
    setOriginName: (state, originName) => state.originName = originName,
    setDestinationName: (state, destinationName) => state.destinationName = destinationName,
    newTraject: (state, traject) => {
        state.trajects.push(traject)
        state.origin = null;
        state.destination = null;
        state.date = null;
        state.calendarOverlay = false;
        state.originName = null;
        state.destinationName = null;
        state.carId = null;
    },
    invertCalendarOverlay: state => state.calendarOverlay=!state.calendarOverlay,
    invertCarOverlay: state => state.carOverlay=!state.carOverlay,
    setCar: (state, carId) => state.carId = carId,
};

export default {
    state,
    getters,
    actions,
    mutations,
}