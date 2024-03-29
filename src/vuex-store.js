import Vue from "vue";
import Vuex from "vuex";
import * as fb from "./firebase";
import router from "./router/router";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    users: [],
    deliverers: [],
    customers: [],
    orders: [],
    customerOrders: [],
    productsInCart: [],
    products: [],
    productTypes: []
  },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
    setUsers(state, val) {
      state.users = val;
    },
    setDeliverers(state, val) {
      state.deliverers = val;
    },
    setCustomers(state, val) {
      state.customers = val;
    },
    updateCart(state, val) {
      state.productsInCart = val;
    },
    setProducts(state, val) {
      state.products = vale;
    }
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch("fetchUser", user);
    },
    async fetchUser({ commit }, user) {
      const userDoc = await fb.usersCollection.doc(user.uid).get();
      let userProfile = userDoc.data();
      userProfile.id = user.uid;
      commit("setUser", userProfile);
      router.push("/");
    },
    async register({ dispatch }, form) {
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        surname: form.surname,
        email: form.email,
        password: form.password,
        address: form.address,
        phoneNumber: form.phoneNumber,
        role: "customer"
      });
      dispatch("fetchUser", user);
    },
    async getAllDeliverers({ state }) {
      let deliverersRef = fb.deliverersCollection;
      try {
        let allDeliverers = await deliverersRef.get();
        state.deliverers = [];
        allDeliverers.forEach(doc => {
          // prosledjuje joj se callback f-ja koja ce vraitti neki item
          const singleDeliverer = doc.data(); // data je ceo objekat
          singleDeliverer["id"] = doc.id;
          state.deliverers.push(singleDeliverer);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteDeliverer({}, id) {
      try {
        await fb.deliverersCollection.doc(id).delete();
        alert("Resurs je uspešno obrisan!");
      } catch (error) {
        console.log(error + " error");
      }
    },
    async updateDeliverer({}, itemForUpdate) {
      try {
        await fb.deliverersCollection.doc(itemForUpdate.id).update({
          companyName: itemForUpdate.companyName,
          address: itemForUpdate.address,
          contact: itemForUpdate.contact
        });
      } catch (error) {
        console.log(error);
      }
    },
    async insertDeliverer({ commit, state }, deliverer) {
      const newDeliverer = {
        companyName: deliverer.companyName,
        address: deliverer.address,
        contact: deliverer.contact
      };
      const data = await fb.deliverersCollection.add(newDeliverer);
    },
    async getAllUsers({ state }) {
      let userRef = fb.usersCollection;
      try {
        let allUsers = await userRef.get();
        state.users = [];
        allUsers.forEach(doc => {
          // prosledjuje joj se callback f-ja koja ce vraitti neki item
          const singleUser = doc.data(); // data je ceo objeka
          singleUser["id"] = doc.id;
          state.users.push(singleUser);
        });
      } catch (error) {
        console.log(error + " error");
      }
    },

    async deleteUser({}, id) {
      console.log("id " + id);
      try {
        await fb.usersCollection.doc(id).delete();
        alert("Resurs je uspešno obrisan!");
      } catch (error) {
        console.log(error + " error");
      }
    },
    async updateUser({}, itemForUpdate) {
      try {
        await fb.usersCollection.doc(itemForUpdate.id).update({
          name: itemForUpdate.name,
          surname: itemForUpdate.surname,
          email: itemForUpdate.email,
          role: itemForUpdate.role
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllProductTypes({ state }) {
      let productTypeRef = fb.productTypeCollection;
      try {
        let allProductTypes = await productTypeRef.get();
        state.productTypes = [];
        allProductTypes.forEach(productType => {
          const singleProductType = productType.data();
          singleProductType["id"] = productType.id;
          state.productTypes.push(singleProductType);
        });
      } catch (error) {
        console.log(error + " error");
      }
    },
    async getAllProducts({ state }) {
      let productsRef = fb.productsCollection;
      try {
        let allProducts = await productsRef.get();
        state.products = [];
        allProducts.forEach(product => {
          const singleProduct = product.data();
          singleProduct["id"] = product.id;
          state.products.push(singleProduct);
        });
      } catch (error) {
        console.log(error + " error");
      }
    },
    async deleteProduct({ dispatch }, id) {
      try {
        await fb.productsCollection.doc(id).delete();
        alert("Resurs je uspešno obrisan!");
        dispatch("getAllProducts");
      } catch (error) {
        console.log(error + " error");
      }
    },
    async insertProduct({ commit, state, dispatch }, product) {
      const newProduct = {
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        productType: {
          id: product.productType.id,
          name: product.productType.name
        }
      };
      const data = await fb.productsCollection.add(newProduct);
      dispatch("getAllProducts");
    },
    async updateProduct({ dispatch }, product) {
      try {
        await fb.productsCollection.doc(product.id).update({
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          productType: {
            id: product.productType.id,
            name: product.productType.name
          }
        });
        dispatch("getAllProducts");
      } catch (error) {
        console.log(error);
      }
    },
    async getAllOrders({ state }) {
      let ordersRef = fb.ordersCollection;
      try {
        let allOrders = await ordersRef.get();
        state.orders = [];
        allOrders.forEach(doc => {
          const singleOrder = doc.data();
          singleOrder["id"] = doc.id;
          state.orders.push(singleOrder);
        });
      } catch (error) {
        console.log(error + " error");
      }
    },
    async deleteOrder({ state }, id) {
      try {
        await fb.ordersCollection.doc(id).delete();
        alert("Uspesno izbrisana porudzbina");
      } catch (error) {
        console.log(error);
      }
    },
    async updateOrder({}, itemForUpdate) {
      try {
        await fb.ordersCollection.doc(itemForUpdate.id).update({
          user: {
            id: itemForUpdate.user.id,
            address: itemForUpdate.user.address,
            name: itemForUpdate.user.name,
            surname: itemForUpdate.user.surname,
            phoneNumber: itemForUpdate.user.phoneNumber
          },
          deliverer: {
            id: itemForUpdate.deliverer.id,
            address: itemForUpdate.deliverer.address,
            companyName: itemForUpdate.deliverer.companyName,
            contact: itemForUpdate.deliverer.contact
          },
          orderDate: itemForUpdate.orderDate,
          state: itemForUpdate.state
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getAllOrdersForCustomer({ state }) {
      let ordersRef = fb.ordersCollection;
      try {
        let allOrders = await ordersRef.get();
        state.customerOrders = [];
        allOrders.forEach(doc => {
          const singleOrder = doc.data();
          if (singleOrder["user"]["id"] === state.user.id) {
            singleOrder["id"] = doc.id;
            state.customerOrders.push(singleOrder);
          }
        });
      } catch (error) {
        console.log(error + " error");
      }
    }
  }
});
