<template>
  <div class="text-center" v-if="(currentUser != undefined)">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>

      <template v-slot:activator="{ on, attrs }">
        <v-btn icon title="Profile" dark v-bind="attrs" v-on="on">
          <v-icon>mdi-account-circle</v-icon>
          <ProfileDropdownVue />
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title style="color: black;">{{ currentUser.username }}</v-list-item-title>
              <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list v-if="this.$session.get('authority').authority!='ROLE_ADMIN'">
          <v-list-item @click="ord()">
            <v-icon>mdi-shopping</v-icon>
            <v-list-item-title style="color: black;">Orders</v-list-item-title>
          </v-list-item>

          <v-list-item @click="trk()">
            <v-icon>fas fa-tachometer-alt</v-icon>
            <v-list-item-title style="color: black;">Track</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list v-else>
          <v-list-item >
            <v-icon>mdi-dashboard</v-icon>
            <v-list-item-title style="color: black; align-items: center;">Dashboard</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="menu = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="logout">
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
  <div v-else>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <router-link to="/">
          <v-btn icon title="Profile" dark v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </router-link>
      </template>

    </v-menu>
  </div>
</template>
<script>
export default {
  name: 'ProfileDropDown',
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true,
    currentUser: null,
  }),
  methods: {
    ord() {
      this.$router.push("/orders");
    },
    trk() {
      this.$router.push("/track");
    },
    logout: function () {
      console.log("Logging out...");
      var authToken = this.$session.get('authToken');
      this.$session.destroy();
      this.$session.set('authToken', authToken);
      // this.$store.dispatch('setAuthentication', false);
      this.$router.push("/home");
    }
  },
  beforeMount() {
    if (this.$session.get('user') != undefined) {
      this.currentUser = this.$session.get('user')
    }

  }
}
</script>