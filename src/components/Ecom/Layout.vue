<template>
  <v-app id="inspire">
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark>

      <v-toolbar-title style="width: 350px">
        <router-link to="/home">
          <span class="white--text" style="text-decoration: none">
            <v-icon>mdi-truck</v-icon>&nbsp;E-Mart
          </span>
        </router-link>
      </v-toolbar-title>

      <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="What Are You Looking For?"
        class="hidden-sm-and-down pl-10 ml-4" />
      <v-spacer />

      <v-col style="margin-top: 2rem;">
        <v-select :items="rateSymbol" label="Currency" v-model="currency" @change="currencyFn()"></v-select>
      </v-col>

        <v-btn icon title="Profile">
          <ProfileDropdownVue/>
        </v-btn>

      <router-link to="/cart">
        <v-btn v-on="on" icon title="Cart">
          <v-badge :content=this.cartvalue :value=this.cartvalue color="green" overlap>
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-btn>
      </router-link>

    </v-app-bar>

    <v-content>
      <v-bottom-navigation :value="activeBtn" color="primary" horizontal>
        <router-link to="/home" class="v-btn">Home</router-link>
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">
              <span>Shop</span>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="344" outlined>
            <v-list-item v-for="(item, index) in items" :key="index">
              <router-link :to="'/products/' + item">
                <v-list-item-title>{{ item }}</v-list-item-title>
              </router-link>
            </v-list-item>
          </v-card>
        </v-menu>
      </v-bottom-navigation>
    </v-content>

    <router-view />

    <v-footer :padless="true">
      <v-card flat tile width="100%" class="secondary white--text text-center">
        <v-card-text>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-home</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-email</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-calendar</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-delete</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          powered by: ConnectDotNet, Lahore PK
        </v-card-text>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>ECom</strong>
        </v-card-text>
      </v-card>
    </v-footer>

</v-app>
</template>
<script>
import EcomDataService from '@/service/EcomDataService';
import ProfileDropdownVue from './ProfileDropdown.vue';

export default {
  name: 'LayoutPage',
  mixins: [EcomDataService],
  data() {
    return {
      cartvalue: 0,
      items: [],
      activeBtn: 1,
      rateSymbol: [],
      currency: ''
    }
  },
  components:{
    ProfileDropdownVue
  },
  methods: {
    categoryLabelFn: function () {
      this.categoriesLabel()
        .then(response => {
          //console.warn(response.data)
          this.items = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    rateSymbolsFn: function () {
      this.rateSymbols()
        .then(response => {
          console.warn(response.data)
          this.rateSymbol = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    shopFn: function (cat) {
      this.$router.push("/products/" + cat)
    },

    currencyFn: function () {
      localStorage.setItem('currency', this.currency);
      //this.$router.url="";
      //this.$router.push(this.$route.path).catch(()=>{});
      this.$router.go(window.location)
    },

    currencySetFn: function () {
      if (localStorage.getItem('currency') == null) {
        localStorage.setItem('currency', 'USD');
      }
      this.currency = localStorage.getItem('currency')
    },
  },
  beforeMount() {

    //this.$session.start()
    //this.$session.set('cartvalue', 0);
    this.categoryLabelFn();
    this.rateSymbolsFn();
    this.currencySetFn();
    //this.cartvalue=this.$session.get('cartvalue');
  },
}
</script>