<template>
	<div>
        <div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 管理员</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="transferForm">
        	<el-transfer 
        		v-model="users"
        		ref="aaa"
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
                hostUrl: 'http://localhost:8888/processmining',
            	usersData: [],
            	users: []
            };
        },
        created() {
            var self = this;

            self.getAllUsersList();
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
                    case 201:
                        msg('输入域错误', '验证码错误');
                    case 300:
                        msg('输入域错误', '邮箱或密码错误');
                    case 301:
                        msg('权限问题', '用户已禁用，请联系管理员');
                    case 302:
                        msg('权限问题', '用户未激活，请去邮箱激活用户');
                    case 303:
                        msg('注册问题', '邮箱已占用，请更改邮箱');
                    case 304:
                        msg('注册问题', '昵称已占用，请更改昵称');
                    case 400:
                        msg('权限问题', '用户未登录，请重新登录');
                    case 401:
                        msg('权限问题', '用户无权访问，请联系管理员');
                    case 500:
                        msg('系统错误', '未知错误，请上报管理员');
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
        		var arrDel = self.$refs.aaa.leftChecked; // 选中的

                this.$axios({
                    url: '/manager/deleteUser',
                    method: 'post',
                    baseURL: this.hostUrl,

                    data: {
                        idList: arrDel
                    }
                })
                .then((response) => {
                    if (response.data.code === 200) {
                        self.$message({
                            message: '数据删除成功!',
                            type: 'success'                        
                        })
                    } else {
                        console.log(response.data.code);
                        self.codeParsing(response.data.code);
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
                var arrDel = self.$refs.aaa.rightChecked; // 选中的

                this.$axios({
                    url: '/manager/deleteUser',
                    method: 'post',
                    baseURL: this.hostUrl,

                    data: {
                        idList: arrDel
                    }
                })
                .then((response) => {
                    if (response.data.code === 200) {
                        self.$message({
                            message: '数据删除成功!',
                            type: 'success'                        
                        })
                    } else {
                        console.log(response.data.code);
                        self.codeParsing(response.data.code);
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
	.el-transfer-panel {
		width: 400px;
		height: 500px;
	}
	.transferForm {
		padding-top: 40px;
		padding-left: 40px;
	}
</style>