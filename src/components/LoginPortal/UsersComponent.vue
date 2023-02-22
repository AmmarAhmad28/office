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
    name: 'UsersComponent',
    el: "#users",
    data(){
      return{
      data: null,
      message: null,
      dialogMessage: null,
      username: null,
      email: null,
      password: null,
      isUpdate: false,
      authority: null,
      role: null,
      obj: {},
      user: this.$session.get('user'),
      auth: this.$session.get('auth'),
      updateAllowed: false,
      delAllowed: false,
      writeAllowed: false
    }
  },
  mixins: [cryptoMixin],
  methods:{
    //This function will get all the Users from the DB
    getUsers: function(){
    var api = "http://localhost:8082/user/getUsers";
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
          console.log("All Users")
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
                data: 'username',
                render: function (data, type, row){
                  var tmp= '';
                  tmp += '<input type="checkbox" name="selectRec" value="'+(i++)+'" />';
                  type;
                  row;
             
                return tmp;
          }
            },
              {data: 'username'},
              {data: 'email'},
              {data: 'isEnabled'},
              {
                data: 'username',
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
    //This function is used to get the Authority against the provided username
    getAuthority: function(username){
    var api = "http://localhost:8082/user/authority";
    axios
      .post(api,{},{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Authorization': this.auth
        },
        params:{
          username: this.encrypt(username)
        }
      })
        .then(response => {
          console.log("Authority")
          response.data = JSON.parse(this.decrypt(response.data).replaceAll("'","\""));
          console.log(response.data);
          this.role = response.data.authority;
        })
        .catch(error => {
          console.log(this.decrypt(error))
          if(error.response.status == 403)
            this.message = "Access Denied!";
          else
            this.message = error;
        })
    },
    //This function is used to get all the authorities from the DB so that we can rended the SELECT tag
    getAuthorities: function(){
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
          console.log("Authorities")
          response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
          console.log(response.data);
          this.authority = response.data;
        })
        .catch(error => {
          console.log(this.decrypt(error))
          if(error.response.status == 403)
            this.message = "Access Denied!";
          else
            this.message = error;
        })
    },
    //This function will delete the User against the provided username
    deleteUser:function(username){
      var api = "http://localhost:8082/user/deleteUser";
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
              username: this.encrypt(username)
            }
          })
          .then(response => {
            console.log(response.data);
            this.message = "User deleted!";
            this.getUsers();
          })
          .catch(error => {
            console.log(error);
            if(error.response.status == 403)
              this.message = "Access Denied!";
            else
              this.message = "User not deleted!";
          })
    }, 
    //This function will will extract the info of user and save them in fields agains the v-modle mapping
    update: function(index){
      this.username = this.data[index].username;
      this.email = this.data[index].email;
      this.password = this.data[index].password;
      this.getAuthority(this.username);
      this.isUpdate = true;
      document.querySelector("#showModel").click();
    },
    //This function is responsible for saving and updations of the user, It also applies some checks on them to
    //protect against invalid data insertion
    save: function(){
      var usernameValidationPattern = /^[A-Za-z]+$/;
      if(this.username == "" || this.username == null || this.username == " " || !this.username.match(usernameValidationPattern))
        this.dialogMessage = "Username is invalid!";
      else if(this.email == "" || this.email == null || this.email == " ")
        this.dialogMessage = "Email is required!";
      else if(this.password == "" || this.password == null || this.password == " ")
        this.dialogMessage = "Password is required!";
      else{
        if(this.isUpdate == false){
        this.dialogMessage = "Registering ...";
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
                authority: this.encrypt(this.role.split("_")[1]),
                email: this.encrypt(this.email)
              }  
            })
              .then(response => {
                console.log(this.message);
                response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                console.log(response.data);
                if(response.data){
                  this.dialogMessage = "Account created successfully!";
                  this.username = null;
                  this.email = null;
                  this.password = null;
                  this.role = null;
                  this.getUsers();
                }
                else
                this.dialogMessage = "Account not created successfully!";
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
            api = "http://localhost:8082/user/updateUser";
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
                username: this.encrypt(this.username),
                enabled: this.encrypt(true+""),
                password: this.encrypt(this.password),
                authority: this.encrypt(this.role.split("_")[1]),
                email: this.encrypt(this.email)
              }  
            })
                .then(response => {
                  response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                  console.log(response.data);
                  this.dialogMessage = "Record Updated!";
                  this.username = null;
                  this.email = null;
                  this.password = null;
                  this.getUsers();
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
              this.deleteUser(this.data[selectedRec[i].value].username);
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
      this.username = null;
      this.email = null;
      this.password = null;
      this.role = null;
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
    Header,Sidebar, Auth
  },
  beforeMount(){
    this.getUsers();
  },
  mounted(){
    this.getAuthorities();
    this.getPermission();
  },
}


</script>

<template>
  <span id="users"> 
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
                  <i class="fa fa-user"></i>
                </span> Users
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <p>
                    <!-- Button trigger modal -->
                      <button type="button" class="btn btn-primary" id="showModel" data-toggle="modal" data-target="#exampleModal" v-if="this.writeAllowed == true" v-on:focus="insertSettings">
                        Add User
                      </button>&nbsp;
                      <button class="btn btn-danger" v-on:click="action(true)" v-if="this.delAllowed == true">Delete</button>&nbsp;
                      <button class="btn btn-info" id="update" v-on:click="action(false)" data-index="" hidden>Update</button>
                    </p>
                    <div class="alert alert-info" v-if="message">{{message}}</div>
                    <table id="datatable" class="table" ref="dTable">
                      <thead>
                        <tr>
                          <th><input type="checkbox" name="selectRec" v-on:click="selectAll"></th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Enabled</th>
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
                          <h5 class="modal-title" id="exampleModalLabel">User Info</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="alert alert-info" v-if="dialogMessage">{{dialogMessage}}</div>
                          <div class="form-group">
                            <input type="text" name="username" class="form-control form-control-lg" v-model="username" placeholder="Username">
                          </div>
                          <div class="form-group">
                            <input type="email" name="email" class="form-control form-control-lg" v-model="email" placeholder="Email">
                          </div>
                          <div class="form-group">
                            <input type="password" name="password" class="form-control form-control-lg" v-model="password" placeholder="Password">
                          </div>
                          <div class="form-group">
                            <input type="text" name="role" class="form-control form-control-lg" v-model="role" disabled>
                          </div>
                          <div class="form-group">
                            <select v-model="role" class="form-select">
                              <option v-for="a in authority" v-bind:key="a">
                                {{ a.role }}
                              </option>
                            </select>
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
