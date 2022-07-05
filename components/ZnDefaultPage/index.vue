<!--
 * @Descripttion: 默认页面(无数据时、无权限时)
 * @version: v1.3.0
 * @Author: LiZeju
 * @Date: 2022-06-24 17:20:16
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-24 18:52:11
-->
<template>
  <div class="zn-default-page">
    <div class="page-content">
      <img :src="defaultPageImgUrl" alt="" />
      <p>{{defaultPageTips}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZnDefaultPage',
  props: {
    defaultPageImgUrl: {
      type: String,
      default: () => '',
    },
    defaultPageTips: {
      type: String,
      default: () => '',
    },
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.zn-default-page {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
