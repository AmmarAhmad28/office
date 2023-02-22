<template>
    <span id="employees">
        <Auth />
        <div class="container-scroller">
            <Header />
            <div class="container-fluid page-body-wrapper">
                <Sidebar />
                <div class="main-panel">
                    <div class="content-wrapper">
                        <div class="page-header">
                            <h3 class="page-title">
                                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                                    <i class="fa fa-group"></i>
                                </span>All Products
                            </h3>
                        </div>
                        <div class="row">
                            <div class="col-md-12 stretch-card grid-margin">
                                <div class="card">
                                    <div class="card-body">
                                        <div id="ProductAll" class="col-md-9 col-sm-9 col-xs-12">
                                            <v-row dense>
                                                <v-col cols="12" sm="8" class="pl-6 pt-6">
                                                    <small>{{ this.total }} products found - Showing {{ showing }}
                                                        products</small>
                                                </v-col>
                                            </v-row>

                                            <v-divider></v-divider>

                                            <div class="row text-center">
                                                <div class="col-md-3 col-sm-6 col-xs-12" :key="pro.id" v-for="pro in products">
                                                    <v-hover v-slot:default="{ hover }">
                                                        <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                                                            <v-img class="white--text align-end" :aspect-ratio="16 / 9" height="200px" :src="'data:image/jpg;base64,' + pro.productPictures[0].picture">
                                                                <v-card-title>{{ pro.company }} </v-card-title>
                                                                <v-expand-transition>
                                                                    <div v-if="hover"
                                                                        class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
                                                                        style="height: 100%;">
                                                                        <v-btn v-if="hover" @click="viewFn(pro.id)" class="" title="View"><v-icon>mdi-eye</v-icon></v-btn>
                                                                        <v-btn v-if="hover" @click="viewFn(pro.id)" class="" title="Update"><v-icon>mdi-update</v-icon></v-btn>
                                                                        <v-btn v-if="hover" @click="viewFn(pro.id)" class="" title="Delete"><v-icon>mdi-delete</v-icon></v-btn>
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
                                                <v-pagination v-model="page" :length="this.total / this.size" @input="showALL(page - 1)"></v-pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
import EcomDataService from '../../service/EcomDataService'
import Header from '../LoginPortal/_HeaderComponent.vue'
import Sidebar from '../LoginPortal/_SidebarComponent.vue'
export default {
    name: 'ProductAll',
    el: "ProductAll",

    data() {
        return {
            products: null,
            total: 0,
            size: 12,
            showing: "",
            page: 1,
        }
    },
    mixins: [EcomDataService],

    methods: {

        showALL: function (pgNo) {
            this.productsAll(this.size, pgNo)
                .then(response => {
                    this.products = response.data.data;
                    this.total = response.data.total;
                    this.showing = response.data.showing;
                    console.warn(this.products)
                })
                .catch(error => {
                    console.log(error);
                })
            return;
        },
        viewFn: function (id) {
            console.warn("pro id: " + id)
            this.$router.push("/product/" + id)
        },


    },
    components: {
        Header, Sidebar
    },
    beforeMount() {
        this.showALL(0);
    }
}
</script>

<style>
.message {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
    position: relative;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
}
</style>


