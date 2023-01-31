<template>
    <div class="breadcrumb">
        <el-breadcrumb class="app-breadcrumb" separator="/">
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">{{item.meta.title}}
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    name: 'Breadcrumb',
    data() {
        return {
            levelList: []
        }
    },
    created() {
        this.getBreadcrumb()
    },

    watch: {
        $route(route) {
            // if you go to the redirect page, do not update the breadcrumbs
            if (route.path.startsWith('/redirect/')) {
                return
            }
            this.getBreadcrumb()
        }
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
            const first = matched[0];
            if (first && first.path.trim().toLocaleLowerCase()) {
                matched = [{ path: '', meta: { title: first.meta.father } }].concat(matched)
            }
            this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
        },
    }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
    padding-bottom: 10px;
}
</style>>
