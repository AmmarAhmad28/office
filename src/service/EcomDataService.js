import http from "../configs/baseURL-config.js";

export default {

    methods: {

        categoriesAll() {
            return http.get(`/category/categories`);
        },

        categoriesLabel() {
            return http.get(`/category/names`);
        },

        categoryByName(name, size, pgNo) {
            return http.get(`/product/categoryPaginated?title=${name}&size=${size}&pageNo=${pgNo}`);
        },

        categoryAdd(data) {
            return http.post("/category/save", data);
        },

        categoryUpdate(data) {
            return http.post("/category/update", data);
        },

        productsAll(size, pgNo) {
            return http.get(`/product/productsPaginated?size=${size}&pageNo=${pgNo}`);
        },

        productByName(name) {
            return http.get(`/product?title=${name}`);
        },

        productById(id) {
            return http.get(`/product/product?id=${id}`);
        },

        productAdd(data) {
            return http.post("/product/save", data);
        },

        productUpdate(data) {
            return http.post("/product/update", data);
        },

        productDelete(id) {
            return http.delete(`/product/product?id=${id}`);
        },

        cartAdd(data) {
            return http.post("/cart/save", data)
        },

        cartUserPending(id) {
            return http.get(`/cart/cart?userId=${id}&status=pending`);
        },

        checkoutAdd(data) {
            return http.post("/order/checkout", data)
        },

        rateSymbols() {
            return http.get(`/rate/symbols`);
        },

        rateConvert(data) {
            return http.post(`/rate/convert`, data);
        },

        shipCharges() {
            return http.get(`/order/shippingCharges`);
        },

        filters(data) {
            return http.get(`/filter/filters?title=${data}`);
        },

        orderHistory() {
            return http.get(`/order/orders`);
        },

        orderByUsers(id) {
            return http.get(`/order/ordersByUser?userId=${id}`);
        },

        trackOrder(oid) {
            return http.get(`/order/track?id=${oid}`);
        },

        getPromotions() {
            return http.get(`/promotion/promotions`);
        },
    }
}