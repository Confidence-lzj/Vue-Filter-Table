<template>
  <el-col :span="12">
    <div class="right-panel">
      <slot />
    </div>
  </el-col>
</template>

<script>
  export default {
    name: 'ZnQueryFormRightPanel',
    props: {
      span: {
        type: Number,
        default: 10,
      },
    },
  }
</script>
