<script>
import axios from 'axios'
export default {
    name: 'PersonalInfo',
    data(){
      return{
      firstName: 'Saad',
      lastName: 'Munir',
      email: 'saadmunirmunir86@gmail.com',
      gender: 'Male',
      phoneNo: '0334-8206221',
      designation: 'Software Develoiper',
      city: 'Lahore',
      dob: '2022-03-25',
      country: 'Pakistan',
      age: 0,
      data: null,
      education: [
        {
          level: 'Metric',
          start: '2015',
          end: '2017',
          location: 'Lahore'
        },
        {
          level: 'Intermidiate (ICS)',
          start: '2017',
          end: '2019',
          location: 'Lahore'
        },
        {
          level: 'BSSE',
          start: '2019',
          end: '2023',
          location: 'Lahore'
        }
      ],
      experience: [
        { job: '3 Month Internship in Php' },
        { job: 'Now internship in Conect Dot Net' }
      ],
      skills: [
        {
          language: 'C++',
          rating: '8/10'
        },
        {
          language: 'C#',
          rating: '5/10'
        },
        {
          language: 'HTML',
          rating: '8/10'
        },
        {
          language: 'CSS',
          rating: '6/10'
        },
        {
          language: 'JS',
          rating: '5/10'
        },
        {
          language: 'Visual Basic',
          rating: '7/10'
        },
        {
          language: 'SQL',
          rating: '7/10'
        },
        {
          language: 'Java',
          rating: '8/10'
        }
      ],
      projectInfo: 'University Group Chatting System'
    }
  },
  methods:{
        myAge:function(){
            var d = (new Date().getFullYear - new Date(this.dob).getFullYear);
            console.log(d);
            return d;
        },
        getEmployees:async function(){
          await axios
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
          })
        }
        
    },
    computed:{
        fullname: {
        get: function(){
            return this.firstName+ " "+this.lastName;
        },
        set: function(name){
          var fname = name.split(" ");
          this.firstName = fname[0];
          this.lastName = fname[1]
        }
      }
    },
    watch:{
      dob: function(val){
        var dateOfBirth = new Date(val);
        var currentDate = Date.now();
        var ageDifMs = currentDate - dateOfBirth.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var d = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        console.log(d);
        this.age = d;
      },
      age: function(){
       
      }
    }
  }
</script>

<template>
  <span id="personalInfo" style="text-align:left;">
  <link type="text/css" rel="stylesheet" href="https://www.dropbox.com/s/trsldt0me90jzs8/resume.css"/>
      <div id="header">
        <h1>{{firstName}} {{lastName}}</h1>
         <h4>{{designation}}</h4>      
              <p>{{city}}, {{country}}</p>
              <p>{{phoneNo}}</p>
      </div>
           
      <div class="education">
                  <h3>EDUCATION</h3>
                  <p>
                  <ul>
                      <li v-for="academic in education" v-bind:key="academic">{{academic.level}}<br>
                        {{academic.start}}-{{academic.end}}<br>
                      Location : {{academic.location}}</li>
                      <li v-for="rec in data" v-bind:key="rec">{{rec}}<br>
                       </li>
                  </ul>
                  </p>
                  <h3>Professional Experience</h3>
                  <li v-for="exp in experience" v-bind:key="exp">
                    {{exp.job}}
                  </li>
                  
                  <h3>Skills</h3>
                  <p>
                  <ul>
                    <li v-for="skill in skills" v-bind:key="skill">
                      {{skill.language}} - <span style="color: burlywood;">{{skill.rating}}</span>
                    </li>
                  </ul>
                  </p>
                
      
                  <h3>Personal Information:</h3>
                  <p>
                  <ul>
                      <li>
                      A young, determined hard and smart working person. I believe in task based roles and complete ownership of work.
                      </li>
                      <li><span id="course-name">Languages Known:</span>English and Urdu</li>
                      
                       </ul>
                  </p>
                  
                  <h3>Project</h3>
                  <p>
                      {{projectInfo}}
                  </p>
                  <p>
                     <button v-on:click="getEmployees">Click</button>
                  </p>
                
        </div>
        <div>
          <h3>For Updation</h3>
          <p><input v-model="fullname" /></p>
          <p><input v-model="projectInfo" /></p>
          <p><input v-model="dob" /></p>
          <p><input v-model="age" /></p>
        </div>
      </span>
</template>
