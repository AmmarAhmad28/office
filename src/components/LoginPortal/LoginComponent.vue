<script>
import axios from 'axios'
import GoogleLogin from 'vue-google-login';
import {gapi} from 'gapi-script'
import cryptoMixin from '../../mixins/crypto';
import MailMixin from '../../mixins/emailSender';
gapi;

export default {
    name: 'LoginComponent',
    el: "#login",
    data(){
      return{
      data: null,
      message: null,
      username: null,
      password: null,
      authority: null,
      user: null,
      params: {
        client_id: '772773595480-1b5lppo03ef6tbm84m09jmvquil1pha9.apps.googleusercontent.com',
      }
    }
  },
  mixins:[cryptoMixin,MailMixin],
  methods:{
    getAuth: function(){
      return this.$store.state.authorizationToken;
    },
    setAuth: function(token){
      this.$store.state.authorizationToken = token;
    },
    getAuthority: function(username){
    var api = "http://localhost:8082/user/authority";
    axios
      .get(api,{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': "*",
            'Authorization': this.getAuth()
        },
        params:{
          "username": this.encrypt(username)
        }
      },{}
      )
        .then(response => {
          console.log("Authority")
          response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
          console.log(response.data);
          this.authority = response.data;
        })
        .catch(error => {
          console.log(this.decrypt(error))
          this.message = error;
        })
    },
    isTwoStepVerificationEnabled: function(){
      var user = this.$session.get('user');
      console.warn(user)
      if(!(user.isTwoFactorEnabled === 'false')){
        return true;
      }
      return false;
    },
    //This function will validate the user against their cridentials and sets some values in their session
    //It also redirects the user to the dashboard if the cridentials are valid
    validateUser: function(){
      var api = "http://localhost:8082/user/getUsers";
      console.log("Calling API", api);
    axios
      .get(api,{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': "Basic YWRtaW46MTIz"
        }
      }
      ,{})
        .then(response => {
          console.log("All Users")
          response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
          console.log(response.data);
          this.data = response.data;
          this.$store.state.authorizationToken = "Basic "+window.btoa(this.username+":"+this.password);
          this.$session.set('auth', this.getAuth());
          var isUsernameValid = false;
          this.data.forEach(element => {
            //Here validating the user's password with their encrypted password
            if(element.username == this.username){
              this.getAuthority(this.username);
              isUsernameValid = true;
              var api = "http://localhost:8082/user/validate";
              axios
                .get(api,{
                  headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': "*",
                      'Authorization': "Basic YWRtaW46MTIz"
                  },
                  params: {
                    "encodedPassword": this.encrypt(element.password),
                    "password": this.encrypt(this.password)
                  }             
                }
                ,{})
                  .then(response => {
                    console.log("Validating Password")
                    if(response.data){
                      this.$session.start();
                      this.$session.set('user', element);
                      this.$session.set('authority', this.authority);
                      this.$session.set('auth', this.getAuth());
                      console.warn(this.authority);
                      // this.$store.dispatch('setAuthentication', true);
                      // this.$store.dispatch('setUser', element);
                      //console.warn(this.$session.get('redirect'));
                      if(this.$session.get('redirect'))
                      {
                        this.$router.push(this.$session.get('redirect'));
                        return;
                      }
                      if(!this.isTwoStepVerificationEnabled())
                        this.$router.push("/home");
                      else
                        this.$router.push("/2stepVerification");
                    }
                    else
                      this.message = "Invalid Password!";
                  })
                  .catch(error => {
                    console.log(error)
                    this.message = error;
                  })
            }
          });
          if(isUsernameValid == false)
            this.message = "Invalid Username!";
        })
        .catch(error => {
          console.log(error)
          this.message = "Invalid Username Or Password!";
        })
    },
    //This function is called when a user attempts to sign-in from the Oauth 2.0, This function will register
    //them into DB so that their proper session management happens
    register: function(username, email, password){
        this.message = "Registering ...";
        var api = "http://localhost:8082/user/save";
          axios
            .put(api,{}
            ,{
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': "Basic YWRtaW46MTIz"
              },
              params: {
                username: this.encrypt(username),
                enabled: this.encrypt(true+""),
                password: this.encrypt(password),
                authority: this.encrypt("USER"),
                email: this.encrypt(email)
              }  
            })
              .then(response => {
                response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                console.log(this.message);
                console.log(response.data);
                if(response.data){
                var mail = {
                  to: email,
                  subject: "Account Created",
                  body: "<h1>Welcome! "+username+"</h1>Your account is successfully created!",
                  method: 'DEFAULT'
                }
                this.sendMail(mail);
                  this.message = "Account created successfully!";
                }
                else
                this.message = "Account not created successfully!";
              })
              .catch(error => {
                console.log(this.decrypt(error))
                this.message = error;
              })
    },
    //This function will be called when the User is successfully signed in from the Google
    onSuccess(googleUser) {
      console.log('googleUser', googleUser);
      var email = googleUser.wt.cu;
      this.setAuth("Basic "+window.btoa(email+":"+email));
      this.register(email, email, email);
      

      var user = {
        email: email,
        username: email,
        enabled: true,
        password: email
      }
      this.$session.start();
      this.$session.set('user', user);
      var authority = {
        authority: 'ROLE_USER',
        username: email
      }
      this.$session.set('authority', authority);
      
      this.$session.set('auth', this.getAuth());
      if(!this.isTwoStepVerificationEnabled())
        this.$router.push("/dashboard");
      else
        this.$router.push("/2stepVerification");

    },
    onFailure(error) {
      console.log("In error");
      console.log('googleUser', error);
      
    },
    //This function will be called when the User is successfully signed in from the Facebook
    logInWithFacebook: function() {
       this.loadFacebookSDK(document, "script", "facebook-jssdk");
       this.initFacebook();
       window.FB.login(function(response) {
        if (response.authResponse) {
          console.log("Data", response);
          window.FB.api('/me', function(response) {
            console.log('Successful login for: ',response);
            var authority = {
              authority: 'ROLE_USER',
              username: response.id
            }
           var user = {
              email: "no@gmail.com",
              username: response.id,
              enabled: true,
              password: response.id
            }    
           localStorage.setItem('user', JSON.stringify(user))
           localStorage.setItem('authority', JSON.stringify(authority))
              
          });
        } else {
          console.warn("User cancelled login or did not fully authorize.");
        }
      }, 
      {scope: 'public_profile,email'}
      );
    
      this.user = JSON.parse(localStorage.getItem('user'));
      this.authority = JSON.parse(localStorage.getItem('authority'));
      localStorage.removeItem('user');
      localStorage.removeItem('authority')
      this.register(this.user.username, this.user.email, this.user.password);
      this.$session.start();
      this.$session.set('user', this.user);
      this.$session.set('authority', this.authority);
      
      
      this.setAuth("Basic "+window.btoa(this.user.username+":"+this.user.password))
      this.$session.set('auth', this.getAuth());
      if(!this.isTwoStepVerificationEnabled())
        this.$router.push("/dashboard");
      else
        this.$router.push("/2stepVerification");
      return false;
    },
    //This function will initialize the facebook window with the provided appId and other parameters
    async initFacebook() {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: "1310342406446271",
          cookie: true,
          version: "v15.0"
        });
      };
    },

    //This function will render the script the with the following URL
    async loadFacebookSDK(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    },
    fbSettings: function(user, authority){
      console.log('User', user.value);
      console.log("Authority", authority);
    }
  },
  components:{
    GoogleLogin
  },
  beforeMount(){
    
  },
  mounted(){
   
  }
}
</script>

<template>
  <span id="login">    
    <meta name="google-signin-client_id" content="772773595480-1b5lppo03ef6tbm84m09jmvquil1pha9.apps.googleusercontent.com" />
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row flex-grow">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-left p-5">
                <div class="alert alert-info" v-if="message">{{message}}</div>
                <h2 align="center">{{ this.$t("login") }}</h2>
                <h6 class="font-weight-light">{{ this.$t("message") }}</h6>
                  <div class="form-group">
                    <input type="text" name="username" class="form-control form-control-lg" :placeholder="this.$t('usernamePlaceHolder')" v-model="username" required="">
                  </div>
                  <div class="form-group">
                    <input type="password" name="password" class="form-control form-control-lg" v-model="password" :placeholder="this.$t('passwordPlaceHolder')" required="">
                  </div>
                  <div class="mt-3">
                    <button class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" v-on:click="validateUser">{{ this.$t("loginBtn") }}</button>
                  </div>
                  <div class="text-left mt-4 font-weight-light">
                    {{ this.$t("oauth2Message") }}
                    <div class="text-center">
                      <GoogleLogin :params="params" :onSuccess="onSuccess" :onFailure="onFailure" style="outline: 0px;border: 0;background: transparent;width: 2.3rem;"><img src="../../../public/assets/google.png" class="rounded-circle" style="width: 100%;" /></GoogleLogin>
                      <button class="button"  scope="public_profile,email" @click="logInWithFacebook" style="outline: 0px;border: 0;background: transparent;width: 2.3rem;"><img src="../../../public/assets/facebook.png" class="rounded-circle" style="width: 100%;" /></button>
                    </div>
                  </div>
                  <div class="text-center mt-4 font-weight-light"> {{ this.$t("registerMessage") }} <router-link to="/registerPage" class="text-primary">{{ this.$t("createLabel") }}</router-link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
