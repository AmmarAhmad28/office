<script>
import axios from 'axios'
import cryptoMixin from '../../mixins/crypto';
import MailMixin from '../../mixins/emailSender';
export default {
    name: 'RegisterComponent',
    data(){
      return{
      data: null,
      message: null,
      username: null,
      password: null,
      email: null,
      auth: "Basic YWRtaW46MTIz"
    }
  },
  mixins:[cryptoMixin,MailMixin],
  methods:{
    //This function is doing some validations on the User's input after that it will register the new User
    validate: function(){
      if(this.username == "" || this.username == null || this.username == " ")
        this.message = "Username is required!";
      else if(this.email == "" || this.email == null || this.email == " ")
        this.message = "Email is required!";
      else if(this.password == "" || this.password == null || this.password == " ")
        this.message = "Password is required!";
      else{
        this.message = "Registering ...";
        var api = "http://localhost:8082/user/save";
          axios
            .put(api,{}
            ,{
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              },
              params: {
                username: this.encrypt(this.username),
                enabled: this.encrypt(true+""),
                password: this.encrypt(this.password),
                authority: this.encrypt("USER"),
                email: this.encrypt(this.email)
              }  
            })
              .then(response => {
                response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                console.log(this.message);
                console.log(response.data);
                if(response.data){
                  var mail = {
                    to: this.email,
                    subject: "Account Created",
                    body: "<h1>Welcome! "+this.username+"</h1>Your account is successfully created!",
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
      }
    }
  },
  mounted(){
    this.$root.$on('register', (username, email, password) => {
            this.username = username;
            this.email = email;
            this.password = password;
            this.validate();
        });
  }
}
</script>

<template>
  <span id="register">     
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row flex-grow">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-left p-5">
                <div class="alert alert-info" v-if="message">{{message}}</div>
                <h4>New here?</h4>
                <h6 class="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                  <div class="form-group">
                    <input type="text" name="username" class="form-control form-control-lg" v-model="username" placeholder="Username">
                  </div>
                  <div class="form-group">
                    <input type="email" name="email" class="form-control form-control-lg" v-model="email" placeholder="Email">
                  </div>
                  <div class="form-group">
                    <input type="password" name="password" class="form-control form-control-lg" v-model="password" placeholder="Password">
                  </div>

                  <div class="mt-3">
                    <button name="submit" class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" v-on:click="validate">SIGN UP</button>
                  </div>
                  <div class="text-center mt-4 font-weight-light"> Already have an account? <router-link to="/" class="text-primary">Login</router-link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
