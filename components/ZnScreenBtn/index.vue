<template>
  <el-popover
    placement="bottom"
    trigger="click"
    width="641"
    popper-class="screen-management-btn-popover"
    :visible-arrow="false"
  >
    <div class="screen-management-header mb-10">设置筛选条件</div>
    <el-divider></el-divider>
    <section class="screen-management-main">
      <el-row :gutter="8" v-for="(item, index) in form.filters" :key="index">
        <el-col
          :span="4"
          v-if="index == 0"
          :class="index != 1 ? 'no-select-icon' : ''"
        >
          <el-select v-model="form.filters[index].where" :disabled="index != 1">
            <el-option
              v-for="item in conditionList1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" v-else :class="index != 1 ? 'no-select-icon' : ''">
          <el-select
            v-model="form.filters[1].where"
            :disabled="index != 1"
            @change="submitFilters"
          >
            <el-option
              v-for="item in conditionList2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="form.filters[index].field"
            placeholder="请选择"
            @change="handleField(index)"
          >
            <el-option
              v-for="item in options.fields"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="form.filters[index].exp"
            placeholder="请选择"
            @change="handlerValueType(index)"
          >
            <el-option
              v-for="item in getJudgeList(index)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <!--*  文本：text
            *  单选：radio
            *  多选：select
            *  日期：date
            *  人员：personnel
            *  附件：attachment
            *  数字：number
            *  复选框：checkBox
             -->
        <el-col
          :span="10"
          v-if="['null', 'notNull'].includes(form.filters[index].exp)"
        >
          <el-col :span="24"></el-col>
        </el-col>
        <el-col
          :span="10"
          v-else
          :class="
            form.filters[index].type == 'checkBox' ? '' : 'col-special-style'
          "
        >
          <!-- 文本：text -->
          <el-col :span="24" v-if="form.filters[index].type == 'text'">
            <el-input
              v-model="form.filters[index].options.valueStr"
              placeholder="请输入"
              @input="submitFilters"
            />
          </el-col>
          <!-- 单选：radio -->
          <el-col :span="24" v-if="form.filters[index].type == 'radio'">
            <el-radio-group
              v-model="form.filters[index].options.valueStr"
              @change="submitFilters"
              class="col-radio"
            >
              <el-radio
                v-for="(item, index) in getData(index).param"
                :key="index"
                :label="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-col>
          <!-- 多选：select -->
          <el-col :span="24" v-if="form.filters[index].type == 'select'">
            <el-select
              v-model="form.filters[index].options.valueArray"
              multiple
              collapse-tags
              placeholder="请选择"
              @change="submitFilters"
            >
              <el-option
                v-for="item in getData(index).param"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <!-- 日期：date -->
          <el-col
            :span="24"
            v-if="form.filters[index].type == 'date'"
            class="col-special-style"
          >
            <el-col :span="11">
              <el-select
                v-model="form.filters[index].options.valueType"
                @change="submitFilters"
              >
                <el-option
                  v-for="item in getData(index).param"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col
              :span="13"
              v-if="form.filters[index].options.valueType == '-1'"
            >
              <el-date-picker
                v-model="form.filters[index].options.valueStr"
                type="date"
                prefix-icon=""
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                @change="submitFilters"
              ></el-date-picker>
            </el-col>
            <el-col :span="13" v-else></el-col>
          </el-col>
          <!-- 人员：personnel -->
          <el-col :span="24" v-if="form.filters[index].type == 'personnel'">
            <el-select
              v-model="form.filters[index].options.valueStr"
              @change="submitFilters"
            >
              <el-option
                v-for="item in getData(index).param"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <!-- 附件：attachment -->
          <el-col :span="24" v-if="form.filters[index].type == 'attachment'">
            <el-input
              v-model="form.filters[index].options.valueStr"
              placeholder="请输入"
              @input="submitFilters"
            />
          </el-col>
          <!-- 数字：number -->
          <el-col :span="24" v-if="form.filters[index].type == 'number'">
            <el-input
              v-model="form.filters[index].options.valueStr"
              placeholder="请输入"
              @input="submitFilters"
            />
          </el-col>
          <!-- 复选框：checkBox -->
          <el-col
            :span="24"
            v-if="form.filters[index].type == 'checkBox'"
            class="col-checkbox"
          >
            <!-- <el-checkbox-group v-model="form.filters[index].options.valueArray">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="禁用" disabled></el-checkbox>
              <el-checkbox label="选中且禁用" disabled></el-checkbox>
            </el-checkbox-group> -->
            <!-- <el-select
              v-model="form.filters[index].options.valueArray"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option
                v-for="item in getData(index).param"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
          </el-col>
        </el-col>

        <el-col :span="1" class="icon-close font-color">
          <zn-icon :iconName="'icon-close'" @click="delCurrentRow(index)" />
        </el-col>
      </el-row>
    </section>
    <el-col :span="24" class="add">
      <el-button
        class="screen-button font-color"
        type="text"
        size="medium"
        @click="addCurrentRow"
      >
        <zn-icon :iconName="'icon-add'" />
        添加条件
      </el-button>
    </el-col>
    <el-button
      class="screen-button font-normal"
      type="text"
      size="medium"
      slot="reference"
    >
      <zn-icon :iconName="'icon-filter'" />
      <span>筛选</span>
    </el-button>
  </el-popover>
</template>

<script>
import { filterRules, saveFilters } from "@/api/index";
export default {
  name: "ZnScreenBtn",
  components: {},
  props: {
    options: {
      type: Object, // 字段管理数据
      default: () => {},
    },
    views_id: {
      type: String, // 视图ID
      default: () => "",
    },
    mark: {
      type: String, // mark特定标识
      default: () => "",
    },
  },
  data() {
    return {
      checkList: ["选中且禁用", "复选框 A"],
      judgeList: [],
      conditionList1: [{ value: "when", label: "当" }],
      conditionList2: [
        { value: "and", label: "并且" },
        { value: "or", label: "或者" },
      ],
      form: {
        mark: this.mark, //页面标识
        views_id: "", //视图ID
        filters: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getFilterRules();
  },
  mounted() {},
  methods: {
    // 获取全局定义筛选规则
    getFilterRules() {
      filterRules().then((res) => {
        this.judgeList = res.data;
        // 数据示例
        // res.data = {
        //   text: [
        //     { label: "等于", value: "=" },
        //     { label: "不等于", value: "<>" },
        //     { label: "包含", value: "like" },
        //     { label: "不包含", value: "notLike" },
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        //   radio: [
        //     { label: "等于", value: "=" },
        //     { label: "不等于", value: "<>" },
        //     { label: "包含", value: "like" },
        //     { label: "不包含", value: "notLike" },
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        //   select: [
        //     { label: "等于", value: "=" },
        //     { label: "不等于", value: "<>" },
        //     { label: "包含", value: "like" },
        //     { label: "不包含", value: "notLike" },
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        //   date: [
        //     { label: "等于", value: "=" },
        //     { label: "不等于", value: "<>" },
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        //   personnel: [
        //     { label: "等于", value: "=" },
        //     { label: "不等于", value: "<>" },
        //     { label: "包含", value: "like" },
        //     { label: "不包含", value: "notLike" },
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        //   attachment: [
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        //   number: [
        //     { label: "=", value: "=" },
        //     { label: "≠", value: "<>" },
        //     { label: ">", value: ">" },
        //     { label: "≥", value: ">=" },
        //     { label: "<", value: "<" },
        //     { label: "≤", value: "<=" },
        //     { label: "包含", value: "like" },
        //     { label: "不包含", value: "notLike" },
        //     { label: "为空", value: "null" },
        //     { label: "不为空", value: "notNull" },
        //   ],
        // };
      });
    },
    // 添加一行筛选条件
    addCurrentRow() {
      this.form.filters.push({
        where: "", //when:当，and:并且，or:或者
        exp: this.judgeList[this.getDefaultType()][0].value, //表达式 筛选规则对应当value
        field: this.options.fields[0].name, //字段名 表头对应当name
        type: this.getDefaultType(),
        options: {
          valueStr: "", //值为字符串
          valueArray: "", //值为数组
          valueType: "", //对应value的类型 例：日期的今日、昨日等
        },
      });
      if (this.form.filters.length == 1) {
        this.form.filters[0].where = this.conditionList1[0].value;
      } else if (this.form.filters.length == 2) {
        this.form.filters[1].where = this.conditionList2[0].value;
      } else {
        this.form.filters[2].where = this.form.filters[1].where;
      }
      this.submitFilters();
    },
    // 删除当前行筛选条件
    delCurrentRow(index) {
      this.form.filters.splice(index, 1);
      if (this.form.filters.length > 0) {
        this.form.filters[0].where = this.conditionList1[0].value;
      }
      if (this.form.filters.length > 1) {
        this.form.filters[1].where = this.conditionList2[0].value;
      }
      this.submitFilters();
    },
    getJudgeList(index) {
      return this.judgeList[this.form.filters[index].type];
    },
    getDefaultType() {
      let obj = this.options.fields.find((item) => {
        return item.name == this.options.fields[0].name;
      });
      return obj.type;
    },
    // 联动数据返回
    getData(index) {
      let obj = {};
      if (this.form.filters[index].field && this.options.fields) {
        //父传子 第一次是options=[]
        obj = this.options.fields.find((item) => {
          return item.name == this.form.filters[index].field;
        });
      } else {
        obj.type = "text";
      }
      return obj;
    },
    // 操作第二列-字段
    handleField(index) {
      this.form.filters[index].options.valueStr = "";
      this.form.filters[index].options.valueType = "";
      this.form.filters[index].options.valueArray = "";
      this.form.filters[index].type = this.getData(index).type;
      this.form.filters[index].exp = this.getJudgeList(index)[0].value;
      // 设置默认值
      if (
        ["date", "select", "checkBox", "radio"].includes(
          this.form.filters[index].type
        )
      ) {
        // 目前只针对日期类型的(以后再有扩展的,用includes去匹配)
        if (["date"].includes(this.form.filters[index].type)) {
          this.form.filters[index].options.valueType =
            this.getData(index).param[0].value;
        } else {
          this.form.filters[index].options.valueType = "";
        }
      }
      this.submitFilters();
    },
    // 操作第三列-条件
    handlerValueType(index) {
      this.form.filters[index].options.valueStr = "";
      this.form.filters[index].options.valueType = "";
      this.form.filters[index].options.valueArray = "";
      if (
        ["date"].includes(this.form.filters[index].type) &&
        !["Null", "NotNull"].includes(this.form.filters[index].exp)
      ) {
        this.form.filters[index].options.valueType =
          this.getData(index).param[0].value;
      }
      this.submitFilters();
    },
    // 保存筛选条件
    submitFilters() {
      this.form.views_id = this.views_id;
      saveFilters(this.form).then((res) => {
        if (res.code == 200) {
          this.$emit("upTable"); //更新父级列表数据
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$size-40: 40px;
@mixin size {
  height: $size-40 !important;
  line-height: $size-40 !important;
}

// 还原UI设计尺寸
.screen-management-main {
  max-height: 336px;
  overflow-y: auto;
  .col-special-style {
    padding: 0 !important;
    border: none;
  }
  .col-radio {
    .el-radio {
      margin-right: 10px;
    }
  }
  .col-checkbox,
  .col-radio {
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
  ::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
}
.icon-close {
  max-height: $size-40;
  line-height: $size-40;
  text-align: center;
}
.el-row {
  margin: 0 0 8px 0 !important;
}
::v-deep.el-col {
  @include size;
  border: 1px solid transparent; //el-col没有内容时占位
  .el-select {
    width: 100%;
  }
  .el-input {
    .el-input__inner {
      @include size;
    }
  }
  .el-date-editor {
    width: 100%;
    .el-input__inner {
      padding-left: 15px;
    }
    .el-input__prefix {
      display: none;
    }
  }
  .el-radio-group {
    @include size;
    .el-radio {
      @include size;
    }
  }
}
::v-deep.no-select-icon {
  .el-select {
    .el-input {
      .el-input__suffix {
        display: none;
      }
    }
    .is-disabled {
      .el-input__inner {
        cursor: auto;
        background: $base-fill-1;
        color: $base-text-5;
      }
    }
  }
}
.screen-management-header {
  font-weight: 600;
}
.el-divider--horizontal {
  margin: 16px 0 16px 0 !important;
}
.font-color {
  color: $base-line-4;
}
.add {
  margin-top: 13px;
}
</style>
