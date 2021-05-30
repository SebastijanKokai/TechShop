import Home from '../components/Home';
import PageNotFound from "../components/PageNotFound";
import Login from "../components/Login";
import Register from "../components/Register";
import Deliverer from '../components/Deliverer'
import Customer from '../components/Customer'
import Cart from "../components/Cart";
import {store} from "../vuex-store";

function isEmployee() {
  const user = store.state.user;
  return user && user.role === 'employee';
}

function isCustomer() {
  const user = store.state.user;
  return user && user.role === 'customer';
}

const routes = [
  { path: "/customers", component: Customer, beforeEnter: (to, from, next) => isEmployee() ? next() : next('/login')},
  { path: "/deliverers", component: Deliverer, beforeEnter: (to, from, next) => isEmployee() ? next() : next('/login')},
  { path: '/cart', component: Cart, beforeEnter: (to, from, next) => isCustomer() ? next() : next('/login')},
  { path: '/register', component: Register},
  { path: '/login', component: Login},
  { path: '/', component: Home},
  { path: "*", component: PageNotFound },
];

export default routes;
