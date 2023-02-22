import axios from "axios";

export default axios.create({
  // baseURL: "http://192.168.30.107:9000/",
  // headers: {
  //   "Content-Type": "application/json",
  //   // "Access-Control-Allow-Origin": "*",
  //   //"Authorization": "Basic "+window.btoa(this.$session.get("username")+":"+this.$session.get("password"))
  // }
  baseURL: "http://localhost:9000/",
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    //"Authorization": "Basic "+window.btoa(this.$session.get("username")+":"+this.$session.get("password"))
  }
});
