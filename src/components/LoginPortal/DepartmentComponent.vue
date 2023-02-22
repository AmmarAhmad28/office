<script>
import axios from 'axios'
import $ from 'jquery'
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

import Header from './_HeaderComponent.vue'
import Sidebar from './_SidebarComponent.vue'
import Auth from './_AuthComponent.vue'
import cryptoMixin from '../../mixins/crypto';

export default {
    name: 'DepartmentComponent',
    el: "#departments",
    data(){
      return{
      data: null,
      message: null,
      dialogMessage: null,
      id: null,
      name: null,
      isUpdate: false,
      user: this.$session.get('user'),
      auth: this.$session.get('auth'),
      updateAllowed: false,
      delAllowed: false,
      writeAllowed: false
    }
  },
  mixins: [cryptoMixin],
  methods:{
    //This function will get all the departments from the DB
    getDepartments: function(){
    var api = "http://localhost:8082/department/get";
    axios
      .get(api,{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': this.auth
        }
      }
      ,{})
        .then(response => {
          console.log("All Departments")
          response.data = JSON.parse(this.decrypt(response.data));
          console.log(response.data);
          this.data = response.data;
          var i=0;
          var j=0;
          var updateAllowed = this.updateAllowed;
          $("#datatable").DataTable({
            data: this.data,
            destroy: true,
            columns: [
            {
                data: 'id',
                render: function (data, type, row){
                  var tmp= '';
                  tmp += '<input type="checkbox" name="selectRec" value="'+(i++)+'" />';
                  type;
                  row;
             
                return tmp;
          }
            },
              {data: 'id'},
              {data: 'name'},
              {
                data: 'id',
                render: function (data, type, row){
                  var tmp= '';
                  //If Current User have the permission to update then this will render
                  if(updateAllowed){
                  tmp += '<button name="updateBtn" class="btn btn-info" onClick="document.getElementById(\'update\').dataset.index='+(j++)+';document.getElementById(\'update\').click()">Update</button>';
                  type;
                  row;
                  }
             
                return tmp;
          }
              }
            ]
          });
        })
        .catch(error => {
          console.log(error)
          if(error.response.status == 403)
            this.message = "Access Denied!";
          else
            this.message = error;
        })
    },
    //This function will delete the department against the provided deptId
    deleteDepartment:function(id){
      var api = "http://localhost:8082/department/delete";
      console.log("Calling API: "+api);
    
      axios
          .post(api,{}
            ,{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              },
              params: {
                id: this.encrypt(id+"")
              }    
            })
          .then(response => {
            response.data = this.decrypt(response.data);
            console.log(response.data);
            this.message = response.data;
            this.getDepartments();
          })
          .catch(error => {
            console.log(this.decrypt(error));
            if(error.response.status == 403)
              this.message = "Access Denied!";
            else
              this.message = "Department not deleted!";
          })
    }, 
    //This function will will extract the info of department and save them in fields agains the v-modle mapping
    update: function(index){
      this.name = this.data[index].name;
      this.id = this.data[index].id;
      console.log(this.department);
      this.isUpdate = true;
      document.querySelector("#showModel").click();
    },
    //This function is responsible for saving and updations of the department, It also applies some checks on them to
    //protect against invalid data insertion
    save: function(){
      var ValidationPattern = /^[A-Za-z A-Za-z]+$/;
      if(!this.name.match(ValidationPattern))
        this.dialogMessage = "Name is invalid!";
      else{
        if(this.isUpdate == false){
        this.dialogMessage = "Registering ...";
        var api = "http://localhost:8082/department/save";
          axios
            .put(api,this.encrypt(JSON.stringify({
                id: 0,
                name: this.name
            }))
            ,{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              }  
            })
              .then(response => {
                console.log(this.dialogMessage);
                console.log(response.data);
                response.data = this.decrypt(response.data)
                if(response.data != ""){
                  this.dialogMessage = "Department created successfully!";
                  this.id = null;
                  this.name = null;
                  this.getDepartments();
                }
                else
                this.dialogMessage = "Department not created successfully, Duplication of Department Name occur.";
              })
              .catch(error => {
                console.log(this.decrypt(error))
                if(error.response.status == 403)
                  this.dialogMessage = "Access Denied!";
                else
                  this.dialogMessage = error;
              })
          }
          else{
            this.isUpdate = false;
            api = "http://localhost:8082/department/update";
            console.log("Calling API: "+api);
            
            axios
            .put(api,this.encrypt(JSON.stringify({
                id: this.id,
                name: this.name
            }))
            ,{
              headers: {
                  'Content-Type': 'text/plain',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              }
            })
                .then(response => {
                  response.data = this.decrypt(response.data)
                  console.log(response.data);
                  this.dialogMessage = "Record Updated!";
                  this.id = null;
                  this.name = null;
                  this.getDepartments();
                })
                .catch(error => {
                  console.log(this.decrypt(error))
                  if(error.response.status == 403)
                    this.dialogMessage = "Access Denied!";
                  else
                    this.dialogMessage = "Record not Updated!";
                })
          }
      }
    },
    //This function manages the checkboxes of the rows
    selectAll:function(){
      var checkboxes = document.getElementsByName("selectRec");
      for(var i=1; i<checkboxes.length; i++){
        if(checkboxes[0].checked)
          checkboxes[i].checked = true;
        else
          checkboxes[i].checked = false;
      }
    },
    action:function(isDelAction){
      var selectedRec = document.getElementsByName("selectRec");
      var isAnyChecked = false;
      // var isSingleChecked = false;
      // var updateIndex = null;

      if(isDelAction){
        for(var i=1; i<selectedRec.length; i++){
            if(selectedRec[i].checked){
              isAnyChecked = true;
              this.deleteDepartment(this.data[selectedRec[i].value].id);
            }
        }
        if(isAnyChecked == false)
          alert('Kindly select a record to delete.');
      }
      else{
       this.update(document.getElementById("update").dataset.index);
      }
    },
    //This function will do some reseting the fields
    insertSettings:function(){
      this.isUpdate = false;
      this.dialogMessage = null;
      this.id = null;
      this.name = null;
    },
    //This function will get the allowed permissions of the current User against their role
    getPermission: function(){
                var api = "http://localhost:8082/role/role";
                axios
                  .get(api,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': this.auth
                    },
                    params:{
                        "role": this.encrypt(this.$session.get("authority").authority)
                      }
                  }
                  ,{})
                    .then(response => {
                      console.log("Current User Permissions")
                      response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                      console.log(response.data);
                      this.permissions = response.data;
                      this.$session.set("permissions", this.permissions);
                      var p = this.permissions.permissions.split(",");
                      p.forEach(per => {
                          if(per == "PUT"){
                              this.updateAllowed = true;
                              this.writeAllowed = true;
                          }
                          if(per == "POST"){
                            this.delAllowed = true;
                          }
                      });
                    })
                    .catch(error => {
                      console.log(this.decrypt(error))
                    })
        },
  },
  components:{
    Header,Sidebar,Auth
  },
  beforeMount(){
    this.getDepartments();
  },
  mounted(){
    this.getPermission();
    // this.writeAllowed = this.$session.get("isWriteAllowed");
    // this.delAllowed = this.$session.get("isDelAllowed");
  }
}


</script>

<template>
  <span id="departments">     
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
                  <i class="fas fa-building"></i>
                </span> Departments
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <p>
                      <!-- Button trigger modal -->
                      <button type="button" class="btn btn-primary" id="showModel" data-toggle="modal" data-target="#exampleModal" v-if="this.writeAllowed == true" v-on:focus="insertSettings">
                        Add Department
                      </button>&nbsp;
                      <button class="btn btn-danger" v-if="this.delAllowed == true" v-on:click="action(true)">Delete</button>&nbsp;
                      <button class="btn btn-info" id="update" v-on:click="action(false)" data-index="" hidden>Update</button>
                    </p>
                    <div class="alert alert-info" v-if="message">{{message}}</div>
                    <table id="datatable" class="table" ref="dTable">
                      <thead>
                        <tr>
                          <th><input type="checkbox" name="selectRec" v-on:click="selectAll"></th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                    </tbody>
                    </table>
                
                  <!-- Modal -->
                  <div class="modal fade" ref="myModel" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Department Info</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="alert alert-info" v-if="dialogMessage">{{dialogMessage}}</div>
                          <div class="form-group">
                            <input type="text" name="name" class="form-control form-control-lg" v-model="name" placeholder="Department Name">
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" v-on:click="save()">Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
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
