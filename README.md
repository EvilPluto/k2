# K2 #
基于Vue.js 2.x系列 + Element UI 的K2流程挖掘平台解决方案。


## 功能 ##
- [x] 用户管理
- [x] 日志管理
- [x] 日志融合
- [x] 流程挖掘


## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- src                              // 源码目录
	|   |-- components                   // 组件
	|       |-- common                   // 公共组件
	|           |-- adminHeader.vue      // 管理员头部
	|           |-- adminHome.vue        // 管理员路由入口
	|           |-- adminSidebar.vue     // 管理员左边栏
	|           |-- userHeader.vue       // 用户头部
	|           |-- userHome.vue         // 用户路由入口
	|           |-- userSidebar.vue      // 用户左边栏
	|		|-- page                   	 // 主要路由页面
	|           |-- Readme.vue           // 介绍组件
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- .babelrc                         // ES6语法编译配置
	|-- .editorconfig                    // 代码编写规格
	|-- .gitignore                       // 忽略的文件
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明
