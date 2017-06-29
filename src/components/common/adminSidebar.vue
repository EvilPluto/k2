<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                hello:"hahahaha",
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: '/admin/administrator',
                        title: '用户管理'
                    },
                    {
                        icon: 'el-icon-document',
                        index: '/admin/algorithm',
                        title: '算法管理',
                        subs: [
                            {
                                index: '/admin/merge',
                                title: '融合算法管理'
                            },
                            {
                                index: '/admin/mining',
                                title: '挖掘算法管理'
                            },
                            {
                                index: '/admin/upload-practice',
                                title: '上传测试'
                            },
                            {
                                index: '/admin/sankey',
                                title: '桑基图'
                            },
                            {
                                index: '/admin/force',
                                title: '力导向图'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                // return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
