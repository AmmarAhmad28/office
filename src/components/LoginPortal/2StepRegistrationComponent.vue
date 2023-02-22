<script>
import axios from 'axios'
import Header from './_HeaderComponent.vue'
import Sidebar from './_SidebarComponent.vue'
import VeroficationerMixin from '../../mixins/2StepVerificationer'
import VueQRCodeComponent from 'vue-qrcode-component'
// import customTheme from '@/plugins/themes'


export default {
    name: '2StepRegistrationComponent',
    data(){
      return{
      qrString: null,
      data: null,
      secret: null,
      copyLabel: "Copy"
    }
  },
  mixins:[VeroficationerMixin],
  methods:{
    getSecretKey: function(){
      var api = "http://localhost:8082/authenticator/authenticatorString";    
      axios
          .post(api,{},{
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': this.auth
          },
          params:{
            username: this.user.username,
            email: this.user.email
          }
      })
          .then(response => {
            this.data = response.data;
            if(this.data.code == 200){
              this.qrString = this.data.generatedString;
              let params = new URLSearchParams(this.qrString.split("?")[1]);
              this.secret = params.get('secret');
            }
          })
          .catch(error => {
            console.error(error);
            this.message = error;
          })
    },
    verifyOTP: function(isEnable){
      var result = this.verify();
      result
        .then(e => {
          e;
          this.securitySwitcher(isEnable);
            })
            .catch(err => {
              console.error(err)
            })
    },
    securitySwitcher: function(isEnable){
      var api = "http://localhost:8082/user/security";    
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
                    isEnable: isEnable
                  }    
                })
              .then(response => {
                if(response.status == 200){
                  this.message = response.data.message;
                }
              })
              .catch(error => {
                console.log(error);
                this.message = error;
              })
    },
    copy: function(){
      var elm = document.getElementById("key");
      navigator.clipboard.writeText(elm.value);
      document.getElementById("copyBtn").style.backgroundColor = "#c5cae9";
      this.copyLabel = "Copied!";
    /////alert("Copied div content to clipboard");
    }
  },
  components:{
    Header,Sidebar,VueQRCodeComponent
  },
  beforeMount(){
    this.getSecretKey();
  },
  mounted(){
    // this.$vuetify.theme.themes.light = customTheme.theme2;
  }

}
</script>

<template>
  <span id="2StepRegistrationComponent"> 
    <div class="container-scroller">
      <Header />
      <div class="container-fluid page-body-wrapper">
        <Sidebar />
        <div class="main-panel">
          <div class="content-wrapper">
            <div class="page-header">
              <h3 class="page-title">
                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                  <i class="fas fa-shield-alt"></i>
                </span> 2-Step Registration
              </h3> 
            </div>
            <v-alert
                elevation="2"
                dismissible
                dense
                border="left"
                type="info"
                v-if="message"
                >{{message}}</v-alert>
            <v-row v-if="(user.isTwoFactorEnabled === 'false')">
              <v-col md="6">
                <v-card>
                  <v-card-title class="justify-center">Using QR Code</v-card-title>
                  <v-card-text class="text-center">
                        <VueQRCodeComponent :text="qrString" size="100" style="display:inline-block;"/><br/>
                        &nbsp;<span class="label label-primary">Scan me</span>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col md="6" sm="12">
                <v-card height="100%">
                  <v-card-title class="justify-center">Using Setup Key</v-card-title>
                  <v-card-text class="text-center">
                        <div class="input-group input-group-sm mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Key</span>
                          </div>
                          <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" v-model="secret" id="key" disabled>
                          <v-tooltip bottom color="#b66dff">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                v-bind="attrs"
                                v-on="on" 
                                id="copyBtn" 
                                v-on:click="copy()" 
                                class="white--text"
                                style="background: #b66dff;outline: none;border: none;height: 2.5rem;">
                                <i class="fa fa-copy"></i>
                              </v-btn>
                              </template>
                              <span>{{ copyLabel }}</span>
                          </v-tooltip>
                        </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="(user.isTwoFactorEnabled === 'false')">
              <v-col md="6" sm="12">
                <v-card>
                  <v-card-text class="card-body">
                    <div class="input-group input-group-sm mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Enter Code</span>
                      </div>
                      <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" v-model="inputOtp" placeholder="Code" maxlength="6">
                      <v-btn type="button" v-on:click="verifyOTP(true)" color="#b66dff" class="white--text" style="height:2.5rem;">Enable</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="!(user.isTwoFactorEnabled === 'false')">
              <v-col md="6">
                <v-card>
                  <v-card-text class="text-center">
                    <div class="input-group input-group-sm mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Enter Code</span>
                      </div>
                      <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" v-model="inputOtp" placeholder="Code" maxlength="6">
                      <v-btn class="white--text" color="#b66dff" v-on:click="verifyOTP(false)" style="height:2.5rem;">Disable</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
<style>
.label {
    display: inline;
    padding: 0.2em 0.6em 0.3em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
}
.label-primary {
    background-color: #337ab7;
}
.top{
  position: relative;
  top: 0;
}
</style>
