<template>
  <el-col :span="12">
    <div class="left-panel">
      <slot />
    </div>
  </el-col>
</template>

<script>
  export default {
    name: 'ZnQueryFormLeftPanel',
    props: {
      span: {
        type: Number,
        default: 14,
      },
    },
  }
</script>
