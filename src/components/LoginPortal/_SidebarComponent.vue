<script>
export default {
    name: 'SidebarComponent',
    data(){
      return{
      user: this.$session.get('user'),
      authority: this.$session.get('authority')
    }
  },
}
</script>

<template>
  <span id="sidebar">     
    <nav class="sidebar sidebar-offcanvas">
      <ul class="nav">
        <li class="nav-item nav-profile">
          <a href="#" class="nav-link">
            <div class="nav-profile-text d-flex flex-column">
              <span class="font-weight-bold mb-2"></span>
            </div>
          </a>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/dashboard">
            <span class="menu-title">Dashboard</span>
            <i class="fa fa-dashboard menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-if="authority.authority == 'ROLE_ADMIN'">
          <router-link class="nav-link" to="/users">
            <span class="menu-title">Users</span>
            <i class="fa fa-user menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-if="authority.authority == 'ROLE_ADMIN'">
          <router-link class="nav-link" to="/roles">
            <span class="menu-title">Roles</span>
            <i class="fa fa-warning menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/employees">
            <span class="menu-title">Employees</span>
            <i class="fa fa-group menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/departments">
            <span class="menu-title">Departments</span>
            <i class="fas fa-building menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-if="authority.authority == 'ROLE_ADMIN'">
          <router-link class="nav-link" to="/logs">
            <span class="menu-title">Logs</span>
            <i class="fa fa-list-alt menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-if="authority.authority == 'ROLE_ADMIN'">
          <router-link class="nav-link" to="/mail">
            <span class="menu-title">Mail</span>
            <i class="fa fa-envelope menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/2stepRegistration">
            <span class="menu-title">2-Step Security</span>
            <i class="fas fa-shield-alt menu-icon"></i>
          </router-link>
        </li>
        <li class="nav-item" v-if="authority.authority == 'ROLE_ADMIN'">
          <router-link class="nav-link" to="/addProduct">
            <span class="menu-title">Add Product</span>
            <i class="fa fa-envelope menu-icon"></i>
          </router-link>
        </li>
      </ul>
    </nav>
  </span>
</template>
