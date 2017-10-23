import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/GoodsList'
import Cart from '@/view/Cart'
import Address from '@/view/Address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/Cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/Address',
      name: 'Address',
      component: Address
    }
  ]
})
