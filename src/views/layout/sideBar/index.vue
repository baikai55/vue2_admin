<template>
  <!-- 左侧导航开始 -->
  <el-aside width="210px" class="a-side">
    <el-menu class="el-menu-vertical-demo" background-color="transparent" :router="true" :default-active="key">
      <el-menu-item index="/">
        <i class="iconfont icon-shouye" style="margin-right:10px"></i>
        <span>首页</span>
      </el-menu-item>
      <template v-if="(userType == 0)">
        <template v-for="item in userRole">
          <el-submenu v-if="item.path !== '*'" :key="item.id" :index="item.path">
            <template slot="title">
              <i :class="item.icon" class="iconfont" style="margin-right:10px"></i>
              <span>{{ item.authName }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-menu-item :index="subItem.path" v-if="subItem.hidden !== true" :key="subItem.id">
                <template slot="title">
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </template>
      <template v-else>
        <template v-for="item in userRole">
          <el-submenu v-if="item.path !== '*' && item.hidden !== true" :key="item.id" :index="item.path">
            <template slot="title">
              <i :class="item.icon" class="iconfont" style="margin-right:10px"></i>
              <span>{{ item.authName }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-menu-item :index="subItem.path" v-if="subItem.hidden !== true" :key="subItem.id">
                <template slot="title">
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </template>
      <!-- <el-menu-item index="/test">
        <i class="iconfont icon-shouye" style="margin-right:10px"></i>
        <span>测试</span>
      </el-menu-item> -->
    </el-menu>
  </el-aside>
  <!-- 左侧导航结束 -->
</template>

<script>
import store from '@/store';
import { mapState } from 'vuex';
import { routerBase } from '@/api/login';
import { initAsyncRouter } from '@/router';
export default {
  computed: {
    ...mapState(['userRole', 'userType']),
    key() {
      // routerBase().then(res => {
      //   store.commit('set_userRole', res.result);
      //   initAsyncRouter();
      // })
      let a = this.$route.path.split('/')
      if (a.length > 3) {
        return this.$route.meta.activeRoute
      } else return this.$route.path;
    },
  },
  data() {
    return {
    };
  },
  mounted() { },
  created() {
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
aside.el-aside.a-side {
  height: calc(100vh - 60px);
  background-color: #fff;
  border-right: solid 1px #e6e6e6;

  ul.el-menu-vertical-demo.el-menu {
    border: none;
  }

  .el-menu-item:hover {
    background: rgba($color: rgb(227, 227, 227), $alpha: 0.4) !important;
  }

  :deep .el-submenu__title:hover {
    background: rgba($color: rgb(227, 227, 227), $alpha: 0.4) !important;
  }
}

li.el-menu-item.is-active {
  color: #409eff !important;
  background-color: transparent !important;
}

:deep li.el-submenu.is-active {
  .el-submenu__title {
    color: #409eff;

    i {
      color: #409eff !important;
    }
  }
}

aside.el-aside.a-side::-webkit-scrollbar {
  width: 0;
}
</style>