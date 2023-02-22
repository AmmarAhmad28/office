<template>
    <span id="addproduct">
        <div class="container-scroller">
            <Header />
            <div class="container-fluid page-body-wrapper">
                <Sidebar />
                <div class="main-panel">
                    <div class="content-wrapper">
                        <div class="page-header">
                            <h3 class="page-title"> Add Product </h3>
                            <div class="message"> {{message}} </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 stretch-card grid-margin">
                                <div class="card">
                                    <div class="card-body">
                                        <span id="mailSending">
                                            <div class="container-scroller">
                                                <div class="row flex-grow">
                                                    <div class="col-lg-12 mx-auto">
                                                        <div class="auth-form-light text-left p-5">
                                                            <span id="message"></span>
                                                            <v-form ref="billing" class="px-1">
                                                                <v-row>
                                                                    <v-col class="py-0">
                                                                        <v-text-field v-model="title" dense name="tile"
                                                                            label="Product Title" outlined></v-text-field>
                                                                    </v-col>
                                                                    <v-col class="py-0">
                                                                        <v-text-field v-model="company" dense
                                                                            label="Enter Company Name" name="company"
                                                                            outlined></v-text-field>
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col class="py-0">
                                                                        <v-text-field v-model="price" dense name="price"
                                                                            label="Enter Price in $"
                                                                            outlined></v-text-field>
                                                                    </v-col>
                                                                    <v-col class="py-0">
                                                                        <v-text-field v-model="qty" dense
                                                                            label="Enter quantity in stock" name="qty"
                                                                            outlined></v-text-field>
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col class="py-0">
                                                                        <v-text-field v-model="description" dense
                                                                            name="description" label="Product Description"
                                                                            outlined></v-text-field>
                                                                    </v-col>
                                                                    <v-col class="py-0">
                                                                        <v-text-field v-model="unit" dense
                                                                            label="Enter Product Unit" name="unit"
                                                                            outlined></v-text-field>
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col class="py-0">
                                                                        <v-select v-model="category" dense item-text="title"
                                                                            item-value="title"
                                                                            label="Selct Product Category" name="categories"
                                                                            outlined return-object :items="categories"
                                                                            @change="shippingOpts(token.id)"></v-select>
                                                                    </v-col>
                                                                    <v-col class="py-0">
                                                                        <v-select v-model="promotion" dense item-text="title"
                                                                            item-value="title"
                                                                            label="Select Promotion on Product"
                                                                            name="promotion" outlined return-object
                                                                            :items="promotions"
                                                                            @change="shippingOpts(token.id)"></v-select>
                                                                    </v-col>
                                                                </v-row>
                                                                <v-row>
                                                                    <v-col class="py-0">
                                                                        <v-file-input multiple :rules="rules"
                                                                            accept="image/png, image/jpeg, image/bmp"
                                                                            placeholder="Pick images"
                                                                            prepend-icon="mdi-camera" label="Images"
                                                                            variant="outlined" v-model="image"
                                                                            @change="preview"
                                                                            v-on:change="fun1(image)"></v-file-input>
                                                                        <v-img :width="200" :key="im" v-for="im in url"
                                                                            :src="im"
                                                                            style="display: inline-block; margin-left: 1%;" />
                                                                    </v-col>
                                                                </v-row>
                                                                <v-divider></v-divider>
                                                                <v-btn dark block @click="save()">Submit</v-btn>
                                                            </v-form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
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
import Header from '../LoginPortal/_HeaderComponent.vue'
import Sidebar from '../LoginPortal/_SidebarComponent.vue'
import EcomDataService from '../../service/EcomDataService'


export default {
    name: 'AddProduct',
    data() {
        return {
            message: null,
            title: null,
            description: null,
            price: null,
            unit: null,
            company: null,
            qty: null,
            category: null,
            categories: [],
            rules: [
                value => {
                    return !value || !value.length || value[0].size < 2000000 || 'Image size should be less than 2 MB!'
                },
            ],
            url: [],
            image: null,
            base64:[],
            pictures:[],
            promotions:null,
            promotion:null,
        }
    },
    mixins: [EcomDataService],
    methods: {
        getCategories: function () {
            this.categoriesAll()
                .then(response => {
                    this.categories = response.data;
                    console.warn(this.categories)
                    this.promotionFn();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        promotionFn(){
            this.getPromotions()
                .then(response => {
                    this.promotions = response.data;
                    console.warn(this.promotions)
                })
                .catch(error => {
                    console.log(error);
                })
        },
        fun1: function (images) {
            this.base64base64 = [];
            images.forEach(element => {
                if(element) {
                    this.createBase64Image(element);
                }
            });
            
        },
        createBase64Image: function(FileObject) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.base64.push(event.target.result);
            }
            reader.readAsDataURL(FileObject);
        },     
        preview() {
            this.url = [],
                this.image.forEach(element => {
                    this.url.push({ 'src': URL.createObjectURL(element) })
                });
        },

        save: function () {
            this.base64.forEach(element => {
                
                this.pictures.push({
                    "id": 0,
                    "picture": element.split(",")[1]
                })
            });
            var json = {
                "id": 0,
                "title": this.title,
                "description": this.description,
                "currencyUnit": "USD",
                "price": parseFloat(this.price),
                "unit": this.unit,
                "company": this.company,
                "qty": parseInt(this.qty),
                "promotion": {
                    "id": this.promotion.id
                },
                "productPictures": this.pictures,
                "category": {
                    "id": this.category.id
                }

            }
            console.log(json)
            this.productAdd(json)
                .then(response => {
                    this.message = "Product Add!";
                    console.warn(response.data)
                })
                .catch(error => {
                    this.message = "Product not Add!";
                    console.log(error);
                })
        }
    },
    components: {
        Header, Sidebar
    },
    mounted() {
        this.getCategories();
    }

}
</script>
<style>
  .message{
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