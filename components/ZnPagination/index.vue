<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      class="flex-center"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'ZnPagination',
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    algin: {
      type: String,
      default: () => 'center',
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      },
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination-container {
  border-top: 1px solid $base-line-1;
  padding: 18px 24px 16px 0;
  background: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  ::v-deep .el-pagination{
    margin: 0;
    padding: 0;
    justify-content: flex-end;
    &.is-background .btn-prev, 
    &.is-background .btn-next, 
    &.is-background .el-pager li{
      min-width: 36px;
      height: 36px;
      line-height: 36px;
      margin: 0 4px;
      font-size: 14px;
      background: $base-fill-2;
      color: $base-text-4;
    }
    &.is-background .el-pager li:not(.disabled).active{
      background-color: rgba(0, 91, 217, 0.1);
      color: $base-main-tone;
    }
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
