import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX);

// const allowedPaths = [
//     {path: '/dashboard', authority: 'USER, ADMIN'},
//     {path: '/users', authority: 'ADMIN'},
// ]

export default new VueX.Store({
    state:{
        authorizationToken: null,
        isAuthenticated: false,
        user: null,
        authority: null,
    },
    mutations:{
        SET_AUTHENTICATION(state, payload){
            state.isAuthenticated = payload;
        },
        GET_AUTHENTICATION(state){
            return state.isAuthenticated;
        },
        SET_USER(state, payload){
            return state.user = payload;
        },
        VALIDATE_AUTHENTICATION(state){
            if(!state.isAuthenticated)
                this.$router.push('/');
        },
        IS_PATH_ALLOWED(state){
            
            // var user = ;
            // alert(user);
            state;
        }
    },
    actions:{
        validateAuthentication({commit}){
            commit('VALIDATE_AUTHENTICATION');
        },
        setAuthentication({commit}, payload){
            commit('SET_AUTHENTICATION', payload);
        },
        setUser({commit}, payload){
            commit('SET_USER', payload);
        },
        getAuthentication({commit}){
           return commit('GET_AUTHENTICATION');
        },
        isPathAllowed({commit}){
            commit('IS_PATH_ALLOWED');
        }
    }
})