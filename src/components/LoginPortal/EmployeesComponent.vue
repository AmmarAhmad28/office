<script>
import axios from 'axios'
export default {
    name: 'EmployeesComponent',
    el: "EmployeesComponent",
    
    data(){
      return{
      data: null,
      index: null,
      message: "",
      employee:{
        id: null,
        name: null,
        email: null,
        password: null,
        salary: null,
        department: {
          id: 0
        }
      }
    }
  },
  methods:{
    formShow:function(isUpdate, index){
      var saveForm = document.querySelector('#saveForm');
      var updateForm = document.querySelector('#updateForm');
      if(isUpdate){
        saveForm.style.display = "none";
        updateForm.style.display = "block";
      }
      else{
        updateForm.style.display = "none";
        saveForm.style.display = "block";
      }
      
      this.index = index;
      console.log("Inside form Show isUpdate: "+isUpdate);
      if(isUpdate == true){
        this.employee.id = this.data[index].id;
        this.employee.name = this.data[index].name;
        this.employee.email = this.data[index].email;
        this.employee.password = this.data[index].password;
        this.employee.salary = this.data[index].salary;
        this.employee.department.id = this.data[index].department.id;
      }
      else{
        this.employee.id = 0;
        this.employee.name = null;
        this.employee.email = null;
        this.employee.password = null;
        this.employee.salary = 0;
        this.employee.department.id = 0;
      }
    },
    saveEmployee:function(isUpdate){
      if(isUpdate == false){
      var api = "http://localhost:8081/employee/save";
      console.log("Calling API: "+api);
      console.log(this.employee.department.id);
      axios
          .put(api,{
            name: this.employee.name,
            email: this.employee.email,
            password: this.employee.password,
            salary: this.employee.salary,
            department: {
              id: this.employee.department.id
            }
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        }
        })
          .then(response => {
            console.log(response.data);
            this.message = "Record Inserted!";
            this.show();
          })
          .catch(error => {
            console.log(error)
            this.message = "Record not Inserted!";
          })
        }
        else{
          api = "http://localhost:8081/employee/update";
          console.log("Calling API: "+api);
          console.log(this.employee.department.id);
          axios
              .put(api,{
                id: this.employee.id,
                name: this.employee.name,
                email: this.employee.email,
                password: this.employee.password,
                salary: this.employee.salary,
                department: {
                  id: this.employee.department.id
                }
            },
            {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*"
            }
            })
              .then(response => {
                console.log(response.data);
                this.message = "Record Updated!";
                this.show();
              })
              .catch(error => {
                console.log(error)
                this.message = "Record not Updated!";
              })
        }
    },
    deleteEmployee:function(id){
      var api = "http://localhost:8081/employee/delete/"+id;
      console.log("Calling API: "+api);
    
      axios
          .get(api,{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        }})
          .then(response => {
            console.log(response.data);
            this.message = "Record deleted!";
            this.show();
          })
          .catch(error => {
            console.log(error);
            this.message = "Record not deleted!";
          })
    },
    show:function(){
      axios
          .get('http://localhost:8081/employee/get',{
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        }})
          .then(response => {
            console.log(response.data);
            this.data = response.data;
          })
          .catch(error => {
            console.log(error)
            alert(error);
            this.message = error;
          })
          console.log("Debugging");
          console.log(this.message);
    }
  },
  beforeMount(){
          this.show();
    }
  }
</script>
<style>
  .message{
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
    position: relative;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
  }
</style>

<template>
  <div id="EmployeesComponent" style="text-align: center;">
    {{data.data}}
    <h1>Employee Records</h1>
    <div class="message">
      {{message}}
    </div>
      
    
    <p><button v-on:click="formShow(false, 0)">Insert</button></p>
    <p id="saveForm" style="display: none;">
      <input v-model="employee.name" placeholder="Name"/> <input v-model="employee.email" placeholder="Email"/>
      <input v-model="employee.password" placeholder="Password"/><br>
      <input v-model="employee.salary" placeholder="Salary"/> <input v-model="employee.department.id" placeholder="Department ID"/><br>
      <button v-on:click="saveEmployee(false)">Save</button>

    </p>
    <p id="updateForm" style="display: none;">
      <input v-model="employee.id" placeholder="ID" disabled/>
      <input v-model="employee.name" placeholder="Name"/> <input v-model="employee.email" placeholder="Email"/>
      <input v-model="employee.password" placeholder="Password"/><br>
      <input v-model="employee.salary" placeholder="Salary"/> <input v-model="employee.department.id" placeholder="Department ID"/><br>
      <button v-on:click="saveEmployee(true)">Save</button>

    </p>
    <table border="3" style="width:100%;">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Password</th>
        <th>Salary</th>
        <th>Actions</th>
      </tr>
      <tr v-for="(rec, index) in data" v-bind:key="rec">
        <td>{{rec.id}}</td>
        <td>{{rec.name}}</td>
        <td>{{rec.email}}</td>
        <td>{{rec.password}}</td>
        <td>{{rec.salary}}</td>
        <td>
          <button v-on:click="deleteEmployee(rec.id)">Delete</button>&nbsp;
          <button v-on:click="formShow(true, index)">Update</button>
        </td>
      </tr>
    </table>
  </div>
</template>
