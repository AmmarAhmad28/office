<template>
  <div>
    <v-container>
      <p class="display-3 font-weight-light	text-center pa-4">SHOPPING CART</p>
      <v-row>
        <v-col :cols="12" md="9" sm="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">ITEM</th>
                  <th class="text-left">PRICE</th>
                  <th class="text-left">QUANTITY</th>
                  <th class="text-left">TOTAL</th>
                  <th class="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cart1, index) in currentCart" :key="cart1.item.id">
                  <td>
                    <v-list-item key="1">
                      <v-list-item-avatar>
                        <v-img :src="'data:image/jpg;base64,' + cart1.item.productPictures[0].picture"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>{{ cart1.item.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ cart1.item.description }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </td>
                  <td>{{ cart1.item.currencyUnit + " - " + cart1.item.subAmount }}</td>
                  <td>
                    <v-text-field class="pt-10" v-model="cart1.qty" label="Outlined" style="width: 80px;" single-line
                      outlined value="2" type="number"></v-text-field>
                  </td>
                  <td>{{ cart1.item.currencyUnit + " - " + parseFloat(cart1.item.subAmount * cart1.qty).toFixed(2) }}</td>
                  <td>
                    <v-icon @click="updateCart(index, cart1.qty)">mdi-update</v-icon>
                    /
                    <v-icon @click="deleteCart(index)">mdi-delete</v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col :cols="12" md="3" sm="12" style="background-color: lightgray">
          <p class="headline">Order Summary</p>
          <p class="overline">Shipping and additional costs are calculated based on values you have entered.
          </p>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>Order Subtotal</td>
                  <td class="text-right" style="width: 50px;">{{ parseFloat(subTotal).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>Shipping Charges</td>
                  <td class="text-right" style="width: 50px;">{{ parseFloat(shipchrg).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td class="text-right" style="width: 50px;">0.00</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td class="text-right" style="width: 50px;"><b>{{ parseFloat(subTotal + shipchrg).toFixed(2) }}</b></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center">
            <v-btn class="primary white--text mt-5" outlined @click="chkOutFn(subTotal)">PROCEED TO PAY</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

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
                <h3 class="font-weight-light">+92-3XX-XXX-XXX</h3>
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
  name: 'CartPage',
  mixins: [EcomDataService],

  data() {
    return {
      uid: null,
      mainCart: null,
      currentCart: null,
      subTotal: 0,
      shipchrg: 0,

      rating: 4.5,
    }
  },

  methods: {
    // cartFn(){
    //   this.cartUserPending(idd)
    //   .then(response => {
    //     this.mainCart=response.data[0];
    //     //console.log(this.mainCart.totalAmount)
    //     this.cartDetails=response.data[0].cartDetails
    //     //console.warn(response.data[0].cartDetails)
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })
    // },

    getCart: function () {
      let cart = localStorage.getItem('cart');
      if (cart == null) {
        return [];
      }
      //this.currentCart=cart;
      this.currentCart = JSON.parse(cart);
      //console.log(this.currentCart)
      this.func3(this.currentCart);
      this.shippingCharges();
      // return JSON.parse(cart);
    },

    shippingCharges: function () {
      this.shipCharges()
        .then(response => {
          this.shipchrg = (((this.subTotal / response.data.SHIPPING_TOTAL_AMOUNT_STEP_LIMIT) * response.data.WITHIN_COUNTRY));

        })
        .catch(error => {
          console.log(error);
        })
    },

    func3: function (object) {
      this.subTotal = 0;
      object.forEach(element => {
        var json = {
          "from": element.item.currencyUnit,
          "to": localStorage.getItem('currency'),
          "amount": element.item.subAmount,
        }
        this.rateConvert(json)
          .then(response => {
            element.item.subAmount = response.data.rate;
            element.item.currencyUnit = localStorage.getItem('currency');
            this.subTotal = (this.subTotal + (element.item.subAmount * element.qty));
          })
          .catch(error => {
            console.log(error);
          })

      });
    },

    chkOutFn(amnt) {
      this.$session.start();
      this.$session.set('subTotal', amnt)
      this.$router.push(`/checkout`)
    },

    deleteCart(i) {
      var cart = localStorage.getItem('cart');
      cart = JSON.parse(cart);
      cart.splice(i, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.getCart();
    },

    updateCart(i, v) {
      var cart = localStorage.getItem('cart');
      cart = JSON.parse(cart);
      cart[i].qty = parseInt(v);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.getCart();
    },

  },

  beforeMount() {
    //this.uid=this.$session.get("user").id;
    //console.log(this.id)
    this.getCart();
  }
}
</script>