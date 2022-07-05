import Vue from 'vue'
import ZnIcon from '@/components/ZnIcon'// svg component

// register globally
Vue.component('zn-icon', ZnIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
