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
    name: 'RolesComponent',
    el: "#roles",
    data(){
      return{
      data: null,
      message: null,
      dialogMessage: null,
      role: null,
      permissions: null,
      id: null,
      isUpdate: false,
      obj: {},
      user: this.$session.get('user'),
      auth: this.$session.get('auth'),
      updateAllowed: false,
      delAllowed: false,
      writeAllowed: false
    }
  },
  mixins:[cryptoMixin],
  methods:{
    //This function will get all the roles from the DB
    getRoles: function(){
    var api = "http://localhost:8082/role/roles";
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
          console.log("All Roles")
          response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
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
              {data: 'role'},
              {data: 'permissions'},
              {
                data: 'id',
                render: function (data, type, row){
                  var tmp= '';
                  //If Current User have the permission to update then this will render
                  if(updateAllowed){
                    tmp += '<button class="btn btn-info" onClick="document.getElementById(\'update\').dataset.index='+(j++)+';document.getElementById(\'update\').click()">Update</button>';
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
          console.log(this.decrypt(error))
          if(error.response.status == 403)
            this.message = "Access Denied!";
          else
            this.message = error;
        })
    },
    //This function will delete the role against the provided id
    deleteRole:function(id){
      var api = "http://localhost:8082/role/delete";
      console.log("Calling API: "+api);
    
      axios
          .post(api,{},
          {
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': this.auth
          },
          params:{
            id: this.encrypt(id+"")
          }
        })
          .then(response => {
            //response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
            console.log(response.data);
            this.message = "Role deleted!";
            this.getRoles();
          })
          .catch(error => {
            console.log(this.decrypt(error));
            if(error.response.status == 403)
              this.message = "Access Denied!";
            else
              this.message = "Role not deleted!";
          })
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
        //This function will will extract the info of role and save them in fields agains the v-modle mapping
    update: function(index){
      this.role = this.data[index].role.split("_")[1];
      this.id = this.data[index].id;
      this.isUpdate = true;
      this.permissions = this.data[index].permissions.split(",");
      var checkedPermissions = document.getElementsByName("permissions");
      for(var i=0; i<checkedPermissions.length; i++){
        if(this.permissions.includes(checkedPermissions[i].value))
          checkedPermissions[i].checked = true;
      }
      document.querySelector("#showModel").click();
    },
    //This function is responsible for saving and updations of the role, It also applies some checks on them to
    //protect against invalid data insertion
    save: function(){
      var checkedPermissions = document.getElementsByName("permissions");
      var allowedPermissions = [];
      checkedPermissions.forEach(element=>{
        if(element.checked){
          allowedPermissions.push(element.value);
        }
      });
      this.permissions = allowedPermissions.toString();
      
      if(this.role == "" || this.role == null || this.role == " " || !this.role.match(/^[A-Za-z]+$/))
        this.dialogMessage = "Role is invalid!";
      else{
        if(this.isUpdate == false){
        this.dialogMessage = "Registering ...";
        var api = "http://localhost:8082/role/create";
          axios
            .put(api,{}
            ,{
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              },
              params: {
                role: this.encrypt("ROLE_"+this.role.toUpperCase()),
                permissions: this.encrypt(this.permissions)
              }  
            })
              .then(response => {
                console.log(this.message);
                response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                console.log(response.data);
                if(response.data){
                  this.dialogMessage = "Role created successfully!";
                  this.role = null;
                  this.getRoles();
                }
                else
                this.dialogMessage = "Role not created successfully!";
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
            api = "http://localhost:8082/role/update";
            console.log("Calling API: "+api);
            
            axios
            .put(api,{}
            ,{
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              },
              params: {
                id: this.encrypt(this.id+""),
                role: this.encrypt("ROLE_"+this.role.toUpperCase()),
                permissions: this.encrypt(this.permissions)
              }  
            })
                .then(response => {
                  response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                  console.log(response.data);
                  this.dialogMessage = "Role Updated!";
                  this.role = null;
                  this.id = null;
                  var checkedPermissions = document.getElementsByName("permissions");
                  checkedPermissions.forEach(element=>{
                    if(element.checked){
                      element.checked = false;
                    }
                  });
                  this.getRoles();
                })
                .catch(error => {
                  console.log(this.decrypt(error))
                  if(error.response.status == 403)
                    this.dialogMessage = "Access Denied!";
                  else
                    this.dialogMessage = "Role not Updated!";
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
              this.deleteRole(this.data[selectedRec[i].value].id);
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
      this.role = null;
      this.id = null;
      var checkedPermissions = document.getElementsByName("permissions");
      checkedPermissions.forEach(element=>{
        if(element.checked){
          element.checked = false;
        }
      });
    }
  },
  components:{
    Header,Sidebar, Auth
  },
  beforeMount(){
    this.getRoles();
  },
  mounted(){
    this.getPermission();
  },
}


</script>

<template>
  <span id="roles"> 
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
                  <i class="fa fa-warning"></i>
                </span> Roles
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <p>
                    <!-- Button trigger modal -->
                      <button type="button" class="btn btn-primary" id="showModel" data-toggle="modal" data-target="#exampleModal" v-if="this.writeAllowed == true" v-on:focus="insertSettings">
                        Add Role
                      </button>&nbsp;
                      <button class="btn btn-danger" v-on:click="action(true)" v-if="this.delAllowed == true">Delete</button>&nbsp;
                      <button class="btn btn-info" id="update" v-on:click="action(false)" data-index="" hidden>Update</button>
                    </p>
                    <div class="alert alert-info" v-if="message">{{message}}</div>
                    <table id="datatable" class="table" ref="dTable">
                      <thead>
                        <tr>
                          <th><input type="checkbox" name="selectRec" v-on:click="selectAll"></th>
                          <th>ID</th>
                          <th>Role</th>
                          <th>Permissions</th>
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
                          <h5 class="modal-title" id="exampleModalLabel">Role Info</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="alert alert-info" v-if="dialogMessage">{{dialogMessage}}</div>
                          <div class="form-group">
                            <input type="text" name="role" class="form-control form-control-lg" v-model="role" placeholder="Role">
                          </div>
                          <div class="form-check">
                            <input name="permissions" class="form-check-input" type="checkbox" value="GET" id="get">
                            <label class="form-check-label" for="get">
                              GET
                            </label>
                          </div>
                          <div class="form-check">
                            <input name="permissions" class="form-check-input" type="checkbox" value="POST" id="post">
                            <label class="form-check-label" for="post">
                              POST
                            </label>
                          </div>
                          <div class="form-check">
                            <input name="permissions" class="form-check-input" type="checkbox" value="DELETE" id="DELETE">
                            <label class="form-check-label" for="DELETE">
                              DELETE
                            </label>
                          </div>
                          <div class="form-check">
                            <input name="permissions" class="form-check-input" type="checkbox" value="PUT" id="PUT">
                            <label class="form-check-label" for="PUT">
                              PUT
                            </label>
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
