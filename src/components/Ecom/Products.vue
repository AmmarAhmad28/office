<template>
  <div>
    <v-container>
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <v-card outlined>
            <v-card-title>Filters</v-card-title>
            <v-divider></v-divider>

            <template>
              <v-treeview v-model="selection" :items="items" :selectable=true return-object open-all
                @input="onChangeAAA(selection)"></v-treeview>
              <div v-for="node in selection" :key="node.id"> {{ node.name }} </div>
            </template>

            <v-divider></v-divider>

            <v-card-title>Price</v-card-title>
            <v-range-slider v-model="range" :max="max" :min="min" :height="10" class="align-center"
              dense></v-range-slider>
            <v-row class="pa-2" dense>
              <v-col cols="12" sm="5">
                <v-text-field :value="range[0]" label="Min" outlined dense
                  @change="$set(range, 0, $event)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <p class="pt-2 text-center">TO</p>
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field :value="range[1]" label="Max" outlined dense
                  @change="$set(range, 1, $event)"></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- <v-card-title class="pb-0">Customer Rating</v-card-title>
                <v-container class="pt-0"  fluid>
                  <v-checkbox append-icon="mdi-star" label="4 & above" hide-details dense></v-checkbox>
                  <v-checkbox append-icon="mdi-star" label="3 & above" hide-details dense></v-checkbox>
                  <v-checkbox append-icon="mdi-star" label="2 & above" hide-details dense></v-checkbox>
                  <v-checkbox append-icon="mdi-star" label="1 & above" hide-details dense></v-checkbox>
                </v-container>
                <v-divider></v-divider>
                <v-card-title class="pb-0">Size</v-card-title>
                <v-container class="pt-0" fluid>
                  <v-checkbox  label="XS" hide-details dense></v-checkbox>
                  <v-checkbox  label="S" hide-details dense></v-checkbox>
                  <v-checkbox  label="M" hide-details dense></v-checkbox>
                  <v-checkbox  label="L" hide-details dense></v-checkbox>
                  <v-checkbox  label="XL" hide-details dense></v-checkbox>
                  <v-checkbox  label="XXL" hide-details dense></v-checkbox>
                  <v-checkbox  label="XXXL" hide-details dense></v-checkbox>
                </v-container> -->
          </v-card>
        </div>

        <div class="col-md-9 col-sm-9 col-xs-12">
          <v-breadcrumbs class="pb-0" :items="breadcrums"></v-breadcrumbs>
          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <small>{{ this.total }} products found - Showing {{ showing }} products</small>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select class="pa-0" v-model="select" :items="options" style="margin-bottom: -20px;" outlined
                dense></v-select>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <div class="row text-center">
            <div class="col-md-3 col-sm-6 col-xs-12" :key="pro.id" v-for="pro in products">
              <v-hover v-slot:default="{ hover }">
                <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                  <v-img class="white--text align-end" :aspect-ratio="16 / 9" height="200px"
                    :src="'data:image/jpg;base64,' + pro.productPictures[0].picture">
                    <v-card-title>{{ pro.company }} </v-card-title>
                    <v-expand-transition>
                      <div v-if="hover"
                        class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
                        style="height: 100%;">
                        <v-btn v-if="hover" @click="viewFn(pro.id)" class="" outlined>VIEW</v-btn>
                      </div>
                    </v-expand-transition>
                  </v-img>
                  <v-card-text class="text--primary">
                    <div><a href="/product" style="text-decoration: none; white-space: nowrap; width: 100%; overflow: hidden; text-overflow: ellipsis; display: block;">{{ pro.title }}</a></div>
                    <div>{{ pro.currencyUnit }} {{ pro.subAmount }}</div>
                  </v-card-text>
                </v-card>
              </v-hover>
            </div>
          </div>
          <div class="text-center mt-12">
            <v-pagination v-model="page" :length="this.total / this.size"
              @input="categoryByNameFn(cate, page - 1)"></v-pagination>
          </div>
        </div>
      </div>
    </v-container>
</div>
</template>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .8;
  position: absolute;
  width: 100%;
}
</style>

<script>
import EcomDataService from '@/service/EcomDataService';
export default {
  name: 'ShopPage',
  mixins: [EcomDataService],
  data() {
    return {
      products: null,
      cate: null,
      total: 0,
      size: 12,
      showing: "",


      range: [0, 10000],
      select: 'Popularity',
      options: [
        'Default',
        'Popularity',
        'Relevance',
        'Price: Low to High',
        'Price: High to Low',
      ],
      page: 1,
      breadcrums: [
        {
          text: 'Home',
          disabled: false,
          href: 'breadcrumbs_home',
        },
        {
          text: this.$route.params.name,
          disabled: true,
          href: 'breadcrumbs_shirts',
        },
      ],
      min: 0,
      max: 10000,
      selection: [],
      items: [],

    }
  },
  methods: {
    categoryByNameFn: function (name, pgNo) {
      console.log("name: " + name)
      this.categoryByName(name, this.size, pgNo)
        .then(response => {
          this.products = response.data.data;
          this.func1(this.products);
          this.total = response.data.total;
          this.showing = response.data.showing;
          this.byFilter(name)
          console.warn(this.products)
        })
        .catch(error => {
          console.log(error);
        })
      return;
    },

    func1: function (object) {
      object.forEach(element => {
        var json = {
          "from": element.currencyUnit,
          "to": localStorage.getItem('currency'),
          "amount": element.subAmount,
        }
        this.rateConvert(json)
          .then(response => {
            element.subAmount = response.data.rate;
            element.currencyUnit = localStorage.getItem('currency');
          })
          .catch(error => {
            console.log(error);
          })

      });
    },

    viewFn: function (id) {
      console.warn("pro id: " + id)
      this.$router.push("/product/" + id)
    },

    byFilter: function (title) {
      this.filters(title)
        .then(response => {
          this.test = response.data;
          console.warn(response.data)
          this.items = this.temp(response.data);
        })
        .catch(error => {
          console.log(error);
        })
    },

    temp: function (object) {
      var ii = 2;
      var arr = [{ id: 0, name: 'Company', children: null, }, { id: 1, name: 'Attributes', children: null, }];
      var child = [];
      var childtemp = { id: null, name: '' };
      let tem = object.companies
      for (let i = 0; i < 2; i++) {
        tem.forEach((element) => {
          childtemp.id = ii++;
          childtemp.name = element.name;
          let clone = JSON.parse(JSON.stringify(childtemp))
          child.push(clone);
        });
        arr[i].children = child;
        child = [];
        tem = object.attributes;
      }
      return arr;
    },

    onChangeAAA: function (s) {
      s.forEach((node) => {
        console.log(node)

      });
    },
  },
  mounted() {
    this.cate = this.$route.params.name;
    this.categoryByNameFn(this.$route.params.name, 0);
  }
}
</script>