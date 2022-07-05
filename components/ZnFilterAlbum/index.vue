<template>
  <div class="filter-album">
    <!-- 相册 -->
    <el-row :gutter="16">
      <el-col
        :span="24 / rowNumber"
        v-for="(card, index) in albumData"
        :key="index"
      >
        <el-card class="album-card" @click.native="goDetail(card)">
          <!-- 封面图片 -->
          <div class="album-image"></div>
          <!-- 卡片内容 -->
          <div class="album-info">
            <dl class="album-info-dl">
              <!-- 大标题单独处理 -->
              <dt class="flex-center pb-8" v-if="title">
                <zn-icon :iconName="title.extra.icon" />
                <span
                  class="name pl-10"
                  v-if="typeof card[title.name] === 'string'"
                >
                  {{ card[title.name] }}
                </span>
                <span class="name pl-10" v-else>
                  {{ card[title.name].label }}
                </span>
              </dt>
              <div class="pl-28 mb-10 mt-10" v-if="card.task_end_tag">
                <el-tag type="danger">{{ card.task_end_tag }}</el-tag>
                <el-tag>{{ card.plan_type.label }}</el-tag>
              </div>
              <!-- 非大标题部分循环 -->
              <dd
                class="flex-center pl-28 pt-6 pb-6"
                v-for="item in filterFinallyColumns"
                :key="item.id"
              >
                <zn-icon :iconName="item.extra.icon" />
                <span class="info-label pl-8" v-if="showLabel">
                  {{ item.label }}
                </span>
                <!-- value为 字符串 格式 -->
                <div
                  class="info-value flex-center pl-8"
                  v-if="typeof card[item.name] === 'string'"
                >
                  {{ card[item.name] }}
                  <!-- 拨打电话 -->
                  <div
                    v-if="item.extra.columnStyle === 'labelCall'"
                    class="call-btn flex-center ml-8"
                    @click.stop="makeACall(card[item.name])"
                  >
                    <zn-icon :iconName="'callcenter-phone'" />
                  </div>
                </div>
                <!-- value为 对象{lable value} 格式 -->
                <div class="info-value pl-8" v-else>
                  <!-- 特殊样式-优先级 -->
                  <el-tag
                    class="el-tag-priority"
                    v-if="item.name === 'priority'"
                  >
                    {{ card[item.name].label }}
                  </el-tag>
                  <span v-else>
                    {{ card[item.name].label }}
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'ZnFilterAlbum',
    props: {
      rowNumber: {
        type: Number, // 一排显示几个
        default: () => 3,
      },
      albumData: {
        type: Array, // album数据
        default: () => [],
      },
      finallyColumns: {
        type: Array, // table数据
        default: () => [],
      },
      deatilsPath: {
        type: String,
        default: () => '',
      },
      indexColumn: {
        type: String, // 标题字段名称
        required: true,
      },
      showLabel: {
        type: Boolean, // 是否显示字段名称
        default: () => true,
      },
    },
    data() {
      return {
        multipleSelection: [], //album多选数据
      }
    },
    methods: {
      // 跳转详情
      goDetail(item) {
        if (this.deatilsPath) {
          this.$router.push({
            path: this.deatilsPath,
            query: {
              id: item.id,
            },
          })
        } else {
          // this.$baseMessage(
          //   '请配置所需要跳转的路径',
          //   'warning',
          //   'zn-hey-message-warning'
          // )
          return false
        }
      },
      // 拨打电话
      makeACall(num) {
        // console.log('num', num)
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
    },
    computed: {
      // 根据 indexColumn 字段筛选大标题
      title() {
        return this.finallyColumns.find(
          (item) => item.name === this.indexColumn
        )
      },
      // 过滤去除 indexColumn 字段
      filterFinallyColumns() {
        return this.finallyColumns.filter(
          (item) => item.name !== this.indexColumn
        )
      },
    },
  }
</script>

<style lang="scss" scoped>
  .album-card {
    background: $base-fill-2;
    border: none;
    border-radius: 8px;
    box-shadow: none;
    margin-bottom: 0px !important;
    margin-top: 16px;
    cursor: pointer;
    &:hover {
      background: #fff;
      box-shadow: 0px 1px 10px 0px #0000001a;
    }
    ::v-deep .el-card__body {
      padding: 0;
    }
    .album-info {
      padding: 16px 18px 10px;
    }
    .album-info-dl {
      dt {
        .name {
          font-size: 18px;
          font-weight: 500;
          line-height: 28px;
          color: $base-text-5;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .zn-icon {
          min-width: 18px;
          width: 18px;
          height: 18px;
          color: $base-text-5;
        }
      }
      dd {
        .zn-icon {
          min-width: 14px;
          width: 14px;
          height: 14px;
          color: $base-text-3;
        }
        .info-label {
          min-width: 64px;
          line-height: 22px;
          color: $base-text-3;
        }
        .info-value {
          flex: 1;
          line-height: 22px;
          color: $base-text-5;
        }
        // 电话图标样式
        .call-btn {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          background: #e8fff0;
          justify-content: center;
          .zn-icon {
            color: #00b47e;
          }
        }
        // 优先级样式
        .el-tag-priority {
          border: none;
          padding: 0 12px;
          line-height: 24px;
          background: #ffece8;
          color: #f53f3f;
        }
      }
    }
  }
</style>
