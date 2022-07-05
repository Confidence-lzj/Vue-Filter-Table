<template>
  <el-popover
    placement="bottom"
    trigger="click"
    width="256"
    popper-class="card-management-btn-popover"
    :visible-arrow="false"
  >
    <div class="card-management-header mb-10">卡片管理</div>
    <el-input
      class="card-management-search mb-10"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      v-model="filterText"
      clearable
      @input="getSearch"
    ></el-input>
    <el-button class="font-normal" type="text" size="medium" slot="reference">
      <zn-icon :iconName="'icon-list'" />
      <span>卡片管理</span>
    </el-button>
    <div
      class="card-management-main"
      v-if="options.fields && getSearch().length > 0"
    >
      <el-row :gutter="10" type="flex" class="row-flex">
        <el-col
          :span="24"
          :class="
            options.options.showLabel
              ? 'outer-layer'
              : 'outer-layer-discoloration'
          "
        >
          <el-col :span="21">展示字段名称</el-col>
          <el-col :span="3">
            <zn-icon
              :iconName="'icon-eye'"
              v-if="options && options.options && options.options.showLabel"
              @click="setOptions()"
            />
            <zn-icon
              :iconName="'icon-eye-invisible'"
              v-else
              @click="setOptions()"
            />
          </el-col>
        </el-col>
        <zn-draggable
          class="mb-10"
          v-bind="dragOptions"
          :list="options.fields"
          @end="submitHeader()"
        >
          <el-col
            :class="item.isShow ? 'outer-layer' : 'outer-layer-discoloration'"
            :span="24"
            v-for="(item, index) in getSearch()"
            :key="item.id + index"
          >
            <el-col :span="5" class="no-padding">
              <zn-icon :iconName="'icon-drag-dot'" />
              <zn-icon :iconName="item.extra.icon" class="ml-5" />
            </el-col>
            <el-col :span="16" class="overflowOne">
              {{ item.label }}
            </el-col>
            <el-col :span="3">
              <zn-icon
                :iconName="'icon-eye'"
                v-if="item.isShow"
                @click="setIsShow(item)"
              />
              <zn-icon
                :iconName="'icon-eye-invisible'"
                v-else
                @click="setIsShow(item)"
              />
            </el-col>
          </el-col>
        </zn-draggable>
      </el-row>
    </div>
    <div class="card-management-main dataTips" v-else>
      <el-col :span="24">{{ dataTips }}</el-col>
    </div>
    <div
      class="card-management-footer"
      v-if="options.fields && getSearch().length > 0"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button type="primary" size="medium" @click="hideAll">
            隐藏所有
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" size="medium" @click="showAll">
            显示所有
          </el-button>
        </el-col>
      </el-row>
    </div>
  </el-popover>
</template>

<script>
import ZnDraggable from 'vuedraggable'
import { saveHeader } from '@/api/index'
export default {
  name: 'ZnCardManagementBtn',
  components: {
    ZnDraggable,
  },
  props: {
    options: {
      type: Object, // 卡片管理数据
      default: () => {},
    },
    views_id: {
      type: String, // 视图ID
      default: () => '',
    },
    mark: {
      type: String, // mark特定标识
      default: () => '',
    },
  },
  data() {
    return {
      filterText: '',
      dataTips: '',
      checkList: [],
      form: {
        mark: this.mark,
        header: {
          fields: [],
          options: {},
        },
        views_id: '',
      },
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 600,
        group: 'description',
      }
    },
    // 搜索
    filterSearch() {
      if (this.filterText) {
        return this.options.fields.filter((value) =>
          value.label.includes(this.filterText)
        )
      }
    },
  },
  created() {},
  watch: {
    'options.fields': {
      handler(newVal) {
        if (this.options.fields && this.options.fields.length > 0) {
          this.checkList = []
          this.options.fields.forEach((item) => {
            if (item.isShow == true) {
              this.checkList.push(item.label)
            }
          })
        } else {
          this.checkList = []
        }
        this.notifyParent()
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    // 处理提示
    getSearch() {
      if (!this.filterText) {
        if (!this.options.fields.length > 0) {
          this.dataTips = '暂无数据'
        }
        return this.options.fields
      } else {
        if (!this.filterSearch.length > 0) {
          this.dataTips = '暂无搜索结果'
        }
        return this.filterSearch
      }
    },
    // 是否展示字段名称 
    setOptions() {
      this.options.options.showLabel = !this.options.options.showLabel
      this.submitHeader()
    },
    // 单条数据处理显示与否
    setIsShow(item) {
      this.options.fields.forEach((i, t) => {
        if (i.id === item.id) {
          i.isShow = !i.isShow
        }
        this.checkList.splice(t, 0, this.options.fields[t].label)
      })
      this.submitHeader()
    },
    // 保存更改
    submitHeader() {
      this.form.views_id = this.views_id
      this.form.header.fields = this.options.fields
      this.form.header.options = this.options.options
      saveHeader(this.form).then((res) => {})
      this.notifyParent()
    },
    // 提示父级更新
    notifyParent() {
      let showLabel =
        this.options && this.options.options
          ? this.options.options.showLabel
          : false
      this.$emit('upCard', this.options.fields, this.checkList, showLabel)
    },

    // 隐藏所有
    hideAll() {
      this.options.fields.forEach((item) => {
        item.isShow = false
      })
      this.submitHeader()
    },
    // 显示所有
    showAll() {
      this.options.fields.forEach((item) => {
        item.isShow = true
      })
      this.submitHeader()
    },
  },
}
</script>

<style lang="scss" scoped>
.card-management-header {
  font-weight: 600;
}
::v-deep.card-management-search {
  .el-input__inner {
    margin-left: 0;
    padding-left: 20px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .el-input__prefix {
    margin-left: -10px;
  }
}
.row-flex {
  height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  .outer-layer {
    color: $base-text-5;
  }
  .outer-layer-discoloration {
    color: $base-line-4;
  }
  .outer-layer-discoloration,
  .outer-layer {
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }
  .outer-layer:hover {
    background-color: $base-color-public;
    color: $base-main-tone !important;
    cursor: pointer;
  }
}
.no-padding {
  padding: 0 !important;
}
.dataTips {
  padding: 24px;
  text-align: center;
  color: $base-line-4;
}
.card-management-footer {
  border-top: 1px solid $base-line-1;
  padding: $base-padding;
  padding-bottom: 0;
  .el-button {
    border: $base-line-1;
    background: $base-line-1;
    color: $base-text-5;
  }
}
</style>
