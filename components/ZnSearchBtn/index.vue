<template>
  <div
    class="public-search"
    :class="{ isActive: isActive }"
    @click.stop="handleSearch"
  >
    <el-input
      v-model="searchText"
      class="search"
      ref="search"
      clearable
      prefix-icon="el-icon-search"
      placeholder="搜索"
      @input="searchHandler"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: 'ZnSearchBtn',
  components: {},
  props: {},
  data() {
    return {
      isActive: false,
      searchText: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleSearch() {
      let _this = this
      this.isActive = true
      this.$refs.search.focus()
      function otherClick() {
        if (_this.searchText == '') {
          _this.isActive = false
          document.body.removeEventListener('click', otherClick)
        }
      }
      document.body.addEventListener('click', otherClick)
    },
    searchHandler() {
      this.$emit('up-Search', this.searchText) //改变搜索字段的value
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep.el-input,
.search {
  height: 100%;
  line-height: 34px;
  border: none;
  color: $base-text-5;
  padding: 0;
  pointer-events: none;
  font-size: 14px;
  .el-input__inner {
    cursor: pointer;
    border: none;
  }
  .el-input__inner::placeholder {
    color: $base-text-5;
  }
  .el-input__prefix {
    .el-input__icon {
      color: $base-text-5;
    }
  }
}

.public-search {
  display: inline-block;
  cursor: pointer;
  border: 1px solid white;
  transition: all 0.3s ease-in-out;
  ::v-deep .el-input__inner {
    width: 70px;
    padding-right: 0;
    transition: all 0.3s ease-in-out;
  }
}
::v-deep.isActive {
  border: 1px solid $base-main-tone;
  transition: all 0.3s ease-in-out;
  .el-input__inner {
    width: 210px;
  }
}
</style>
