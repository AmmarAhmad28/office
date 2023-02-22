import axios from 'axios'
export default{
    data(){
        return{
        
        }
    },
    methods:{
        sendMail: function(mail){
            var api = "http://localhost:8084/mail";
            axios 
                  .post(api, mail,
                  {
                    headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                  },
              })
                  .then(response => {
                    console.log(response);
                    document.querySelector("#message").innerHTML = '<div class="alert alert-info">'+response.data.message+'</div>';
                  })
                  .catch(error => {
                    console.log(error);
                  })

        }
        
        
    }
}