<template>
  <el-row class="zn-query-form" :gutter="0">
    <slot />
  </el-row>
</template>

<script>
export default {
  name: 'ZnQueryForm',
}
</script>

<style lang="scss" scoped>
@mixin panel {
  display: flex;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  min-height: 36px;
  .el-button {
    margin: 0 5px 0 5px;
  }
}

.zn-query-form {
  border-bottom: 1px solid $base-line-1;
  padding-top: 9px;
  padding-bottom: 9px;
  
  ::v-deep {
    .el-form-item:first-child {
      margin: 0 0 #{math.div($base-margin, 2)} 0 !important;
    }

    .el-form-item + .el-form-item {
      margin: 0 0 #{math.div($base-margin, 2)} 0 !important;
      .el-button {
        margin: 0 0 0 10px !important;
      }
    }

    .top-panel {
      padding: 0 16px;
      @include panel;
    }

    .bottom-panel {
      @include panel;
      border-top: 1px solid #dcdfe6;
    }

    .left-panel {
      @include panel;
      margin-left: 16px;
    }

    .right-panel {
      @include panel;
      justify-content: flex-end;
      margin-right: 16px;
      .el-button {
        border: none;
      }
    }
  }
}
</style>
