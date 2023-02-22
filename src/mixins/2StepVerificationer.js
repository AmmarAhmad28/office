import axios from 'axios'
export default{
    data(){
        return{
            inputOtp: null,
            message: null,
            user: this.$session.get('user'),
            auth: this.$session.get('auth'),
        }
    },
    methods:{
        verify: function(){
          const myPromise = new Promise((resolve, reject) => {
            var api = "http://localhost:8082/authenticator/validateOtp";
            if(this.inputOtp === null || this.inputOtp == "" || this.inputOtp == " " || this.inputOtp.length > 6 || this.inputOtp.length < 6 || !this.inputOtp.match(/^[0-9]+$/)){
              this.message = "Invalid OTP!";   
              return; 
            }
            axios
                .post(api,{}
                  ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': this.auth
                    },
                    params: {
                      username: this.user.username,
                      otp: this.inputOtp
                    }    
                  })
                .then(response => {
                  if(response.status == 200){
                    this.message = response.data.message;
                    resolve(true);
                  }
                })
                .catch(error => {
                  console.error(error);
                  this.message = "Invalid OTP!";
                  reject(false);
                })
          })
          return myPromise;
          }
    }
}