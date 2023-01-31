<template>
  <div class="table-content" ref="content">
    <el-table :data="table.tableData" empty-text="暂无数据~" border ref="table" :height="tableHeightComputed"
      @select="select" @select-all="selectAll" @row-click="rowClick" :tree-props="treeProps" row-key="id">
      <template v-for="(item, index) in table.header">
        <template v-if="item.selection">
          <el-table-column type="selection" :width="item.width" :min-width="item.minWidth" :key="index" align="center">
            <!-- 表头复选框 -->
          </el-table-column>
        </template>
        <template v-else-if="item.dia">
          <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed"
            :min-width="item.minWidth" :key="index" align="center">
            <!-- 弹窗显示 -->
            <template slot-scope="scope">
              <el-button v-for="(btn, ind) in item.tableOption" :key="ind" :type="btn.type"
                @click="openDia(btn.methods, scope.row[item.prop])">
                {{ btn.label }}
              </el-button>
            </template>
          </el-table-column>
        </template>
        <el-table-column v-else-if="item.status" :prop="item.prop" :label="item.label" :min-width="item.minWidth"
          :width="item.width" :fixed="item.fixed" :key="item.prop" align="center">
          <!-- 状态渲染 0-n -->
          <template slot-scope="scope">
            <div :style="`color:${changeDisabled(scope.row[item.prop], item.bgc)};`">{{ scope.row[item.prop] |
    changeStatus(item.filters)
}}</div>
          </template>
        </el-table-column>
        <template v-else-if="item.color">
          <el-table-column :prop="item.prop" :label="item.label" :min-width="item.minWidth" :width="item.width"
            :fixed="item.fixed" :key="item.prop" align="center">
            <!-- 颜色渲染 -->
            <template slot-scope="scope">
              <div :style="`background-color:${scope.row[item.prop]};`">
                {{ scope.row[item.prop] }}
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.colorBtn">
          <el-table-column :prop="item.prop" :label="item.label" :min-width="item.minWidth" :width="item.width"
            :fixed="item.fixed" :key="item.prop" align="center">
            <!-- 带颜色状态 -->
            <template slot-scope="scope">
              <el-button v-for="(btn, ind) in item.tableOption" :key="ind" :type="changeType(scope.row[item.prop])"
                :size="btn.size">{{
    scope.row[item.prop] | changeStatus(item.filters)
}}</el-button>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.control">
          <el-table-column :prop="item.prop" :label="item.label" :min-width="item.tableOption.length * 65 + 'px'"
            :width="item.width" :fixed="item.fixed" :key="item.prop" align="center">
            <!-- 右侧操作 -->
            <template slot-scope="scope">
              <template v-for="(btn, ind) in item.tableOption">
                <template v-if="btn.title">
                  <el-popconfirm
                    v-if="changeDisabled(scope.row[item.prop], btn.disabled) && changeDisabled(userType, btn.role)"
                    :title="btn.title" :key="btn.label" @confirm="confirmDel" @cancel="cancelDel">
                    <el-button slot="reference" :type="btn.type" :size="btn.size"
                      @click="handButton(btn.methods, scope.row, scope.$index)" disabled>
                      {{ btn.label }}
                    </el-button>
                  </el-popconfirm>
                  <el-popconfirm v-else-if="changeDisabled(userType, btn.role)" :title="btn.title" :key="ind"
                    @confirm="confirmDel" @cancel="cancelDel">
                    <el-button slot="reference" :type="btn.type" :size="btn.size"
                      @click="handButton(btn.methods, scope.row, scope.$index)">
                      {{ btn.label }}
                    </el-button>
                  </el-popconfirm>
                  <!-- <el-popconfirm v-else :title="btn.title" :key="btn.title"
                    @confirm="confirmDel" @cancel="cancelDel">
                    <el-button slot="reference" :type="btn.type" :size="btn.size"
                      @click="handButton(btn.methods, scope.row, scope.$index)">
                      {{btn.label}}{{changeDisabled(userType,btn.role)}}222
                    </el-button>
                  </el-popconfirm> -->
                </template>
                <template v-else>
                  <el-button
                    v-if="changeDisabled(scope.row[item.prop], btn.disabled) && changeDisabled(userType, btn.role)"
                    :key="ind" :type="btn.type" :size="btn.size"
                    @click="handButton(btn.methods, scope.row, scope.$index)" disabled>
                    {{ btn.label }}
                  </el-button>
                  <!-- <el-button v-if="changeDisabled(userType,btn.role)" :key="btn.label" :type="btn.type" :size="btn.size"
                    @click="handButton(btn.methods, scope.row, scope.$index)">
                    {{ btn.label }}
                  </el-button> -->
                  <el-button v-else-if="changeDisabled(userType, btn.role)" :key="btn.label" :type="btn.type"
                    :size="btn.size" @click="handButton(btn.methods, scope.row, scope.$index)">
                    {{ btn.label }}
                  </el-button>
                </template>
              </template>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column :prop="item.prop" :label="item.label" :min-width="item.minWidth" :width="item.width"
            :fixed="item.fixed" :key="index" align="center">
            <!-- 正常显示，不做转换 -->
          </el-table-column>
        </template>
      </template>
    </el-table>
  </div>
</template>

<script>
import "@/assets/css/table.css";
import { mapState } from 'vuex';
export default {
  /**
   * 表格接收参数      类型          例                          备注
   * table           Object       table:{tableData:[],header:[]}  tableData为传入表格数据/header表头数据
   * pageSize        Number       10                            页显示数据
   * currentPage     Number       1                             当前第几页
   *
   *header表头数据接收参数
   *prop             String        与element Table一致
   *label            String        与element Table一致
   *min-width        String        与element Table一致
   *width            String        与element Table一致
   *fixed            String        与element Table一致
   *tableOption      Array         [{type: "text",label: "授权",size: "mini",methods: "powerClick",}]
   *
   *
   *特殊配置
   *selection        Boolean        selection:true               多选
   *dia              Boolean        dia:true                     弹窗
   *status           Boolean        status:true                  状态0-n
   *color            Boolean        color:true                   颜色色块
   *colorBtn         Boolean        colorBtn:true                颜色按钮
   *control          Boolean        control:true                 操作
   */
  props: {
    table: {
      type: Object,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          hasChildren: "hasChildren",
        };
      },
    }
  },
  data() {
    return {
      itemHeaderHeight: "", //页面初始化高度
      tableHeight: "",
    };
  },

  filters: {
    changeStatus(val, func) {
      // console.log('val',typeof func === "function");
      return typeof func === "function" ? func(val) : val;
    },
  },
  computed: {
    ...mapState(['userType']),
    /* 获取表格数据 */
    tableHeightComputed() {
      return this.tableHeight - this.itemHeaderHeight;
    },
  },
  mounted() {
    addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    removeEventListener("resize", this.resize);
    //表格动态高度销毁
  },
  created() {
    this.$nextTick(() => {
      let itemheight = document.documentElement.clientHeight;
      let boundingheight = this.$refs.table.$el.getBoundingClientRect().top - 32;
      this.tableHeight = itemheight - boundingheight - 80;

    });
  },
  methods: {
    rowClick(row, column, event) {
      this.$emit("rowClick", row, column, event);
    },
    changeDisabled(val, func) {
      return typeof func === "function" ? func(val) : false;
    },
    confirmDel() {
      this.$emit("confirmDel");
    },
    cancelDel() {
      this.$emit("cancelDel");
    },
    select(current, row) {
      this.$emit("select", { current, row });
    },
    selectAll(current) {
      this.$emit("selectAll", current);
    },
    resize() {
      let itemheight = document.documentElement.clientHeight;
      let boundingheight = this.$refs.table.$el.getBoundingClientRect().top;
      this.tableHeight = itemheight - boundingheight - 48;
    },
    handButton(methods, row, index) {
      this.$emit("handButton", { methods: methods, row: row, index: index });
    },
    openDia(methods, row) {
      this.$emit("openDia", row);
      //弹窗
    },
    changeType(type) {
      return type == 0 ? "info" : "success";
    },
  },
};
</script>

<style scoped>

</style>
