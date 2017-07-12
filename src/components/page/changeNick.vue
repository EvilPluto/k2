<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>修改昵称</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form label-position="right" label-width="80px" :model = "ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label = "新昵称" prop="nickName">
                    <el-input ref = "abc" v-model="ruleForm.nickName" @keyup=""></el-input>   
                </el-form-item>
            </el-form>
            <div class="submit-btn">
                <el-button type = "primary" :disabled="allowSubmit  " @click="submitForm('ruleForm')">确认</el-button>
            </div>
        </div>       
    </div>
</template>

<script>
import bus from '../common/bus';
    export default {
        data: function(){
            var checkNick = (rule,value,callback) => {
                var vm = this.$data;
                var reg = /[^\w\u4E00-\u9fa5]/;
                if(!value){
                    vm.allowSubmit = true;
                    return callback(new Error('昵称不能为空'));
                }
                else if(value.gblen() < 4 || value.gblen() > 16){
                    vm.allowSubmit = true;
                    return callback(new Error('长度为4 - 16个字节'));
                }
                else if(value.match(reg))
                {
                    vm.allowSubmit = true;
                    return callback(new Error('昵称只能有汉字、英文、数字组成'));
                }
                else{
                    vm.allowSubmit = false;
                }
            };
            return {
                allowSubmit:true,
                hostUrl:"/processmining",
                ruleForm: {
                    nickName:''
                },
                rules:{
                    // name:[
                    //     { required:true, message: '昵称不能为空',trigger:'blur'},
                    //     {min:4, max:5,message:'长度为4 - 15个字符',trigger:'blur'}

                    // ]
                    nickName:[
                        { validator: checkNick, trigger:'change'}
                    ]
                }
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
                        window.location.replace("../processmining/index.html");
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
            submitForm:function(){
                var vm = this;
                console.log(vm.ruleForm);

                 this.$confirm('确定要修改昵称？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        this.$axios({
                            url: '/user/changeNickName',
                            method: 'post',
                            baseURL: vm.hostUrl,
                            data:vm.ruleForm
                        })
                        .then((response) => {
                            if(response.data.code == "200"){
                                this.$message({
                                    type:'success',
                                    message:'修改成功'
                                });
                                localStorage.setItem('ms_username', vm.ruleForm.nickName);
                                bus.$emit("userEvent",vm.ruleForm.nickName);
                            }
                            else {
                                console.log(response.data.code);
                                vm.codeParsing(response.data.code);                                
                            }
                        })
                        .catch((error) => {
                            console.log("Error:", error);
                            this.$message({
                                    type:'warning',
                                    message:'网络无连接'
                                });

                        });
                              
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消'
                      });          
                    });

            }
        }
    }
</script>

<style scoped>
.crumbs{
    text-decoration: none;
}
.form-box{
    width:300px;
    margin-top:50px;
    margin-left:0px;
    box-shadow:0 0 8px 0
        rgba(232,237,250,.9),0 2px 4px 0
        rgba(232,237,250,.9);
    padding:50px 50px 50px 10px;  
}
.submit-btn{
    width:220px;
    margin-left:80px;
}
.submit-btn button{
    width:100%; 
}
</style>