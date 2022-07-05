<template>
  <div class="filter-table">
    <!-- 下滑窗帘 -->
    <div class="zn-blinds" v-if="multipleSelection.length > 0">
      <div class="zn-blinds-left">
        已选择本页{{ multipleSelection.length }}条记录
      </div>
      <div class="zn-blinds-right">
        <slot />
        <zn-icon :iconName="'icon-close'" @click="closeBilnds" />
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      ref="table"
      :data="tableData"
      style="width: 100%"
      border
      stripe
      @cell-mouse-enter="cellEnter"
      @cell-mouse-leave="cellLeave"
      @selection-change="handleSelectionChange"
      @row-click="toDeatils"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="multiple"
      >
        <template #default="{ row, $index }">
          <div
            v-if="columnCheckedId == row.id || checkedList[$index]"
            @click.stop
          >
            <el-checkbox
              v-model="checkedList[$index]"
              @change="cellCheckbox(row, $index)"
            ></el-checkbox>
          </div>
          <span v-else>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="item.id + item.label + index"
        :label="item.label"
        align="left"
        :prop="item.name"
        min-width="130"
        show-overflow-tooltip
      >
        <template slot="header">
          <el-popover
            placement="bottom"
            :visible-arrow="false"
            trigger="click"
            popper-class="select-popover"
          >
            <div class="pop-li pl-5">
              <el-button type="text" size="medium" @click="hideColumn(item)">
                <zn-icon :iconName="'icon-eye'" />
                隐藏列
              </el-button>
            </div>
            <!-- table表头文字显示-->
            <div slot="reference" class="table-cell-label">
              <zn-icon :iconName="item.extra.icon" />
              <span class="table-cell-label-text">{{ item.label }}</span>
              <i class="el-icon-arrow-down"></i>
            </div>
          </el-popover>
        </template>

        <template #default="{ row }">
          <!-- 每一列涉及value值判断显示label ,以及状态颜色 -->
          <span
            v-if="item.extra.columnStyle == 'labelTags'"
            :class="item.extra.labelTags[row[item.name].value]"
          >
            {{ row[item.name].label }}
          </span>
          <!-- 工单优先级状态映射不同颜色 -->
          <span
            v-else-if="item.extra.columnStyle == 'labelText'"
            :class="item.extra.labelTags[row[item.name].value]"
          >
            {{ row[item.name].label }}
          </span>
          <!-- 电话后面有电话图标 -->
          <span
            v-else-if="
              item.extra.columnStyle == 'labelCall' && row[item.name] != ''
            "
          >
            {{ row[item.name] }}
            <span class="column-label-call">
              <zn-icon
                :iconName="'callcenter-phone'"
                @click.stop="makeACall(row[item.name])"
              />
            </span>
          </span>
          <!-- 数据是对象{value:"",label:""}  -->
          <!-- table-text-pink 为文字标红样式class类名 -->
          <span
            v-else-if="checkValue(row[item.name])"
            :class="row[item.name].value === false ? 'table-text-pink' : ''"
          >
            {{ row[item.name].label }}
          </span>
          <span v-else>{{ row[item.name] }}</span>
        </template>
      </el-table-column>
      <template slot="empty">
        <zn-default-page :defaultPageImgUrl="defaultPageImgUrl" :defaultPageTips="defaultPageTips"/>
      </template>
      <!-- 如有操作列 ↓-->
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'ZnFilterTable',
  components: {},
  props: ['imgUrl'],
  props: {
    hasDetail: {
      type: Boolean, // 是否有详情页面
      default: () => true,
    },
    tableData: {
      type: Array, // table数据
      default: () => [],
    },
    finallyColumns: {
      type: Array, // table数据
      default: () => [],
    },
    multiple: {
      type: Boolean, // table数据
      default: () => false,
    },
    deatilsPath: {
      type: String, // table数据
      default: () => '',
    },
    maxHeight: {
      type: String, // table最大高度
      default: () => '',
    },
    defaultPageImgUrl: {
      type: String,
      default: () => '',
    },
    defaultPageTips: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      columnCheckedId: '',
      multipleSelection: [], //table多选数据
      checkedList: [], //table多选选中数据
    }
  },
  computed: {},
  created() {},
  methods: {
    // 校验是否为 label value 对象格式【非null、非array、object】
    checkValue(val) {
      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        return true
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length == this.tableData.length) {
        this.multipleSelection.forEach((item, index) => {
          this.checkedList[index] = true
        })
      }
      if (this.multipleSelection.length == 0) {
        this.checkedList = []
      }
      this.$emit('selectList', this.multipleSelection)
    },
    // 鼠标移入表格当前行
    cellEnter(row, column, cell, event) {
      this.columnCheckedId = row.id
    },
    // 鼠标移出表格当前行
    cellLeave(row, column, cell, event) {
      this.columnCheckedId = ''
    },
    // 选中与否塞数据
    cellCheckbox(row, index) {
      if (this.checkedList[index]) {
        this.$refs.table.toggleRowSelection(row, true)
      } else {
        this.$refs.table.toggleRowSelection(row, false)
      }
    },
    // 跳转路径
    toDeatils(row) {
      if (this.deatilsPath) {
        this.$router.push({
          path: this.deatilsPath,
          query: {
            id: row.id,
          },
        })
      } else {
        if (!this.hasDetail) {
          this.$emit('rowDetailClick', row.id)
        } else {
          // this.$baseMessage(
          //   '请配置所需要跳转的路径',
          //   'warning',
          //   'zn-hey-message-warning'
          // )
          return false
        }
      }
    },
    // 隐藏列
    hideColumn(item) {
      this.$parent.$refs.ZnFieldManagementBtn.setIsShow(item)
    },
    // 拨打电话
    makeACall(num) {
      let statusNumber = this.$store.state.callBar.statusNumber
      if (['2', '3', '4'].includes(statusNumber)) {
        let msg =
          statusNumber == '2'
            ? (msg = '拨号中')
            : statusNumber == '3'
            ? (msg = '振铃中')
            : statusNumber == '4'
            ? (msg = '通话中')
            : ''
        if (msg != '') {
          this.$confirm('当前正在' + `${msg}` + '，无法拨号', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {})
            .catch(() => {})
        }
      } else {
        this.$store.dispatch('callBar/setPhoneNum', num)
      }
    },
    // 主动关闭窗帘
    closeBilnds() {
      this.$refs.table.clearSelection() //从table组件上清除选中的数据
    },
  },
}
</script>
<style scoped lang="scss">
// 粉色
@mixin pink {
  background: #ffece8;
  color: #f53f3f;
}
// 绿色
@mixin green {
  background: #e8fff0;
  color: $base-Success-6;
}
// 蓝色
@mixin blue {
  background: #e6effb;
  color: #005bd9;
}
// 棕色
@mixin brown {
  background: #fff6ec;
  color: #ffa336;
}
// 黄色
@mixin yellow {
  background: #fffae8;
  color: #f9c200;
}
// 白色
@mixin white {
  background: $base-line-1;
  color: $base-text-5;
}
// 灰色
@mixin gray {
  color: $base-text-5;
  background: $base-fill-4;
}
// 占位，解决点击自己写的自定义筛选 会冒泡到排序
::v-deep .el-table__column-filter-trigger {
  display: none !important;
}
::v-deep.filter-table {
  padding: 16px 0;
  .el-table__row .el-table__cell:first-child .cell {
    padding-left: 0;
    padding-right: 0;
  }
  // table状态标签颜色定义
  [class*='table-status'] {
    display: inline-block;
    border-radius: 4px;
    padding: 2.5px 12px;
  }
  // 蓝色
  [class*='table-status-blue'] {
    @include blue;
  }
  // 棕色
  [class*='table-status-brown'] {
    @include brown;
  }
  // 绿色
  [class*='table-status-green'] {
    @include green;
  }
  // 黄色
  [class*='table-status-yellow'] {
    @include yellow;
  }
  // 粉色
  [class*='table-status-pink'] {
    @include pink;
  }
  // 白色
  [class*='table-status-white'] {
    @include white;
  }
  // 灰色
  [class*='table-status-gray'] {
    @include gray;
  }
  //tab文本状态自定义
  // 粉色
  [class*='table-text-pink'] {
    @include pink;
  }
  // 棕色
  [class*='table-text-brown'] {
    @include brown;
  }
  // 绿色
  [class*='table-text-green'] {
    @include green;
  }
  [class*='table-text'] {
    background: none;
  }
}

.table-cell-label {
  cursor: pointer;
}
.el-table__cell:hover {
  .el-icon-arrow-down {
    display: block;
  }
}
.el-icon-arrow-down {
  display: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 5px;
}
// 窗帘
.zn-blinds {
  // height: 71px;
  padding: 16px 23px 15px 16px;
  position: absolute;
  top: -55px;
  left: 0;
  right: 0;
  z-index: 1;
  background: $base-fill-1;
  font-weight: 400;
  font-size: 16px;
  color: $base-text-5;
  display: flex;
  justify-content: space-between;
  //   transition: $base-transition;
  animation: blindsSport 0.3s ease-in-out;
  -webkit-animation: blindsSport 0.3s ease-in-out; /* Safari 与 Chrome */
  .zn-blinds-left,
  .zn-blinds-right {
    width: 50%;
    height: $base-input-height;
    line-height: $base-input-height;
  }
  .zn-blinds-right {
    text-align: right;
    .el-button {
      margin-left: 10px;
      margin-right: 10px;
      .zn-icon {
        margin-right: 5.75px !important;
      }
    }
  }
}
@keyframes blindsSport {
  from {
    top: -142px;
  }
  to {
    top: -55px;
  }
}
/* Safari 与 Chrome */
@-webkit-keyframes blindsSport {
  from {
    top: -142px;
  }
  to {
    top: -55px;
  }
}
</style>
