import axios from 'axios'
export default{
    data(){
        return{
        }
    },
    methods:{
      authenticate: function(method){
      if(method == "HMac"){
        console.log("Here");
      }
      else if(method == "Token"){
        var user = {
          username: 'ammar',
          password: '123'
        }
          var api = "http://localhost:8080/authenticate";    
          axios
            .post(api,{
              username: user.username,
              password: user.password
              }
              ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*"
                }
              })
            .then(response => {
              var data = response.data;
              if(data.code == 200){
                this.$session.set('authToken', data.token);
              }
            })
            .catch(error => {
              console.error("Authorization Error: "+error);
            })
        }
      
      }
    },
}