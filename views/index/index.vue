<template>
  <div class="workOrder-container">
    <zn-query-form>
      <zn-query-form-left-panel>
        <zn-views-tabs :options="viewsTabsOptions" @upTable="getHeader" />
      </zn-query-form-left-panel>
      <zn-query-form-right-panel>
        <!-- 搜索 -->
        <zn-search-btn @up-Search="upSearch" />
        <!-- 筛选 -->
        <zn-screen-btn
          ref="ZnScreenBtn"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upTable="fetchData"
        />
        <!-- 字段管理 -->
        <zn-field-management-btn
          ref="ZnFieldManagementBtn"
          v-if="viewsType == 'table'"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upTable="upTableData"
        />
        <!-- 卡片管理 -->
        <zn-card-management-btn
          ref="ZnCardManagementBtn"
          v-if="viewsType == 'gallery'"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upCard="upCardData"
        />
        <!-- 导出全部 -->
        <el-button type="primary" size="medium" plain @click="reportAll">
          <zn-icon :iconName="'emport'" />
          导出
        </el-button>
        <el-button
          class="el-add"
          type="primary"
          size="medium"
          @click="addWorkOrder"
        >
          <zn-icon :iconName="'callcenter-add'" />
          新建工单
        </el-button>
      </zn-query-form-right-panel>
    </zn-query-form>
    <!-- 相册试图页面 -->
    <div
      v-if="viewsType === 'gallery'"
      class="content-view album-view"
      v-infinite-scroll="loadMore"
      :infinite-scroll-immediate="false"
    >
      <zn-filter-album
        ref="filterAlbum"
        :albumData="tableList"
        :finallyColumns="finallyColumns"
        :deatilsPath="deatilsPath"
        :indexColumn="indexColumn"
        @fetch-data="fetchData"
      />
    </div>
    <!-- 表格试图页面 -->
    <div class="content-view table-view" v-else>
      <zn-filter-table
        v-if="viewsType == 'table'"
        ref="filterTable"
        :class="total === 0 ? 'table-view-empty' : ''"
        :multiple="true"
        :tableData="tableList"
        :finallyColumns="finallyColumns"
        :deatilsPath="deatilsPath"
        @selectList="getSelect"
        @fetch-data="fetchData"
        :defaultPageImgUrl="
          require('@/assets/images/default_page/pic-currency.png')
        "
        :defaultPageTips="'暂无数据'"
      >
        <el-button type="text" size="medium" @click="reportPart">
          <zn-icon :iconName="'emport'" />
          <span>导出选中</span>
        </el-button>
      </zn-filter-table>
      <zn-pagination
        v-show="total > 0"
        :page.sync="queryForm.page"
        :limit.sync="queryForm.listRows"
        @pagination="fetchData"
        :total="total"
        :algin="'right'"
        class="table-pagination"
      />
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/workOrder";
import { getTableHeader, viewsTabs, filters } from "@/api/index";
export default {
  name: "WorkOrder",
  props: {},
  components: {},
  data() {
    return {
      mark: "WorkOrderList",
      viewsType: "", //当前页面显示视图类型
      total: 0,
      tableList: [],
      viewsTabsOptions: [], // viewsTabs数据
      managementOptions: {}, // 字段、卡片管理数据
      listLoading: false,
      queryForm: {
        page: 1,
        listRows: 20,
        keywords: "",
        views_id: "", //当前页面显示视图ID
      },
      deatilsPath: "/workOrder/workOrderDetail", //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      indexColumn: "", // 相册视图标题字段
    };
  },
  computed: {
    finallyColumns() {
      if (this.checkList.length > 0) {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        );
      }
    },
  },
  watch: {},
  created() {
    this.getViewsTabs();
  },
  mounted() {},
  methods: {
    addWorkOrder() {},
    // 顶栏左侧viewsTabs
    getViewsTabs() {
      viewsTabs({ mark: this.mark }).then((res) => {
        this.viewsTabsOptions = res.data;
        // 数据示例
        // res.data = [
        //   {
        //     id: "workOrderList",
        //     title: "全部工单",
        //     type: "table",
        //     property: [],
        //   },
        // ];
        if (res.code == 200 && res.data.length > 0) {
          this.queryForm.views_id = res.data[0].id; // 更新当前页面显示视图ID
          this.viewsType = res.data[0].type; // 更新当前页面显示视图类型
          this.getFilters(); //回显筛选
          this.getHeader();
          if (res.data[0].type === "table") {
            //判断当前视图展示类型
            this.fetchData();
          } else {
            this.fetchAlbumData();
          }
        }
      });
    },
    // 获取已保存的筛选规则
    getFilters() {
      filters({ mark: this.mark, views_id: this.queryForm.views_id }).then(
        (res) => {
          //  数据示例
          // res.data = {
          //   filters: [
          //     {
          //       exp: "=",
          //       type: "radio",
          //       field: "status",
          //       where: "when",
          //       options: { valueStr: 1, valueType: "", valueArray: "" },
          //     },
          //   ],
          // };
          if (this.$refs.ZnScreenBtn) {
            this.$refs.ZnScreenBtn.form.filters = res.data.filters;
          }
        }
      );
    },
    // 顶栏右侧字段管理、卡片管理
    async getHeader(obj) {
      getTableHeader({
        mark: this.mark,
        views_id: obj ? obj.id : this.queryForm.views_id,
      }).then((res) => {
        //  数据示例
        // res.data = {
        //   options: {},
        //   fields: [
        //     {
        //       id: 0,
        //       name: "order_code",
        //       label: "工单编号",
        //       type: "text",
        //       param: "",
        //       isShow: true,
        //       extra: { icon: "icon-text" },
        //     },
        //     {
        //       id: 1,
        //       name: "title",
        //       label: "标题",
        //       type: "text",
        //       param: "",
        //       isShow: true,
        //       extra: { icon: "icon-text" },
        //     },
        //     {
        //       id: 2,
        //       name: "priority",
        //       label: "优先级",
        //       type: "radio",
        //       param: [
        //         { value: 1, label: "低" },
        //         { value: 2, label: "中" },
        //         { value: 3, label: "高" },
        //         { value: 4, label: "紧急" },
        //       ],
        //       isShow: true,
        //       extra: {
        //         icon: "icon-danxuan",
        //         columnStyle: "labelTags",
        //         labelTags: {
        //           2: "table-text-green",
        //           3: "table-text-brown",
        //           4: "table-text-pink",
        //         },
        //       },
        //     },
        //     {
        //       id: 3,
        //       name: "type",
        //       label: "工单类型",
        //       type: "select",
        //       param: [{ value: 1, label: "普通工单" }],
        //       isShow: true,
        //       extra: { icon: "icon-duoxuan" },
        //     },
        //     {
        //       id: 4,
        //       name: "status",
        //       label: "工单状态",
        //       type: "radio",
        //       param: [
        //         { value: 0, label: "开启" },
        //         { value: 1, label: "关闭" },
        //       ],
        //       isShow: true,
        //       extra: {
        //         icon: "icon-danxuan",
        //         columnStyle: "labelTags",
        //         labelTags: ["table-status-green", "table-status-pink"],
        //       },
        //     },
        //     {
        //       id: 5,
        //       name: "deal_status",
        //       label: "处理状态",
        //       type: "radio",
        //       param: [
        //         { value: 1, label: "处理中" },
        //         { value: 2, label: "处理完成" },
        //         { value: 3, label: "无法处理" },
        //       ],
        //       isShow: true,
        //       extra: {
        //         icon: "icon-danxuan",
        //         columnStyle: "labelTags",
        //         labelTags: {
        //           1: "table-status-green",
        //           2: "table-status-pink",
        //           3: "table-status-pink",
        //         },
        //       },
        //     },
        //     {
        //       id: 6,
        //       name: "demand_type",
        //       label: "需求分类",
        //       type: "radio",
        //       param: [
        //         { value: 2, label: "紧急救援-110援助" },
        //         { value: 3, label: "紧急救援-120援助" },
        //         { value: 4, label: "紧急救援-119援助" },
        //         { value: 5, label: "紧急救援-其他" },
        //         { value: 31, label: "紧急救援-联系家属" },
        //         { value: 7, label: "牵线搭桥-家电维修" },
        //         { value: 8, label: "牵线搭桥-家政服务" },
        //         { value: 9, label: "牵线搭桥-理发服务" },
        //         { value: 10, label: "牵线搭桥-洗澡服务" },
        //         { value: 11, label: "牵线搭桥-送餐服务" },
        //         { value: 12, label: "牵线搭桥-送药服务" },
        //         { value: 13, label: "牵线搭桥-代为挂号" },
        //         { value: 14, label: "牵线搭桥-代叫出租" },
        //         { value: 15, label: "牵线搭桥-村/居委会协商" },
        //         { value: 16, label: "牵线搭桥-其他" },
        //         { value: 18, label: "公用事业服务-水电煤" },
        //         { value: 19, label: "公用事业服务-有线电视" },
        //         { value: 20, label: "公用事业服务-无线网络" },
        //         { value: 21, label: "公用事业服务-其他" },
        //         { value: 23, label: "售后服务-话机维修" },
        //         { value: 24, label: "售后服务-指导使用" },
        //         { value: 25, label: "售后服务-其他" },
        //         { value: 32, label: "售后服务-电话测试" },
        //         { value: 27, label: "沟通咨询-服务咨询" },
        //         { value: 28, label: "沟通咨询-政策咨询" },
        //         { value: 29, label: "沟通咨询-日常沟通" },
        //         { value: 30, label: "沟通咨询-其他" },
        //         { value: 34, label: "其他服务-无声来电" },
        //         { value: 36, label: "其他服务-其他" },
        //       ],
        //       isShow: true,
        //       extra: { icon: "icon-danxuan" },
        //     },
        //     {
        //       id: 7,
        //       name: "deal_user_id",
        //       label: "处理者",
        //       type: "personnel",
        //       param: [
        //         { value: 1, label: "admin" },
        //         { value: 6, label: "沈瑜" },
        //         { value: 8, label: "袁文慧" },
        //         { value: 10, label: "夜班" },
        //         { value: 12, label: "汪晓东" },
        //         { value: 14, label: "陈斌" },
        //         { value: 16, label: "保安" },
        //         { value: 17, label: "张光明" },
        //         { value: 18, label: "王巧兰" },
        //         { value: 19, label: "陈礼华" },
        //         { value: 111, label: "测试成员" },
        //       ],
        //       isShow: true,
        //       extra: { icon: "icon-people" },
        //     },
        //     {
        //       id: 8,
        //       name: "member_name",
        //       label: "姓名",
        //       type: "text",
        //       param: "",
        //       isShow: true,
        //       extra: { icon: "icon-text" },
        //     },
        //     {
        //       id: 9,
        //       name: "phone",
        //       label: "联系电话",
        //       type: "text",
        //       param: "",
        //       isShow: true,
        //       extra: { icon: "icon-text", columnStyle: "labelCall" },
        //     },
        //     {
        //       id: 10,
        //       name: "id_card",
        //       label: "身份证号",
        //       type: "text",
        //       param: "",
        //       isShow: true,
        //       extra: { icon: "icon-text" },
        //     },
        //     {
        //       id: 11,
        //       name: "end_time",
        //       label: "预计结束时间",
        //       type: "date",
        //       param: [
        //         { label: "今天", value: "1" },
        //         { label: "明天", value: "2" },
        //         { label: "昨天", value: "3" },
        //         { label: "本周", value: "4" },
        //         { label: "上周", value: "5" },
        //         { label: "本月", value: "6" },
        //         { label: "上月", value: "7" },
        //         { label: "指定日期", value: "-1" },
        //       ],
        //       isShow: true,
        //       extra: { icon: "icon-date" },
        //     },
        //     {
        //       id: 12,
        //       name: "create_time",
        //       label: "创建日期",
        //       type: "date",
        //       param: [
        //         { label: "今天", value: "1" },
        //         { label: "明天", value: "2" },
        //         { label: "昨天", value: "3" },
        //         { label: "本周", value: "4" },
        //         { label: "上周", value: "5" },
        //         { label: "本月", value: "6" },
        //         { label: "上月", value: "7" },
        //         { label: "指定日期", value: "-1" },
        //       ],
        //       isShow: true,
        //       extra: { icon: "icon-date" },
        //     },
        //     {
        //       id: 13,
        //       name: "create_user_id",
        //       label: "创建者",
        //       type: "personnel",
        //       param: [
        //         { value: 1, label: "admin" },
        //         { value: 6, label: "沈瑜" },
        //         { value: 8, label: "袁文慧" },
        //         { value: 10, label: "夜班" },
        //         { value: 12, label: "汪晓东" },
        //         { value: 14, label: "陈斌" },
        //         { value: 16, label: "保安" },
        //         { value: 17, label: "张光明" },
        //         { value: 18, label: "王巧兰" },
        //         { value: 19, label: "陈礼华" },
        //         { value: 111, label: "测试成员" },
        //       ],
        //       isShow: true,
        //       extra: { icon: "icon-people" },
        //     },
        //   ],
        // };
        this.managementOptions = res.data; //字段管理、卡片管理
        this.columns = res.data.fields; //table列(未经卡片管理、字段管理筛选的数据)
        this.indexColumn = res.data.options.indexColumn;
        if (obj) {
          this.queryForm.views_id = obj.id; // 更新当前页面显示视图ID
          this.viewsType = obj.type; // 更新当前页面显示视图类型
          this.getFilters(); //回显筛选
          // 更新数据
          if (obj.type === "table") {
            this.fetchData();
          } else {
            this.tableList = [];
            this.queryForm.page = 1;
            this.loadMore();
          }
        }
        this.managementOptions.fields.map((item) => {
          if (item.isShow == true) {
            this.checkList.push(item.label);
          }
        });
      });
    },
    // 请求table数据
    async fetchData() {
      this.listLoading = true;
      const {
        data: { data, total },
      } = await getList(this.queryForm);
      // 数据示例
      // data = {
      //   total: 3,
      //   per_page: 20,
      //   current_page: 1,
      //   last_page: 1,
      //   data: [
      //     {
      //       id: 11,
      //       order_code: "GD20220704236",
      //       priority: { value: 3, label: "高" },
      //       type: { value: 1, label: "普通工单" },
      //       title: "米恩测试工单",
      //       member_id: { value: 0, label: "" },
      //       member_name: "尼古拉斯",
      //       phone: "15858287008",
      //       id_card: "620302196409200377",
      //       describe: "米恩工单描述",
      //       status: { value: 1, label: "关闭" },
      //       info_data: [],
      //       end_time: { value: false, label: "2022/07/04 00:00:00" },
      //       province: { value: "", label: " -- " },
      //       city: { value: "", label: " -- " },
      //       area: { value: "", label: " -- " },
      //       street: { value: "", label: " -- " },
      //       committee: { value: "", label: " -- " },
      //       address: "上海市市辖区松江区岳阳街道龙潭社区居委会",
      //       audio_url: "",
      //       create_time: "2022-07-04 18:07:00",
      //       update_time: "2022-07-04 21:59:54",
      //       create_user_id: { value: 1, label: "admin" },
      //       deal_user_id: { value: 111, label: "测试成员" },
      //       deal_status: { value: 1, label: "处理中" },
      //       demand_type: { value: "31", label: "紧急救援-联系家属" },
      //       status_time: "2022/07/04 21:59:54",
      //       app_id: 1,
      //     },
      //     {
      //       id: 2,
      //       order_code: "GD20220527731",
      //       priority: { value: 1, label: "低" },
      //       type: { value: 1, label: "普通工单" },
      //       title:
      //         "问问问问问问问问问问问问问问问问问问问问问问问问问问问问问问",
      //       member_id: { value: 2293777, label: "李贡生" },
      //       member_name: "李贡生",
      //       phone: "16601890542",
      //       id_card: "310227194411214233",
      //       describe: "111",
      //       status: { value: 1, label: "关闭" },
      //       info_data: [],
      //       end_time: { value: false, label: "2022/05/27 00:00:00" },
      //       province: { value: "", label: " -- " },
      //       city: { value: "", label: " -- " },
      //       area: { value: "", label: " -- " },
      //       street: { value: "", label: " -- " },
      //       committee: { value: "", label: " -- " },
      //       address: "上海",
      //       audio_url: "",
      //       create_time: "2022-05-27 10:54:18",
      //       update_time: "2022-07-04 18:33:19",
      //       create_user_id: { value: 1, label: "admin" },
      //       deal_user_id: { value: 0, label: "" },
      //       deal_status: { value: 1, label: "处理中" },
      //       demand_type: { value: "2", label: "紧急救援-110援助" },
      //       status_time: "2022/07/03 16:38:42",
      //       app_id: 1,
      //     },
      //     {
      //       id: 1,
      //       order_code: "GD20220526283",
      //       priority: { value: 3, label: "高" },
      //       type: { value: 1, label: "普通工单" },
      //       title: "13栋老人有修水电的需求",
      //       member_id: { value: 2293785, label: " -- " },
      //       member_name: "王金芳",
      //       phone: "1356417532",
      //       id_card: "310227194903144243",
      //       describe: "厕所灯泡需要更换",
      //       status: { value: 1, label: "关闭" },
      //       info_data: [],
      //       end_time: { value: false, label: "2022/05/28 00:00:00" },
      //       province: { value: "", label: " -- " },
      //       city: { value: "", label: " -- " },
      //       area: { value: "", label: " -- " },
      //       street: { value: "", label: " -- " },
      //       committee: { value: "", label: " -- " },
      //       address: "松江叶榭镇张泽八字桥镇南7号102室",
      //       audio_url: "",
      //       create_time: "2022-05-26 10:23:31",
      //       update_time: "2022-07-04 18:35:15",
      //       create_user_id: { value: 1, label: "admin" },
      //       deal_user_id: { value: 0, label: "" },
      //       deal_status: { value: 1, label: "处理中" },
      //       demand_type: { value: "3", label: "紧急救援-120援助" },
      //       status_time: "2022/07/04 17:57:25",
      //       app_id: 1,
      //     },
      //   ],
      // };
      this.tableList = data;
      this.total = total;
      this.listLoading = false;
    },
    // 请求album数据
    async fetchAlbumData() {
      this.listLoading = true;
      const {
        data: { data, total, last_page },
      } = await getList(this.queryForm);
      this.tableList = this.tableList.concat(data);
      if (this.queryForm.page >= last_page + 1) {
        this.queryForm.page = last_page + 1;
      } else {
        this.queryForm.page = this.queryForm.page + 1;
      }
      this.total = total;
      this.listLoading = false;
    },
    // 更新搜索字段,更新table数据
    upSearch(val) {
      this.tableList = [];
      this.queryForm.page = 1;
      this.queryForm.keywords = val;
      if (this.viewsType === "table") {
        this.fetchData();
      } else {
        this.loadMore();
      }
    },
    // 获取多选选中的table数据(需求未出,功能暂留)
    getSelect(list) {
      this.moreList = list;
    },
    // 卡片管理子组件条件返回,更新表格视图
    upTableData(columns, checkList) {
      this.columns = columns; //所有表头
      this.checkList = checkList; //对应表头
    },
    // 卡片管理子组件条件返回,更新表格视图
    upCardData(columns, checkList, showLabel) {
      this.columns = columns; //所有表头
      this.checkList = checkList; //对应表头
      this.showLabel = showLabel; //卡片视图中是否显示label
    },
    // 无线加载
    loadMore() {
      this.queryForm.listRows = 6;
      this.fetchAlbumData();
    },
    // 导出选中
    reportPart() {},
    // 导出全部
    reportAll() {},
  },
};
</script>

<style lang="scss" scoped>
.workOrder-container {
  height: calc(100vh - 60px - 50px - 16px * 2);
  ::v-deep .add-workorder-drawer {
    position: absolute;
  }
  .el-add {
    margin-right: 0 !important;
  }
  .content-view {
    height: calc(100% - 55px);
    &.album-view {
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 16px 16px;
    }
    &.table-view {
      position: relative;
    }
    // 分页样式
    .filter-table {
      height: calc(100% - 69px);
      padding-bottom: 0;
      &.table-view-empty {
        height: 100%;
      }
      ::v-deep .el-table {
        height: 100%;
        .el-table__body-wrapper {
          height: calc(100% - 48px);
          overflow: auto;
        }
      }
    }
  }
}
</style>
