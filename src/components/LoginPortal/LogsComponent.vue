<script>
// import axios from 'axios'
import $ from 'jquery'
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

import Header from './_HeaderComponent.vue'
import Sidebar from './_SidebarComponent.vue'
import Auth from './_AuthComponent.vue'
import cryptoMixin from '../../mixins/crypto';
import LogsMixin from '../../mixins/logsConfigurations';

export default {
    name: 'LogsComponent',
    el: "#logs",
    data(){
      return{
      data: null,
      message: null,
      logsData: [],
      user: this.$session.get('user'),
      auth: this.$session.get('auth'),
    }
  },
  mixins:[LogsMixin, cryptoMixin],
  methods:{
    renderLogs: function(data){
      $("#datatable").DataTable({
            data: data,
            destroy: true,
            scrollY: "300px",
            scrollX: true,
            scrollCollapse: true,
            // fixedColumns: true,
            columns: [
              {data: 'id'},
              {
                data: 'dated',
                render: function (data, type, row){
                  var tmp= new Date(data);
                  // tmp = tmp.getHours()+":"+tmp.getMinutes()+":"+tmp.getSeconds()+"&nbsp;&nbsp;&nbsp; ("+tmp.getDate()+"/"+tmp.getMonth()+"/"+tmp.getFullYear()+")";
                  type;
                  row;
             
                return tmp.toLocaleString();
                }
              },
              {data: 'logger'},
              {data: 'level'},
              {data: 'message'},
            ],
            order: [[0, 'desc']],
          });
    },
    showlogs: async function(){
      await this.logs();
      this.logsData = this.$session.get('logs');
      this.renderLogs(this.logsData);     
    }
    // getLogs: function(){
    // var api = "http://localhost:8082/logs";
    // axios
    //   .get(api,{
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Access-Control-Allow-Origin': "*",
    //         'Authorization': this.auth
    //     }
    //   }
    //   ,{})
    //     .then(response => {
    //       console.log("All Logs")
    //       console.warn("Response",response);
    //       console.warn(response.data);
    //       response.data = JSON.parse(this.decrypt(response.data));
    //       console.error(response.data);
    //       this.data = response.data;
    //       // var i=0;
    //       // var j=0;
    //       this.renderLogs(this.data);
          
    //     })
    //     .catch(error => {
    //       console.log(this.decrypt(error))
    //       if(error.response.status == 403)
    //         this.message = "Access Denied!";
    //       else
    //         this.message = error;
    //     })
    // },
  },
  components:{
    Header,Sidebar, Auth
  },
  beforeMount(){
    this.showlogs()
  },
  mounted(){
  }
}


</script>

<template>
  <span id="logs">
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
                  <i class="fa fa-list-alt"></i>
                </span> Logs
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <table id="datatable" class="table" ref="dTable" style="width:0%;">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Dated</th>
                          <th>Logger</th>
                          <th>Level</th>
                          <th>Message</th>
                        </tr>
                      </thead>
                      <tbody>
                    </tbody>
                    </table>
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
