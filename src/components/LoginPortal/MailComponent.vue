<script>
import axios from 'axios'
import Header from './_HeaderComponent.vue'
import Sidebar from './_SidebarComponent.vue'
import MailSender from '../../mixins/emailSender'


export default {
    name: 'MailComponent',
    data(){
      return{
      message: null,
      mail: {
        to: null,
        subject: null,
        body: null,
        method: null
      },
      mailMethods: null
    }
  },
  mixins: [MailSender],
  methods:{
    methods: function(){
      var api = "http://localhost:8084/methods";
        axios
          .get(api,{
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
            }
          }
          ,{})
            .then(response => {
              console.log("Methods",response.data);
              this.mailMethods = response.data;
            })
            .catch(error => {
                console.error("Methods Error: "+error);
                this.message = error;
            })
    },
    send: function(){
      console.log(this.sendMail(this.mail));
      this.reset();
    },
    reset: function(){
      this.mail.to = null;
      this.mail.body = null;
      this.mail.subject = null;
      this.mail.method =  document.querySelector("#method")[0].value;
      this.message = null;
    }
  },
  components:{
    Header,Sidebar
  },
  mounted(){
    this.methods();
  }

}
</script>

<template>
  <span id="mail">   
    
    <div class="container-scroller">
      <Header />
      <div class="container-fluid page-body-wrapper">
        <Sidebar />
        <div class="main-panel">
          <div class="content-wrapper">
            <div class="page-header">
              <h3 class="page-title">
                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                  <i class="fa fa-envelope"></i>
                </span> Mail Sender
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <span id="mailSending">     
                      <div class="container-scroller">
                            <div class="row flex-grow">
                              <div class="col-lg-12 mx-auto">
                                <div class="auth-form-light text-left p-5">
                                  <span id="message"></span>
                                    <div class="form-group">
                                      <input type="email" name="to" class="form-control form-control-lg" v-model="mail.to" placeholder="Reciever Email">
                                    </div>
                                    <div class="form-group">
                                      <input type="text" name="subject" class="form-control form-control-lg" v-model="mail.subject" placeholder="Subject">
                                    </div>
                                    <div class="form-group">
                                      <textarea name="body" class="form-control form-control-lg" v-model="mail.body" placeholder="Body" cols="15" rows="15"></textarea>
                                    </div>
                                    <div class="form-group">
                                      <select class="form-select" v-model="mail.method" id="method">
                                        <option v-for="method in mailMethods" v-bind:key="method" v-value="method">{{method}}</option>
                                      </select>
                                    </div>
                                    <div class="mt-3">
                                      <button name="send" class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" v-on:click="send">Send</button>
                                    </div>
                                </div>
                              </div>
                            </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
