<script>
import axios from 'axios'
import cryptoMixin from '../../mixins/crypto';
export default {
    name: "_AuthComponent",
    el: "#Auth",
    data(){
        return{
            roles: null,
            user: this.$session.get('user'),
            authority: this.$session.get('authority')
        }
    },
    mixins: [cryptoMixin],
    methods:{
    getAuthorities: function(){
        var api = "http://localhost:8082/role/roles";
        axios
        .get(api,{
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Authorization': this.$session.get('auth')
            }
        }
        ,{})
            .then(response => {
            console.log("Roles")
            response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
            console.log(response.data);
           this.$session.set("roles",response.data);
            })
            .catch(error => {
            console.log(error)
            })
        },
        validateAuthentication: function(){
            this.roles = this.$session.get("roles");
            var allRoles = [];
            this.roles.forEach(element =>{
                allRoles.push(element.role);
            });
            var onlyAdmin = allRoles.toString().includes("ADMIN")?"ROLE_ADMIN":null;
           
            
            
            
            console.log("Allow Roles ",allRoles.toString());
            const allowedPaths = [
                {path: '/dashboard', authority: allRoles.toString()},
                {path: '/users', authority: onlyAdmin},
                {path: '/employees', authority: allRoles.toString()},
                {path: '/departments', authority: allRoles.toString()},
                {path: '/logs', authority: onlyAdmin},
                {path: '/roles', authority: onlyAdmin},
                {path: '/2stepRegistration', authority: allRoles.toString()},
                ]
                if(this.user === undefined){
                this.$router.push('/');
                }
                else{
                console.log("This user have the following role:");
                console.log(this.authority);
                var isAllowed = false;
                allowedPaths.forEach(element => {
                    if(element.path == window.location.pathname){
                    var authorities = element.authority.split(",");
                    authorities.forEach(authority =>{
                        if(this.authority.authority == authority){
                        isAllowed = true;
                        }
                    });
                    }
                });
                if(isAllowed == false){
                    alert("Your are not allowed to this site.");
                    history.back();
                }
            }
        },
        
    },
    beforeMount(){
        
    },
    mounted(){
        this.getAuthorities();
        this.validateAuthentication();
    }
}
</script>
<template>
    <span id="Auth"></span>
</template>