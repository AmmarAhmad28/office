<script>
//import axios from 'axios'
import Header from './_HeaderComponent.vue'
import Sidebar from './_SidebarComponent.vue'
import Auth from './_AuthComponent.vue'


export default {
    name: 'DashboardComponent',
    data(){
      return{
      data: null,
      message: null,
      user: this.$session.get('user'),
      authority: this.$session.get('authority'),
      auth: this.$session.get('auth'),
    }
  },
  methods:{
    
  },
  components:{
    Header,Sidebar, Auth
  },
  mounted(){
  }

}
</script>

<template>
  <span id="dashboard"> 
    <Auth />  
    
    <div class="container-scroller">
      <Header />
      <div class="container-fluid page-body-wrapper">
        <Sidebar />
        <div class="main-panel">
          <div class="content-wrapper">
            <div class="page-header">
              <h3 class="page-title">
                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                  <i class="fa fa-dashboard"></i>
                </span> Dashboard
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <h1>{{user.username}},</h1>
                    <h2>&nbsp;&nbsp;&nbsp;&nbsp;Welcome to the Dashboard!</h2>
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
