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
                        icon: 'el-icon-information',
                        index: '/user/readme',
                        title: '系统介绍',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '1',
                        title: '个人信息管理',
                        subs: [
                            {
                                index: '/user/change-nick',
                                title: '修改昵称'
                            },
                            {
                                index: '/user/change-password',
                                title: '修改密码'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '日志管理',
                        subs: [
                            {
                                index: '/user/origin-log',
                                title: '原始日志'
                            },
                            {
                                index: '/user/standard-log',
                                title: '规范化日志'
                            },
                            {
                                index: '/user/event-log',
                                title: '事件日志'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: '3',
                        title: '日志融合',
                        subs: [
                            {
                                index: '/user/mergelist',
                                title: '融合日志列表'
                            },
                            {
                                index: '/user/fusion-op',
                                title: '融合操作'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-time',
                        index: '/user/processmining',
                        title: '流程挖掘'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
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
