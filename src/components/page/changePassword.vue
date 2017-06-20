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
                if(!value){
                    vm.check1 = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 6 || value.gblen() > 16){
                    vm.check1 = true;
                    return callback(new Error('密码长度为6 - 16个字符'));
                }
                else{
                    vm.check1 = false;
                }
            };
            var checkNewPassword = (rule,value,callback) => {
                var vm = this.$data;
                if(!value){
                    vm.check2 = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 6 || value.gblen() > 16){
                    vm.check2 = true;
                    return callback(new Error('密码长度为6 - 16个字符'));
                }
                else{
                    vm.check2 = false;
                }
            };
            var checkPassword = (rule,value,callback) => {
                var vm = this.$data;
                if(!value){
                    vm.check3 = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 6 || value.gblen() > 16){
                    vm.check3 = true;
                    return callback(new Error('密码长度为6 - 16个字符'));
                }
                else{
                    vm.check3 = false;
                }
            };
            return {
                hostUrl:"http://localhost:8888/processmining",
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
                        { validator: checkOldPassword, trigger:'change'}
                    ],
                    newPassword:[ { validator: checkNewPassword, trigger:'change'}],
                    checkNewPassword:[{ validator: checkPassword, trigger:'change'}]
                }
            }
        },
        methods:{
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
                            }
                            else if(response.data.code == "300"){
                                this.$message({
                                    type:'error',
                                    message:'密码错误'
                                });

                            }
                            else{
                                this.$message({
                                    type:'error',
                                    message:'系统错误'
                                });
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