<template>
    <div>
        <v-container id="mainContainer" style="display: block;">
            <p class="display-3 font-weight-light	text-center pa-4">Checkout</p>
            <v-row>
                <v-col :cols="12" md="9" sm="12">
                    <p class="title ml-3 mb-4">Shipment Details</p>
                    <v-form ref="billing" class="px-1">
                        <v-row>
                            <v-col class="py-0">
                                <v-text-field v-model="firstName" dense name="firstName" label="First Name" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col class="py-0">
                                <v-text-field v-model="lastName" dense name="lastName" label="Last Name" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="py-0">
                                <v-text-field v-model="phone" dense name="phone" label="Phone #" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col class="py-0">
                                <v-text-field v-model="email" dense label="Email" name="email" outlined
                                    :rules="[rules.required, rules.email]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="py-0">
                                <v-text-field v-model="address" dense label="Street Address" name="address" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col class="py-0">
                                <v-text-field v-model="city" dense label="City" name="city" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="py-0">
                                <v-select v-model="country" dense item-text="name" item-value="name" label="Country"
                                    name="country" outlined return-object :items="countries" :rules="[rules.required]"
                                    @change="shippingOpts(token.id)"></v-select>
                            </v-col>
                            <v-col class="py-0">
                                <v-select v-model="region" dense item-text="name" item-value="name" label="Region"
                                    name="region" outlined :items="country.states" :rules="[rules.required]"></v-select>
                            </v-col>
                            <v-col class="py-0">
                                <v-text-field v-model="postalCode" dense label="Postal Code" name="postalCode" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                        <p class="title ml-3 mb-4">Payment Details</p>
                        <!-- <v-radio-group v-model="radios" row>
                                            <v-radio value="COD" v-if="this.subAmount<100">
                                                <template v-slot:label>
                                                    <div><strong class="success--text">Cash On Delivery</strong></div>
                                                </template>
                                            </v-radio>
                                            <v-radio value="Card">
                                                <template v-slot:label>
                                                    <div><strong >Card Payment</strong></div>
                                                </template>
                                            </v-radio>
                                            <v-radio value="Mobile">
                                                <template v-slot:label>
                                                    <div><strong class="purple--text">Mobile Banking</strong></div>
                                                </template>
                                            </v-radio>
                                        </v-radio-group> -->
                        <v-text-field v-model="cardholderName" name="cardhoulderName" label="Card Houlder Name" outlined
                            :rules="[rules.required]"></v-text-field>
                        <v-text-field v-model="cardNumber" label="Card #" outlined :rules="[rules.required]"></v-text-field>
                        <v-row>
                            <v-col class="py-0">
                                <v-text-field v-model="expiryDate" label="Date" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col class="py-0">
                                <v-text-field v-model="cvc" label="cvc" outlined :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col class="py-0">
                                <v-text-field v-model="cardZip" label="Zip" outlined
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-btn dark block @click="addToCart()">Submit</v-btn>
                    </v-form>
                </v-col>
                <v-col :cols="12" md="3" sm="12" style="background-color: lightgray">
                    <p class="headline">Order Summary</p>
                    <p class="overline">Shipping and additional costs are calculated based on values you have entered.</p>
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td>Order Subtotal</td>
                                    <td class="text-right" style="width: 50px;">{{ subAmount }}</td>
                                </tr>
                                <tr>
                                    <td>Shipping Charges</td>
                                    <td class="text-right" style="width: 50px;">0.00</td>
                                </tr>
                                <tr>
                                    <td>Tax</td>
                                    <td class="text-right" style="width: 50px;">0.00</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td class="text-right" style="width: 50px;"><b>{{ subAmount }}</b></td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-container>

        <v-container id="thankyou" style="display: none;">
            <p class="display-4 font-weight-light	text-center pa-4">You're all set!</p>

            <div class="display-3 font-weight-light	text-center pa-3">
                <i class="fa fa-check main-content__checkmark" style="color: green;" id="checkmark"></i>
                <p class="display-2 font-weight-light	text-center pa-2" data-lead-id="main-content-body">Thanks for being
                    awesome, we hope you enjoy ypur purchase.</p>
            </div>

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
import locale from '../../store/country'

export default {
    name: 'CheckoutPage',
    mixins: [EcomDataService],

    data() {
        return {
            message: '',
            userId: null,
            cartId: null,
            subAmount: null,
            rating: 4.5,

            cardholderName: '',
            countries: locale,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            country: {},
            city: '',
            region: '',
            postalCode: '',
            cardNumber: '1234123412341234',
            expiryDate: '11/2023',
            cvc: 123,
            cardZip: '94103',
            rules: {
                email: (v) => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(v) || 'Invalid e-mail.'
                },
                required: (v) => !!v || 'Required.'
            }
        }
    },

    methods: {
        checkoutFn() {
            if (this.userId == null) {
                return;
            }

            if (this.cartId == null) {
                return;
            }

            var json = {
                "payment": {
                    "method": "Card",
                    "amount": parseFloat(this.subAmount),
                    "cardholderName": this.cardholderName,
                    "cardNo": parseInt(this.cardNumber),
                    "expMonth": parseInt(this.expiryDate.split("/")[0]),
                    "expYear": parseInt(this.expiryDate.split("/")[1]),
                    "cvc": parseInt(this.cvc)
                },
                "firstName": this.firstName,
                "lastName": this.lastName,
                "mobile": this.phone,
                "email": this.email,
                "city": this.city,
                "cartId": parseInt(this.cartId),
                "province": this.region,
                "country": this.country.name,
                "postalCode": parseInt(this.postalCode),
                "address": this.address,
                "userId": parseInt(this.userId)
            }

            console.log(json)
            this.checkoutAdd(json)
                .then(response => {
                    console.warn(response.data)
                    var e = document.querySelector("#thankyou");
                    var main = document.querySelector("#mainContainer");
                    if (response.status == 201) {
                        e.style.display = "block";
                        main.style.display = "none";
                    }
                    else {
                        e.style.display = "none";
                        main.style.display = "block";
                    }
                })
                .catch(error => {
                    console.warn(error);
                })
        },

        addToCart() {
            var json = {
                "userId": this.userId,
                "status": "Pending",
                "cartDetails": this.getCart(),
            }
            console.log(json)
            this.cartAdd(json)
                .then(response => {
                    console.warn(response.data)
                    this.message = response.data.message
                    this.cartId = response.data.id;
                    this.checkoutFn();
                    localStorage.removeItem("cart");
                })
                .catch(error => {
                    console.warn(error);
                    this.message = error.response.data.message
                })
        },

        getCart: function () {
            let cart = localStorage.getItem('cart');
            if (cart == null) {
                return [];
            }
            var cartDetails = [];

            cart = JSON.parse(cart)

            cart.forEach(element => {
                var products = {
                    "product": {
                        "id": null,
                        "qty": null
                    }
                }
                products.product.id = element.item.id;
                products.product.qty = element.qty;
                cartDetails.push(products);
            });
            //console.log(cartDetails)
            return cartDetails;
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


        checkLogin() {
            //console.log("in check login")
            var user = this.$session.get('user')
            if (user == null) {
                this.$session.start();
                this.$session.set('redirect', `/checkout`);
                this.$router.push("/")
            }
            else {
                this.userId = user.id;
            }
        },

    },

    beforeMount() {
        //let queryString = window.location.search;
        //let urlParams = new URLSearchParams(queryString);
        //this.subAmount = urlParams.get('amnt');
        this.subAmount = this.$session.get('subTotal')
        this.checkLogin();
    }

}
</script>