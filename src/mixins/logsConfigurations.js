import axios from 'axios'
import authMixin from '../mixins/authorization';
export default{
    data(){
        return{
          method: 'Token'
        }
    },
    mixins:[authMixin],
    methods:{
      logs: async function(){
        var api = "http://localhost:8080/logs";
        var authToken = this.$session.get('authToken');
        axios
          .get(api,{
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                'Authorization': "Bearer "+authToken
            }
          }
          ,{})
            .then(response => {
              this.logsData = response.data;
              this.$session.set('logs', response.data);
            })
            .catch(error => {
                console.error("Logs Error: "+error);
            })
       }
    },
    beforeMount(){
      this.authenticate(this.method);
    }
}