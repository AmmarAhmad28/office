<script>
import axios from 'axios'
// import $ from 'jquery'
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

import cryptoMixin from '../../mixins/crypto';

export default {
    name: 'HMackClient',
    el: "#Hmac",
    data(){
      return{
      merchantId: null,
      body: null,
      message: null,
      singedString: null,
      splitter: ";"
    }
  },
  mixins: [cryptoMixin],
  methods:{
   send: function(){
    var api = "http://localhost:8080/verifySign";
    this.singedString = this.encrypt(this.merchantId+this.splitter+this.body+this.splitter+Date.now());
    console.log("Calling API:",api);
    console.log("Singed String:", this.singedString);
    axios 
          .post(api, this.body,
          {
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'x-public-key': this.merchantId,
            'x-singed-value': this.singedString
          },
      })
          .then(response => {
            console.log(response.data);
            this.message = response.data;
          })
          .catch(error => {
            console.log(error);
            this.message = error.response.data;
          })
   }
  },
  components:{
  },

}


</script>

<template>
  <span id="Hmac">     
    <center>
      <h1>HMac Client</h1>
      <div class="alert alert-info" v-if="message">{{message}}</div>
      <table>
        <tr>
          <td>Merchant ID:</td>
          <td><input type="number" v-model="merchantId" placeholder="Enter Merchant Id" required/></td>
        </tr>
        <tr>
          <td>Body:</td>
          <td><textarea type="number" v-model="body" cols="30" rows="9" placeholder="Enter Merchant Id" required /></td>
        </tr>
        <tr>
          <td style="text-align: center;" colspan="2"><button v-on:click="send()" class="btn btn-primary">Send</button></td>
        </tr>
      </table>
    </center>
  </span>
</template>
