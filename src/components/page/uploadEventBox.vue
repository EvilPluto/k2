<template>
	<div class="file-box">
<!-- 		<form v-model="uploadForm" ref="uploadForm" name = "uploadForm" class="up-form" id="up-form" :action="uploadUrl" methods="post" enctype="multipart/form-data">
			<el-select label = "日志类型" v-model="uploadForm.format" placeholder="请选择文件格式" @change="valueChange" size="30">
				<el-option
				      v-for="item in selectArray"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				      <span style="float: left">{{ item.label }}</span>
				      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
			    </el-option>
			</el-select>
			<el-switch
			  class="switch"
			  v-model="switchVal"
			  on-text="share"
			  off-text="not"
			  width='70'
			  @change="switchChange">
			</el-switch>
			<el-input type='text' name='file-name' id='file-name' class='file-name' placeholder="请上传文件" :value="fileTitle" :disabled="enable"/></input>
			<el-button type = "primary" class="btn-browse">浏览</el-button>
			<el-button type="success" class='btn-upload' @click="submitForm">上传</el-button>
			<input type="file" :value="uploadForm.file" name="file" class="file-field" id="file-field" @change="changeFileName" :accept="accept" :disabled="enable" filename="11"/></input>
		</form> -->		
		<form id="upForm">
			<el-select label = "日志类型" v-model="uploadForm.format" placeholder="请选择文件格式" @change="valueChange" size="30" disabled="true">
				<el-option
				      v-for="item in selectArray"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				      <span style="float: left">{{ item.label }}</span>
				      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
			    </el-option>
			</el-select>
			<el-switch
			  class="switch"
			  v-model="switchVal"
			  on-text="share"
			  off-text="not"
			  width='70'
			  @change="switchChange">
			</el-switch>
			<input type="file" :value="uploadForm.file" name="file" class="file-field ipt" id="file-field" @change="changeFileName" :accept="accept" :disabled="enable" filename=""/>
			<el-button type="success" class='btn' @click="submitForm">上传</el-button>
		</form>	
	</div>

</template>

<script>
	export default {
		data(){
			return{
                switchVal: true,
				uploadUrl:'/processmining/eventLog',
				uploadForm:{
					format:'xes',
					file:'',
					shared:1
				},
				fileName:'',
				fileTitle:'',
				selectArray:[
					{
						value:'txt',
						label:'TXT'
					},
					{
						value:'xes',
						label:'XES'
					}
				],
				accept:'.xes',
				enable:false
			}
		},
		methods:{
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
                        msg('权限问题', '用户未登录，请重新登录');
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
                    default:
                        break;
                }
            },
			valueChange:function(){
				var vm=this;
				console.log(vm.uploadForm.format);
				if(vm.uploadForm.format == 'txt'){
					vm.accept = '.txt';
					vm.enable = false;
				}
				else if(vm.uploadForm.format == 'xes'){
					vm.accept ='.xes';
					vm.enable = false;
				}
				else{
					vm.accept ='';
					vm.enable =true;
				}
			},
			changeFileName:function(value){
				var vm=this;
				var target = document.getElementById('file-field');
				vm.fileName = target.value;
				var arr = vm.fileName.split('\\');
				arr = arr.reverse();
				vm.fileTitle = arr[0];
				console.log(target.value);
				console.log(vm.fileTitle);
				console.log(document.getElementById('file-field'.value));
			},
			submitForm:function(){
				var vm=this;
				if(!vm.uploadForm.format){
					this.$message({
						type:'error',
						message:'请选择类型'
					});
				}
				else if(!vm.fileName){
					this.$message({
						type:'error',
						message:'请上传文件'
					});
				}
				else{
					var form  = new FormData($('#upForm')[0]);
					form.append("shared",vm.uploadForm.shared);
					form.append("format",vm.uploadForm.format);

					$.ajax({
						url:this.uploadUrl,
						type:'POST',
						contentType:false,
						processData:false,
						data:form,
						success:function(data){
							if(data.code == "200"){
	                            vm.$message({
	                                type:'success',
	                                message:'upload成功'
	                            });
                        	}
	                        else {
	                            console.log(data.code);
	                            this.codeParsing(data.code);                                
	                        }
	                        // setTimeout(()=>{window.location.reload()},1000);
						},
						error:function(){
							vm.$message({
                                type:'error',
                                message:'网络无连接'
                            });
                            // setTimeout(()=>{window.location.reload()},1000);
						}
					});
					// document.getElementById('up-form').submit();
					// console.log(this.uploadForm)
				}

			},
			switchChange:function(val){
				var vm=this;
				console.log(vm.switchVal)
				if(vm.switch){
					vm.uploadForm.shared = 1;
				}
				else{
					vm.uploadForm.shared = 0;
				}				
			}

		}
	}
</script>
<style>
	.file-box{
		height: 80px;
	}
	.up-form{
	}
/*	.file-input{
		display: inline-block;
		margin-top:20px;
		width:10px;
	}*/
	.file-name{
		margin-top:20px;
		width:232px;
	}
	.btn-browse{
		margin-left:10px;
	}
	.file-field{
		display: inline-block;
		/*opacity: 0;*/
		position: absolute;
		width:300px;
		height:35px;
		left: 20px;
		bottom:19px;
	}
	.switch{
		float:right;
		margin-top:5px;
	}
	.btn{
		float:right;
		display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    cursor: pointer;
	    background: #fff;
	    border: 1px solid #bfcbd9;
	    padding: 10px 15px;
	    border-radius: 4px;
	    background-color: #13ce66;
	    color:'white';
	    margin-top:19px;
	    width:68px;
	}
	.ipt{
		background-color: #eef1f6;
	    border-color: #d1dbe5;
	    color: #bbb;
	    cursor: not-allowed;
	    -webkit-appearance: none;
	    -moz-appearance: none;
	    appearance: none;
	    background-color: #fff;
	    background-image: none;
	    border-radius: 4px;
	    border: 1px solid #bfcbd9;
	    box-sizing: border-box;
	    color: #1f2d3d;
	    display: inline-block;
	    font-size: inherit;
	    height: 36px;
	    line-height: 1;
	    outline: 0;
	    padding: 3px 10px;
	    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
	    width: 300px;
	}

</style>
