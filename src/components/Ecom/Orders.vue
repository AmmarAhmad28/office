<template>
  <div>
    <v-container id="mainContainer" style="display: block;">
      <p class="display-3 font-weight-light	text-center pa-4">Order history</p>
      <v-row>
        <v-col :cols="12" md="12" sm="12">
          <table id="datatable" style="min-width: 100%;">
            <thead>
              <tr>
                <th class="text-left">OrderID</th>
                <th class="text-left">Amount</th>
                <th class="text-left">Status</th>
                <th class="text-left">Details</th>

              </tr>
            </thead>
            <!-- <tbody>
                                    <tr :key="order.id" v-for="order in orderList">
                                      <td> {{ order.id }}</td>
                                      <td>{{ order.payment.amount }}</td>
                                      <td>{{ order.status }}</td>
                                    </tr>
                                  </tbody> -->
          </table>
        </v-col>
      </v-row>
    </v-container>
    <button hidden title='Details' data-id="" v-on:click="detailOrder()" id="details"></button>

    <v-divider></v-divider>
    <button hidden type="button" class="btn btn-primary" id="showModel" data-toggle="modal"
      data-target="#exampleModal">details</button>
    <!-- Modal -->
    <div class="modal fade" ref="myModel" id="exampleModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Order Details</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <v-form ref="billing" class="px-1">
              <v-row>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.firstName" dense name="firstName" label="First Name"
                    readonly></v-text-field>
                </v-col>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.lastName" dense name="lastName" label="Last Name"
                    readonly></v-text-field>
                </v-col>

              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.phone" dense name="phone" label="Phone #" readonly></v-text-field>
                </v-col>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.email" dense label="Email" name="email" readonly></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.address" dense label="Street Address" name="address"
                    readonly></v-text-field>
                </v-col>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.city" dense label="City" name="city" readonly></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-select v-model="viewOrder.country" dense item-text="name" item-value="name" label="Country"
                    name="country" readonly></v-select>
                </v-col>
                <v-col class="py-0">
                  <v-select v-model="viewOrder.region" dense item-text="name" item-value="name" label="Region"
                    name="region" readonly></v-select>
                </v-col>
                <v-col class="py-0">
                  <v-text-field v-model="viewOrder.postalCode" dense label="Postal Code" name="postalCode"
                    readonly></v-text-field>
                </v-col>
              </v-row>
            </v-form>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <!-- <button type="button" class="btn btn-primary" v-on:click="save()">Save</button> -->
          </div>
        </div>
      </div>
    </div>

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
import EcomDataService from '../../service/EcomDataService';
import $ from 'jquery'
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

export default {
  name: 'OrderPage',
  mixins: [EcomDataService],

  data() {
    return {
      orderList: null,
      uid: null,
      enterID: null,
      viewOrder: {
        stauts: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
      }
    }
  },

  methods: {
    gettAllOrders() {

      this.orderByUsers(this.uid)
        .then(response => {
          console.warn(response.data)
          this.orderList = response.data;
          this.userOrder(this.orderList);
        })
        .catch(error => {
          console.log(error);
        })
    },
    detailOrder: function () {
      var id = document.getElementById('details').dataset.id;
      this.trackOrder(id)
        .then(response => {

          this.viewOrder = response.data;
          console.log(this.viewOrder);
          document.querySelector("#showModel").click();
        })
        .catch(e => {
          console.log(e);
        });
    },
    userOrder: function (data) {
      $("#datatable").DataTable({
        data: data,
        destroy: true,
        scrollY: "300px",
        scrollX: true,
        scrollCollapse: true,
        // fixedColumns: true,
        columns: [
          { data: 'id' },
          { data: 'payment.amount' },
          { data: 'status' },
          {
            data: 'id',
            render: function (data) {

              return "<a href='#' title = 'Details' onclick='document.getElementById(\"details\").dataset.id=\"" + data + "\";document.getElementById(\"details\").click();'><i class='fas fa-angle-double-right'></i></a>";
            }
          },
        ],
        order: [[0, 'desc']],
      });
    },
  },
  beforeMount() {
    this.uid = this.$session.get('user').id
    this.gettAllOrders()
  }
}
</script>