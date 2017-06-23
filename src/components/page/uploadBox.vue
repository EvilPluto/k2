<template>
	<div>
		<el-form :model="uploadForm" ref="uploadForm" class="up-form">
			<el-select label = "日志类型" v-model="selectValue" placeholder="请选择文件格式" @change="valueChange" size="40">
				<el-option
				      v-for="item in selectArray"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				      <span style="float: left">{{ item.label }}</span>
				      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
			    </el-option>
			</el-select>
			<el-input type="file" class="file-input" size="40"></el-input>
		</el-form>
	</div>

</template>

<script>
	export default {
		data(){
			return{
				selectArray:[
					{
						value:'txt',
						label:'原始日志'
					},
					{
						value:'xes',
						label:'事件日志'
					},
					{
						value:'log',
						label:'规范日志'
					}
				],
				selectValue:'',
				fileList:[]
			}
		},
		methods:{
			valueChange:function(){
				var vm=this;
				console.log(vm.selectValue);
				if(vm.selectValue != ''){
					
				}
			}
		}
	}
</script>
<style>
	.up-form{
	}
	.file-input{
		display: inline-block;
		margin-top:20px;
	}
</style>
