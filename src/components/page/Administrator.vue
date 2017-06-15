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
        	const getUserLabel = (label, email) => {
        		return label + '(' + email + ')';
        	}
            return {
            	usersData: [
            		{
            			key: 0,
            			email: 'xhk6870@163.com',
            			label: getUserLabel('修海锟', 'xhk6870@163.com'),
            			disabled: false
            		},
            		{
            			key: 1,
            			email: '11@boxue.com',
            			label: getUserLabel('泊学', '11@boxue.com'),
            			disabled: false
            		},
            		{
            			key: 2,
            			email: 'hxh258@qq.com',
            			label: getUserLabel('何徐昊', 'hxh258@qq.com'),
            			disabled: false
            		},
            		{
            			key: 3,
            			email: 'EvilBenton@gmail.com',
            			label: getUserLabel('Pluto', 'EvilBenton@gmail.com'),
            			disabled: false
            		}
            	],
            	users: [3]
            };
        },
        methods: {
        	handleChange(value, direction, movedKeys) {
        		console.log(value, direction, movedKeys);
        	},
        	deleteLeftUsers() {
        		var self = this;
        		var arr = self.$refs.aaa.leftChecked; // 选中的
        		console.log(self.usersData);
        		var arrForDel = [] // 删除的key数组
        		for(var i=0; i<arr.length; i++) {
        			console.log(arr[i]);
        			arrForDel.push(arr[i]);
        		}
        		arrForDel.sort(); // 排序，使删除的key按照顺序来
        		for(var i=arrForDel.length-1; i>=0; i--) {
        			self.usersData.splice(arrForDel[i], 1);
        		} // 从后向前删
        		console.log(self.usersData);
        	},
        	deleteRightUsers() {
        		var self = this;
        		var arr = self.$refs.aaa.rightChecked; // 选中的
        		console.log(self.usersData);
        		var arrForDel = [] // 删除的key数组
        		for(var i=0; i<arr.length; i++) {
        			console.log(arr[i]);
        			arrForDel.push(arr[i]);
        		}
        		arrForDel.sort(); // 排序，使删除的key按照顺序来
        		for(var i=arrForDel.length-1; i>=0; i--) {
        			self.usersData.splice(arrForDel[i], 1);
        		} // 从后向前删
        		console.log(self.usersData);
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