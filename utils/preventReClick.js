
// 防止多次点击，重复请求
import Vue from 'vue'

const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 3000)
            }
        })
    }
});

export default{ preventReClick }