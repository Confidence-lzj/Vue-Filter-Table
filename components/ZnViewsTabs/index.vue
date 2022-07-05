<template>
  <el-row :gutter="0" class="views-tabs">
    <div
      class="tab"
      v-for="(item, index) in options.slice(0, 4)"
      :key="index"
      @click="setTabsActive(item, index)"
      :class="[
        index < 5 ? 'division' : '',
        activeIndex == index ? 'is-active' : '',
      ]"
    >
      <zn-icon :iconName="'icon-form'" v-if="item.type == 'table'" />
      <zn-icon :iconName="'icon-album'" v-if="item.type == 'gallery'" />
      <span class="views-tabs-title overflowOne">{{ item.title }}</span>
      <!-- 预留更多图标(编辑,删除) -->
      <!-- <el-col :span="6" class="pl-5 pr-5">
          <zn-icon :iconName="'icon-more'" />
        </el-col> -->
    </div>
    <!-- 预留超出4个tabs后显示更多 -->
    <!-- <el-col
      :span="4"
      class="tab mr-10"
      :class="activeIndex == -1 ? 'is-active' : ''"
    >
      <el-popover
        placement="bottom"
        popper-class="select-popover"
        trigger="click"
        width="136"
        :visible-arrow="false"
      >
        <el-col
          :span="24"
          v-for="(item, index) in options.slice(4)"
          :key="index"
          @click.native="setTabsActive(item, -1)"
        >
          <div class="pop-li">
            <zn-icon :iconName="'icon-form'" v-if="item.type == 'table'" />
            <zn-icon :iconName="'icon-album'" v-if="item.type == 'gallery'" />
            <span class="views-tabs-title overflowOne ml-5 mr-5">
              {{ item.title }}
            </span>
            <zn-icon :iconName="'icon-more'" />
          </div>
        </el-col>
        <el-col :span="24" slot="reference" @click.native="activeIndex=-1">
          <el-col :span="5">
            <zn-icon :iconName="'icon-form'" />
          </el-col>
          <el-col :span="19">
            <el-col :span="18">
              <span class="views-tabs-title overflowOne">
                更多视图({{ options.length - 4 }})
              </span>
            </el-col>
            <el-col :span="6" class="pl-5 pr-5">
              <zn-icon :iconName="'icon-arraw'" />
            </el-col>
          </el-col>
        </el-col>
      </el-popover>
    </el-col> -->
  </el-row>
</template>

<script>
export default {
  name: 'ZnViewsTabs',
  props: {
    options: {
      type: Array, // viewsTabs数据
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      activeName: '',
      activeIndex: 0,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.activeName = this.options[0].title
  },
  methods: {
    //  当前选中的名称
    setTabsActive(item, index) {
      this.activeIndex = index
      this.activeName = item.title
      this.$emit('upTable', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.views-tabs {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  .tab {
    height: 36px;
    line-height: 36px;
    position: relative;
    margin-right: 9px;
    display: flex;
    justify-content: flex-start;
    padding-right: 12px;
    cursor: pointer;
    .zn-icon {
      height: 36px;
      line-height: 36px;
      margin-left: 5px;
      margin-right: 5px;
      vertical-align: middle;
    }
    .views-tabs-title {
      vertical-align: middle;
    }
  }

  .is-active {
    color: $base-main-tone;
    .views-tabs-title{
      font-weight: 500;
    }
    .views-tabs-title::after {
      position: absolute;
      content: '';
      width: 64%;
      height: 2px;
      left: 50%;
      transform: translateX(-50%);
      margin-left: -2px;
      bottom: -10px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background-color: $base-main-tone;
    }
  }

  .division::after {
    position: absolute;
    content: '';
    width: 1px;
    height: 18px;
    top: 9px;
    right: 0;
    background-color: $base-line-1;
  }
}
</style>
