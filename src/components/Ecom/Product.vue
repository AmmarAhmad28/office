<template>
  <div>
    <v-container>
      <div class="row">
        <div class="col-md-5 col-sm-5 col-xs-12">
          <v-carousel>
            <v-carousel-item :key="img.id" v-for="img in this.currentProduct.productPictures"
              :src="'data:image/jpg;base64,' + img.picture"></v-carousel-item>
          </v-carousel>
        </div>
        <div class="col-md-7 col-sm-7 col-xs-12">
          <div class="pl-6">
            <p class="display-1 mb-0">{{ this.currentProduct.title }}</p>
            <v-card-actions class="pa-0">
              <p class="headline font-weight-light pt-3">{{ "Price: " + this.currencyUnit + " - " + this.subAmount }}
                <del v-if="(this.currentProduct.promotion != null && this.currentProduct.promotion.active)"
                  class="subtitle-1 font-weight-thin">{{ " Original Price:" + this.price }}</del>
              </p>
              <v-spacer></v-spacer>
            </v-card-actions>

            <p class="subtitle-1 font-weight-bold">{{ "Brand: " + this.currentProduct.company }}</p>


            <span :key="att.id" v-for="att in this.currentProduct.attributes">

              <span v-if="att.type == 'STRING'">
                {{ att.name + " - " + att.value + "&nbsp;&nbsp;&nbsp;" }}
              </span>

              <span v-if="att.type == 'RADIO'">
                <v-radio :label="att.name" :value="att.value"></v-radio>
              </span>

            </span>


            <!-- <v-radio-group v-model="row" row :key="att.id"></v-radio-group>   -->


            <!-- <p class="title">SIZE</p>
                <v-radio-group v-model="row" row>
                  <v-radio label="XS" value="XS"></v-radio>
                  <v-radio label="S" value="s"></v-radio>
                  <v-radio label="M" value="m"></v-radio>
                  <v-radio label="L" value="l"></v-radio>
                  <v-radio label="XL" value="xl"></v-radio>
                </v-radio-group> -->
            <span v-if="(this.currentProduct.qty > 0)">
              <p class="subtitle-1 font-weight-thick" style="color: blue;">Item in Stock {{ this.currentProduct.qty }}</p>
              <p class="title">ITEMS</p>
              <v-text-field outlined style="width:100px" :value=1 dense v-model="qty" type="number"
                :max="this.currentProduct.qty" min=1></v-text-field>
              <v-btn class="primary white--text" outlined tile dense @click="addToCart()"><v-icon>mdi-cart</v-icon> ADD TO
                CART</v-btn>
            </span>
            <p class="subtitle-1 font-weight-thick p-3" style="color: purple;">{{ message }}</p>
            <p class="title" style="color: red;" v-if="(this.currentProduct.qty == 0)">Out of Stock</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-xs-12 col-md-12">
          <v-tabs>
            <v-tab>Description</v-tab>
            <v-tab-item>
              <p class="pt-10 subtitle-1 font-weight-thin"> {{ this.currentProduct.description }} </p>
            </v-tab-item>
            <!-- <v-tab-item>
                  <v-list three-line="true" avatar="true">
                    <v-list-item-group v-model="item" color="primary">
                      <v-list-item v-for="(item, i) in items" :key="i" inactive="true">
                        <v-list-item-avatar>
                          <v-img :src="item.avatar"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-html="item.title"></v-list-item-title>
                          <v-rating v-model="rating" class="" background-color="warning lighten-3" color="warning" dense></v-rating>
                          <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-tab-item> -->
          </v-tabs>
        </div>
      </div>
    </v-container>
    <v-card class="accent">
      <v-container>
        <v-row no-gutters>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-row>
              <v-col class="col-12 col-sm-3 pr-4 hidden-sm-only" align="right">
                <v-icon class="display-2">mdi-truck</v-icon>
              </v-col>
              <v-col class="col-12 col-sm-9 pr-4">
                <h3 class="font-weight-light">FREE SHIPPING & RETURN</h3>
                <p class="font-weight-thin">Free Shipping over $300</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-row>
              <v-col class="col-12 col-sm-3 pr-4" align="right">
                <v-icon class="display-2">mdi-cash-usd</v-icon>
              </v-col>
              <v-col class="col-12 col-sm-9 pr-4">
                <h3 class="font-weight-light">MONEY BACK GUARANTEE</h3>
                <p class="font-weight-thin">30 Days Money Back Guarantee</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-row>
              <v-col class="col-12 col-sm-3 pr-4" align="right">
                <v-icon class="display-2">mdi-headset</v-icon>
              </v-col>
              <v-col class="col-12 col-sm-9 pr-4">
                <h3 class="font-weight-light">+92-30X-XXX-XXXX</h3>
                <p class="font-weight-thin">24/7 Available Support</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
</div>
</template>

<script>
import EcomDataService from '@/service/EcomDataService';
export default {
  name: 'ProductPage',
  mixins: [EcomDataService],

  data() {
    return {
      message: '',
      id: null,
      qty: 1,
      currentProduct: null,
      rating: 4.5,
      price: 0,
      subAmount: 0,
      currencyUnit: "USD",
      //item: 5,
      // items: [
      //   {
      //               avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      //               title: 'Lorem ipsum dolor?',
      //               subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Tincidunt arcu non sodales neque sodales ut etiam. Lectus arcu bibendum at varius vel pharetra. Morbi tristique senectus et netus et malesuada.\n" +
      //                   "\n",
      //   },
      //   {
      //               avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      //               title: 'Lorem ipsum dolor <span class="grey--text text--lighten-1">4</span>',
      //               subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
      //   },
      //   {
      //               avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
      //               title: 'Lorem ipsum dolor',
      //               subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      //   },
      //   {
      //               avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      //               title: 'Lorem ipsum dolor',
      //               subtitle: ""
      //   },
      //   {
      //               avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
      //               title: 'Lorem ipsum dolor',
      //               subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      //   },
      // ],
    }
  },
  methods: {
    productByIdFn: function (id) {
      console.log("id: " + id)
      this.productById(id)
        .then(response => {
          this.currentProduct = response.data;
          this.func2(this.currentProduct);
          console.warn(this.currentProduct)
        })
        .catch(error => {
          console.log(error);
        })
    },

    func2: function (element) {
      var json = {
        "from": element.currencyUnit,
        "to": localStorage.getItem('currency'),
        "amount": 1,
      }
      this.rateConvert(json)
        .then(response => {
          this.subAmount = element.subAmount * response.data.rate;
          this.price = element.price * response.data.rate;
          this.currencyUnit = localStorage.getItem('currency');
        })
        .catch(error => {
          console.log(error);
        })
    },

    addToCart: function () {
      let item = {
        item: this.currentProduct,
        qty: parseInt(this.qty),
      }
      let cart = localStorage.getItem('cart');
      if (cart == null) {
        cart = [];
        console.log("cart is empty")
      }
      else {
        var i = 0;
        cart = JSON.parse(cart);
        for (i = 0; i < cart.length; i++) {
          if (this.currentProduct.id == cart[i].item.id) {
            if ((parseInt(cart[i].qty) + parseInt(this.qty)) > parseInt(this.currentProduct.qty)) {
              this.message = `You Already Add ${cart[i].qty} items against this product in cart, Now the entered quantity ${this.qty} is beyond the stock, Please enter sufficient quantity according to stock`;
              return;
            }
            cart[i].qty = parseInt(cart[i].qty) + parseInt(this.qty);
            localStorage.setItem('cart', JSON.stringify(cart));
            this.message = `Quantity Added in Cart`
            return;
          }
        }
      }
      if (item.qty > this.currentProduct.qty) {
        this.message = `Entred quantity is out of stock, Please enter again,`
        return;
      }
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log(localStorage.getItem('cart'))
      this.message = `Added to Cart`

    },
  },

  mounted() {
    this.message = ''
    this.id = this.$route.params.id;
    this.productByIdFn(this.$route.params.id);
  }

}
</script>