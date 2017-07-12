import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path:'/nologin',
            component: resolve => require(['../components/page/noLogin.vue'],resolve)
        },
        {
            path: '/user',
            component: resolve => require(['../components/common/userHome.vue'], resolve),
            children:[
                {
                    path: '/user/change-nick',
                    component: resolve => require(['../components/page/changeNick.vue'],resolve)
                },
                {
                    path: '/user/change-password',
                    component: resolve => require(['../components/page/changePassword.vue'],resolve)
                },
                {
                    path: '/user/origin-log',
                    component: resolve => require(['../components/page/originLog.vue'],resolve)
                },
                {
                    path: '/user/standard-log',
                    component: resolve => require(['../components/page/standardLog.vue'],resolve)
                },
                {
                    path: '/user/event-log',
                    component: resolve => require(['../components/page/eventLog.vue'],resolve)
                },
                {
                    path: '/user/fusion-op',
                    component: resolve => require(['../components/page/fusionOp.vue'],resolve)
                },
                {
                    path: '/user/processmining',
                    component: resolve => require(['../components/page/processMining.vue'],resolve)
                },
                {
                    path: '/user/mergelist',
                    component: resolve => require(['../components/page/MergeList.vue'],resolve)
                },
                {
                    path: '/user/readme',
                    component: resolve => require(['../components/page/Readme.vue'],resolve)
                }
            ]
        },
        {
            // 管理员入口
            path: '/admin',
            component: resolve => require(['../components/common/adminHome.vue'], resolve),
            children: [
                {
                    path: '/admin/administrator',
                    component: resolve => require(['../components/page/Administrator.vue'], resolve)
                },
                {
                    path: '/admin/merge',
                    component: resolve => require(['../components/page/MergeAlgorithm.vue'], resolve)
                },
                {
                    path: '/admin/mining',
                    component: resolve => require(['../components/page/MiningAlgorithm.vue'], resolve)
                },
                // {
                //     path: '/admin/upload-practice',
                //     component: resolve => require(['../components/page/uploadPractice.vue'], resolve)
                // },
                // {
                //     path: '/admin/sankey',
                //     component: resolve => require(['../components/page/sankey.vue'], resolve)
                // },
                // {
                //     path: '/admin/force',
                //     component: resolve => require(['../components/page/force.vue'], resolve)
                // },
                // {
                //     path: '/admin/testMining',
                //     component: resolve => require(['../components/page/testMining.vue'], resolve)                    
                // }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
