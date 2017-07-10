<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form label-position="right" label-width="80px" :model = "ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label = "旧密码" prop="oldPassword">
                    <el-input icon="search" type = "password" v-model="ruleForm.oldPassword" @keyup="" :on-icon-click = "handleClick()" ></el-input>   
                </el-form-item> 
                <el-form-item label = "新密码" prop="newPassword">
                    <el-input  icon="search" type = "password" v-model="ruleForm.newPassword" @keyup=""></el-input>   
                </el-form-item>
                 <el-form-item label = "确认密码" prop="checkNewPassword">
                    <el-input  icon="search" type = "password"  v-model="ruleForm.checkNewPassword" @keyup=""></el-input>   
                </el-form-item>
            </el-form>
            <div class="submit-btn">
                <el-button type = "primary" :disabled="check1||check2||check3" @click="submitForm('ruleForm')">确认</el-button>
            </div>
        </div>       
    </div>
</template>

<script>
    
    export default {
        data: function(){
            //这里存在重用性问题 框架提供的自定义规则无法修改？
            var checkOldPassword = (rule,value,callback) => {
                var vm = this.$data;
                var reg = /^[a-zA-Z0-9]+$/;
                if(!value){
                    vm.check1 = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 6 || value.gblen() > 16){
                    vm.check1 = true;
                    return callback(new Error('密码长度为6 - 16个字符'));
                }
                else if(!value.match(reg))
                {
                    vm.check2 = true;
                    return callback(new Error('密码仅可由数字与字母组成'));
                }
                else
                {
                    vm.check1 = false;
                }
            };
            var checkNewPassword = (rule,value,callback) => {
                var vm = this.$data;
                var reg = /^[a-zA-Z0-9]+$/;
                if(!value){
                    vm.check2 = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 6 || value.gblen() > 16){
                    vm.check2 = true;
                    return callback(new Error('密码长度为6 - 16个字符'));
                }
                else if(!value.match(reg))
                {
                    vm.check2 = true;
                    return callback(new Error('密码仅可由数字与字母组成'));
                }
                else{
                    vm.check2 = false;
                }
            };
            var checkPassword = (rule,value,callback) => {
                var vm = this.$data;
                var reg = /^[a-zA-Z0-9]+$/;
                if(!value){
                    vm.check3 = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 6 || value.gblen() > 16){
                    vm.check3 = true;
                    return callback(new Error('密码长度为6 - 16个字符'));
                }
                else if(!value.match(reg))
                {   
                    vm.check3 = true;
                    return callback(new Error('密码仅可由数字与字母组成'));
                }
                else{
                    vm.check3 = false;
                }
            };
            return {
                hostUrl:"/processmining",
                check1:true,
                check2:true,
                check3:true,
                ruleForm: {
                    oldPassword:'',
                    newPassword:'',
                    checkNewPassword:''
                },  
                rules:{
                    // name:[
                    //     { required:true, message: '昵称不能为空',trigger:'blur'},
                    //     {min:4, max:5,message:'长度为4 - 15个字符',trigger:'blur'}

                    // ]
                    oldPassword:[
                        { validator: checkOldPassword, trigger:'change'},
                        { validator: checkOldPassword, trigger:'blur'}
                    ],
                    newPassword:[
                        { validator: checkNewPassword, trigger:'change'},
                        { validator: checkNewPassword, trigger:'blur'}
                    ],
                    checkNewPassword:[
                        { validator: checkPassword, trigger:'change'},
                        { validator: checkPassword, trigger:'blur'}
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
            handleClick:function(){},
            checkAllow:function(){
                var vm = this;
                return vm.check1||vm.check2||vm.check3;
            },
            submitForm:function(){
                var vm = this;
                console.log(vm.ruleForm)
                if(vm.ruleForm.oldPassword == vm.ruleForm.newPassword){
                    this.$message({
                        type: 'info',
                        message: '新旧密码不能一样'
                    });  
                }
                else if(vm.ruleForm.newPassword != vm.ruleForm.checkNewPassword){
                    this.$message({
                        type: 'info',
                        message: '确认密码不一致'
                    });  
                }
                else{
                    this.$confirm('确定要修改密码？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        var postData = {
                            oldPassword:"",
                            newPassword:""
                        };
                        postData.oldPassword = vm.ruleForm.oldPassword;
                        postData.newPassword = vm.ruleForm.newPassword;
                        this.$axios({
                            url: '/user/changePassword',
                            method: 'post',
                            baseURL: vm.hostUrl,
                            data:postData
                        })
                        .then((response) => {
                            if(response.data.code == "200"){
                                this.$message({
                                    type:'success',
                                    message:'修改成功'
                                });
                            } else {
                                console.log(response.data.code);
                                vm.codeParsing(response.data.code);
                            }
                        })
                        .catch((error) => {
                            console.log("Error:", error);
                            this.$message({
                                    type:'warning',
                                    message:'AJAX FAIL'
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
    padding:50px 50px 50px 20px;  

}
.submit-btn{
    width:220px;
    margin-left:80px;
}
.submit-btn button{
    width:100%;
}
</style>