import Vue from 'vue'
import VueRouter from 'vue-router';
import VueSession from 'vue-session';
// import { VuejsDatatableFactory } from 'vuejs-datatable';
import App from './App.vue'
import Register from './components/LoginPortal/RegisterComponent.vue';
import Login from './components/LoginPortal/LoginComponent.vue';
import Dashboard from './components/LoginPortal/DashboardComponent.vue';
import Users from './components/LoginPortal/UsersComponent.vue';
import Employee from './components/LoginPortal/EmployeeComponent.vue';
import Department from './components/LoginPortal/DepartmentComponent.vue';
import Logs from './components/LoginPortal/LogsComponent.vue';
import Roles from './components/LoginPortal/RolesComponent.vue';
import HMack from './components/LoginPortal/HmackClientComponent.vue';
import Mail from './components/LoginPortal/MailComponent.vue';
import twoStepRegistration from './components/LoginPortal/2StepRegistrationComponent.vue';
import twoStepVerification from './components/LoginPortal/2StepVerificationComponent.vue';

import store from './store/store.js'
import VueCryptojs from 'vue-cryptojs'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'

import Home from './components/Ecom/Home.vue'
import Layout from './components/Ecom/Layout.vue'
import Product from './components/Ecom/Product.vue'
import Products from './components/Ecom/Products.vue'
import Cart from './components/Ecom/Cart.vue'
import ProfileDropdown from './components/Ecom/ProfileDropdown.vue'
import Checkout from './components/Ecom/Checkout.vue'
import Track from './components/Ecom/Track.vue'
import Orders from './components/Ecom/Orders.vue'
import AddProduct from './components/Ecom/AddProduct.vue'
import ProductAll from './components/Ecom/ProductsAll.vue'

Vue.use(VueCryptojs);
Vue.config.productionTip = false
Vue.use(VueSession);
Vue.use(VueRouter);

const routes = [
  {path: '/registerPage', component: Register},
  {path: '/dashboard', component: Dashboard},
  {path: '/users', component: Users},
  {path: '/employees', component: Employee},
  {path: '/departments', component: Department},
  {path: '/logs', component: Logs},
  {path: '/roles', component: Roles},
  {path: '/hmack', component: HMack},
  {path: '/mail', component: Mail},
  {path: '/2stepRegistration', component: twoStepRegistration},
  {path: '/2stepVerification', component: twoStepVerification},
  {path: '/', component: Login},
  {path: '*', component: Login},
  {path:'/ProfileDropdown', component: ProfileDropdown, name:'ProfileDropdown'},
  {path:'/addProduct', component: AddProduct},
  {path:'/productall', component: ProductAll},


  {
    path: '/layout',
    component: Layout,
    children:[
      {path:'/home', component:Home, name:'Home'},
      {path:'/products/:name', component:Products, name:'Products'},
      {path:'/product/:id', component:Product, name:'Product'},
      {path:'/cart', component:Cart, name:'Cart'},
      {path:'/checkout', component:Checkout, name:'Checkout'},
      {path:'/track', component:Track, name:'Track'},
      {path:'/orders', component:Orders, name:'Orders'}


    ]

  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  i18n,
  store,
  render: h => h(App),
  router,
  vuetify
}).$mount('#app')

