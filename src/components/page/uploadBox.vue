<template>
	<div>
		<el-select label = "日志类型" v-model="selectValue" placeholder="请选择文件格式" @change="valueChange">
			<el-option
			      v-for="item in selectArray"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			      <span style="float: left">{{ item.label }}</span>
			      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
		    </el-option>
		</el-select>

		<el-upload
			  class="upload-demo"
			  ref="upload"
			  action="https://jsonplaceholder.typicode.com/posts/"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :file-list="fileList"
			  :auto-upload="false">
			  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			  <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
	</div>
<!-- 	<div>
		<el-input type="file"></el-input>
    </div> -->
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
<style></style>
