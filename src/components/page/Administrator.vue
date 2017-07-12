<template>
	<div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 管理员</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="transferForm">
        	<el-transfer 
        		v-model="users"
        		ref="transferRef"
                filterable
                filter-placeholder="请输入用户的昵称或Email"
        		:data="usersData"
        		:titles="['恢复用户列表', '禁用用户列表']"
        		:button-texts="['恢复', '禁用']"
        		:footer-format="{
        			noChecked: '${total}个用户',
        			hasChecked: '已选${checked} / ${total}个用户'
        		}"
        		@change="handleChange"
        		>
        		<el-button 
        			class="transfer-footer" 
        			slot="left-footer" 
        			:plain="true" 
        			type="danger" 
        			icon="delete" 
        			size="mini"
					@click="deleteLeftUsers"
        			>
        			删除
        		</el-button>
        		<el-button 
        			class="transfer-footer" 
        			slot="right-footer" 
        			:plain="true" 
        			type="danger" 
        			icon="delete" 
        			size="mini"
					@click="deleteRightUsers"
        			>
        			删除
        		</el-button>
        	</el-transfer>
        </div>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                hostUrl: '/processmining',
            	usersData: [],
            	users: []
            };
        },
        created() {
            var self = this;

            self.getAllUsersList();
        },
        mounted(){
            var type = sessionStorage.getItem('ms_type');
            console.log(type);
        },
        methods: {
            codeParsing(code) {
                var msg = (Title, Message) => {
                    this.$message({
                        title: Title,
                        message: Message,
                        type: 'error'
                    });
                };
                switch(code) {
                    case -1:
                        msg('系统错误', '未知错误，请上报管理员');
                        break;
                    case 201:
                        msg('输入域错误', '验证码错误');
                        break;
                    case 300:
                        msg('输入域错误', '邮箱或密码错误');
                        break;
                    case 301:
                        msg('权限问题', '用户已禁用，请联系管理员');
                        break;
                    case 302:
                        msg('权限问题', '用户未激活，请去邮箱激活用户');
                        break;
                    case 303:
                        msg('注册问题', '邮箱已占用，请更改邮箱');
                        break;
                    case 304:
                        msg('注册问题', '昵称已占用，请更改昵称');
                        break;
                    case 400:
                        msg('权限问题', '用户未登录或被下线，请重新登录：3s后跳转');
                        setTimeout(function() {
                            window.location.replace("../processmining/index.html");
                        }, 3000);
                        break;
                    case 401:
                        msg('权限问题', '用户无权访问，请联系管理员');
                        break;
                    case 402:
                        msg('操作错误', '删除错误,请刷新重试');
                        break;
                    case 500:
                        msg('系统错误', '未知错误，请上报管理员');
                        break;
                    case 600:
                        msg('TIME_OUT', '访问超时，请检查网络连接');
                        break;
                    case 700:
                        msg('激活错误', '非法激活链接，请联系管理员');
                        break;
                    case 800:
                        msg('激活错误', '用户已被激活，请直接登录');
                        break;
                    case 900:
                        msg('事件化错误', '事件化失败');
                        break;
                    case 901:
                        msg('上传错误', '文件大小为0');
                        break;   
                    default:
                        break;
                }
            },

            getUserLabel(label, email) {
                return label + '(' + email + ')';
            },

            packData(rawData) {
                var self = this;

                var newData = new Array();
                for (var i=0; i<rawData.length; i++) {
                    console.log(rawData[i].activated);
                    newData.push({
                        key: rawData[i].id,
                        email: rawData[i].email,
                        label: self.getUserLabel(rawData[i].nickname, rawData[i].email),
                        disabled: false
                    });
                }
                return newData;
            },

        	handleChange(value, direction, movedKeys) {
                var self = this;
        		// console.log(value, direction, movedKeys);
                if (direction === 'right') {
                    // 禁用
                    console.log('禁用', movedKeys);
                    var arrBan = movedKeys;

                    this.$axios({
                        url: '/manager/banUser',
                        method: 'post',
                        baseURL: this.hostUrl,

                        data: {
                            idList: movedKeys
                        }
                    })
                    .then((response) => {
                        if (response.data.code === 200) {
                            self.$message({
                                message: '用户禁用成功!',
                                type: 'success'                        
                            })
                        } else {
                            console.log(response.data.code);
                            self.codeParsing(response.data.code);
                        }
                    })
                    .catch((error) => {
                        this.$message({
                            message: '用户禁用失败: ' + '请刷新页面!',
                            type: 'error'
                        });
                        console.log("【Error】:", error);
                    });   
                } else {
                    // 激活
                    console.log('激活', movedKeys);
                    var arrUnBan = movedKeys;

                    this.$axios({
                        url: '/manager/unbanUser',
                        method: 'post',
                        baseURL: this.hostUrl,

                        data: {
                            idList: movedKeys
                        }
                    })
                    .then((response) => {
                        if (response.data.code === 200) {
                            self.$message({
                                message: '用户恢复成功!',
                                type: 'success'                        
                            })
                        } else {
                            console.log(response.data.code);
                            self.codeParsing(response.data.code);
                        }
                    })
                    .catch((error) => {
                        this.$message({
                            message: '用户激活失败: ' + '请刷新页面!',
                            type: 'error'
                        });
                        console.log("【Error】:", error);
                    });   
                }
        	},
        	deleteLeftUsers() {
        		var self = this;
        		var arrDel = self.$refs.transferRef.leftChecked; // 选中的

                this.$axios({
                    url: '/manager/deleteUser',
                    method: 'post',
                    baseURL: this.hostUrl,

                    data: {
                        idList: arrDel
                    }
                })
                .then((response) => {
                    if (response.data.respCode === 200) {
                        self.$message({
                            message: '数据删除成功!',
                            type: 'success'                        
                        });
                        var usersList = response.data.userUtil.allUser;
                        self.usersData = self.packData(usersList);
                        self.users = response.data.bannedUserId;
                    } else {
                        console.log(response.data.respCode);
                        self.codeParsing(response.data.respCode);
                    }
                })
                .catch((error) => {
                    this.$message({
                        message: '数据删除失败: ' + '请重试!',
                        type: 'error'
                    });
                    console.log("【Error】:", error);
                });              
        	},
        	deleteRightUsers() {
                var self = this;
                var arrDel = self.$refs.transferRef.rightChecked; // 选中的

                this.$axios({
                    url: '/manager/deleteUser',
                    method: 'post',
                    baseURL: this.hostUrl,

                    data: {
                        idList: arrDel
                    }
                })
                .then((response) => {
                    if (response.data.respCode === 200) {
                        self.$message({
                            message: '数据删除成功!',
                            type: 'success'                        
                        });
                        var usersList = response.data.userUtil.allUser;
                        self.usersData = self.packData(usersList);
                        self.users = response.data.bannedUserId;
                    } else {
                        console.log(response.data.respCode);
                        self.codeParsing(response.data.respCode);
                    }
                })
                .catch((error) => {
                    this.$message({
                        message: '数据删除失败: ' + '请重试!',
                        type: 'error'
                    });
                    console.log("【Error】:", error);
                });  
        	},
            getAllUsersList() {
                var self = this;

                this.$axios({
                    url: '/manager/listAllUsers',
                    method: 'get',
                    baseURL: this.hostUrl
                })
                .then((response) => {
                    var usersList = response.data.allUser;
                    self.usersData = self.packData(usersList);
                    self.users = response.data.bannedUserId;

                    self.$message({
                        message: '数据加载成功!',
                        type: 'success'                        
                    })
                })
                .catch((error) => {
                    this.$message({
                        message: '数据加载失败: ' + '请重试!',
                        type: 'error'
                    });
                    console.log("【Error】:", error);
                });
            }
        }
    }
</script>

<style>
	.transfer-footer {
		float: right;
		margin-right: 20px;
		margin: 6px 5px;
	}
    .transferForm .el-transfer-panel {        
        width: 400px;
    }
	.transferForm .el-transfer-panel__body {
		height: 500px;
	}
    .transferForm .el-transfer-panel__list {
        height: 470px;
    }
	.transferForm {
       width: 900px;
       height: 480px;
		padding-top: 50px;
		padding-left: 50px;
	}
</style>