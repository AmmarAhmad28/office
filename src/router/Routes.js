// import EmployeeComponent from 'C:/Users/T480/vue-demo1/src/components/EmployeesComponent.vue'
// import PersonalComponent from 'C:/Users/T480/vue-demo1/src/components/PersonalInfo.vue'
import emp from './components/EmployeesComponent.vue'

import VueRouter from 'vue-router'



const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {
            path: '/', emp
        },
        {
            path: '/personal',
            component: { template: '<div>About</div>' }
        }
    ]
  })

export default router;