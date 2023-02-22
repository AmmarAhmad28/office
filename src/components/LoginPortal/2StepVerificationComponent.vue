<script>
import VeroficationerMixin from '../../mixins/2StepVerificationer'
export default {
    name: 'twoStepVerificationComponent',
    el: "#twoStepVerificationComponent",
    data(){
      return{
      
    }
  },
  mixins:[VeroficationerMixin],
  methods:{
    verifyOTP: function(){
      var result = this.verify();
      result
        .then(e => {
          e;
          this.$router.push("/dashboard");
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  components:{
  },
  beforeMount(){
    
  },
  mounted(){
   
  }
}
</script>

<template>
  <span id="twoStepVerificationComponent">    
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row flex-grow">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-left p-5">
                <div class="alert alert-info" v-if="message">{{message}}</div>
                <h3 align="center">2-Step Verification</h3>
                  <div class="form-group">
                    <input type="text" name="inputOtp" class="form-control form-control-lg" placeholder="Code" v-model="inputOtp" required="" maxlength="6">
                  </div>
                  <div class="mt-3">
                    <button class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" v-on:click="verifyOTP">Verify</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
