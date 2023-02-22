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
    name: 'EmployeeComponent',
    el: "#employees",
    data(){
      return{
      data: null,
      message: null,
      dialogMessage: null,
      id: null,
      name: null,
      email: null,
      salary: null,
      deptId: null,
      department: null,
      password: null,
      allDept: null,
      isUpdate: false,
      user: this.$session.get('user'),
      auth: this.$session.get('auth'),
      updateAllowed: false,
      delAllowed: false,
      writeAllowed: false
    }
  },
  mixins:[cryptoMixin],
  methods:{
    //This function will get all the employees from the DB
    getEmployees: function(){
    var api = "http://localhost:8082/employee/get";
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
          console.log("All Employees")
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
              {data: 'id'},
              {data: 'name'},
              {data: 'email'},
              {data: 'salary'},
              {
                data: 'department.name',
                defaultContent: '---'
              },
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
          //Decryption and JSON parsing applied
          response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
          console.log(response.data);
          this.allDept = response.data;
        })
        .catch(error => {
          console.log(this.decrypt(error))
          if(error.response.status == 403)
            this.message = "Access Denied!";
          else
            this.message = error;
        })
    },
    //This function will delete the Employee against the provided empId
    deleteEmployee:function(id){
      var api = "http://localhost:8082/employee/delete";
      console.log("Calling API: "+api);
    
      axios
          .post(api,{},{
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
            response.data = this.decrypt(response.data).replaceAll("'", "\"");
            console.log(response.data);
            this.message = "Employee deleted!";
            this.getEmployees();
          })
          .catch(error => {
            console.log(this.decrypt(error));
            if(error.response.status == 403)
              this.message = "Access Denied!";
            else
              this.message = "Employee not deleted!";
          })
    }, 
    //This function will will extract the info of employee and save them in fields agains the v-modle mapping
    update: function(index){
      this.name = this.data[index].name;
      this.email = this.data[index].email;
      this.password = this.data[index].password;
      this.id = this.data[index].id;
      this.salary = this.data[index].salary;
      this.deptId = this.data[index].department.id;
      this.department = this.data[index].department.name;
      console.log(this.department);
      this.isUpdate = true;
      document.querySelector("#showModel").click();
    },
    //This function is responsible for saving and updations of the employee, It also applies some checks on them to
    //protect against invalid data insertion
    save: function(){
      var usernameValidationPattern = /^[A-Za-z A-Za-z]+$/;
      this.salary += "";
      if(!this.name.match(usernameValidationPattern))
        this.dialogMessage = "Name is invalid!";
      else if(this.email == "" || this.email == null || this.email == " ")
        this.dialogMessage = "Email is required!";
      else if(this.password == "" || this.password == null || this.password == " ")
        this.dialogMessage = "Password is required!";
      else if(this.salary == "" || this.salary == null || this.salary == " " || !this.salary.match(/[0-9]/)){
        this.dialogMessage = "Salary is invalid!";}
      else if(this.deptId == "" || this.deptId == null || this.deptId == " ")
        this.dialogMessage = "Department is invalid!";
      else{
        if(this.isUpdate == false){
        this.dialogMessage = "Registering ...";
        var api = "http://localhost:8082/employee/save";
          axios
            .put(api,this.encrypt(JSON.stringify({
                id: 0,
                name: this.name,
                email: this.email,
                password: this.password,
                salary: this.salary,
                department: {
                  id: this.deptId
                }
            }))
            ,{
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              }  
            })
              .then(response => {
                response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                console.log(this.message);
                console.log(response.data);
                if(response.data.id != 0){
                  this.dialogMessage = "Employee created successfully!";
                  this.id = null;
                  this.name = null;
                  this.password = null;
                  this.email = null;
                  this.salary = null;
                  this.department = null;
                  this.deptId = null;
                  this.getEmployees();
                }
                else
                this.dialogMessage = "Employee not created successfully, Duplication of Email occur.";
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
            api = "http://localhost:8082/employee/update";
            console.log("Calling API: "+api);
            
            axios
            .put(api,this.encrypt(JSON.stringify({
                id: this.id,
                name: this.name,
                email: this.email,
                password: this.password,
                salary: this.salary,
                department: {
                  id: this.deptId
                }
            }))
            ,{
              headers: {
                  'Content-Type': 'text/plain',
                  'Access-Control-Allow-Origin': "*",
                  'Authorization': this.auth
              }
            })
                .then(response => {
                  response.data = JSON.parse(this.decrypt(response.data).replaceAll("'", "\""));
                  console.log(response.data);
                  this.dialogMessage = "Record Updated!";
                  this.id = null;
                  this.name = null;
                  this.password = null;
                  this.email = null;
                  this.salary = null;
                  this.department = null;
                  this.deptId = null;
                  this.getEmployees();
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
              this.deleteEmployee(this.data[selectedRec[i].value].id);
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
      this.password = null;
      this.email = null;
      this.salary = null;
      this.department = null;
      this.deptId = null;
    },
    messages: function(){
      alert("Sye");
    }
  },
  components:{
    Header,Sidebar, Auth
  },
  beforeMount(){
    
  },
  mounted(){
    this.getEmployees();
    this.getDepartments();
    this.getPermission();
  },
}


</script>

<template>
  <span id="employees"> 
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
                  <i class="fa fa-group"></i>
                </span> Employees
              </h3>
            </div>
            <div class="row">
              <div class="col-md-12 stretch-card grid-margin">
                <div class="card">
                  <div class="card-body">
                    <p>
                      <!-- Button trigger modal -->
                      <button type="button" class="btn btn-primary" id="showModel" data-toggle="modal" data-target="#exampleModal" v-if="this.writeAllowed == true" v-on:focus="insertSettings">
                        Add Employee
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
                          <th>Name</th>
                          <th>Email</th>
                          <th>Salary</th>
                          <th>Department</th>
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
                          <h5 class="modal-title" id="exampleModalLabel">Employee Info</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div class="alert alert-info" v-if="dialogMessage">{{dialogMessage}}</div>
                          <div class="form-group">
                            <input type="text" name="name" class="form-control form-control-lg" v-model="name" placeholder="Name">
                          </div>
                          <div class="form-group">
                            <input type="email" name="email" class="form-control form-control-lg" v-model="email" placeholder="Email">
                          </div>
                          <div class="form-group">
                            <input type="password" name="password" class="form-control form-control-lg" v-model="password" placeholder="Password">
                          </div>
                          <div class="form-group">
                            <input type="text" name="salary" class="form-control form-control-lg" v-model="salary" placeholder="Salary">
                          </div>
                          <div class="form-group">
                            <select name="department" class="form-control form-control-lg" v-model="deptId" placeholder="Department">
                              <option v-for="dept in allDept" v-bind:key="dept" :value="dept.id">{{dept.name}}</option>
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
