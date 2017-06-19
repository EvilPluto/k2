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
                <el-button type = "primary" :disabled="checkAllow()" @click="submitForm('ruleForm')">确认</el-button>
            </div>
        </div>       
    </div>
</template>

<script>
    
    export default {
        data: function(){
            var checkPassword = (rule,value,callback) => {
                var vm = this.$data;
                if(!value){
                    vm.allowSubmit = true;
                    return callback(new Error('密码不能为空'));
                }
                else if(value.gblen() < 4 || value.gblen() > 16){
                    vm.allowSubmit = true;
                    return callback(new Error('密码长度为4 - 16个字符'));
                }
                else{
                    vm.allowSubmit = false;
                }
            };
            return {
                check1:true,
                check2:true,
                check3:true,
                allowSubmit: true,
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
                        { validator: checkPassword, trigger:'change'}
                    ],
                    newPassword:[],
                    checkNewPassword:[]
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
    margin-left:20px;
}
.submit-btn{
    width:220px;
    margin-left:80px;
}
.submit-btn button{
    width:100%;
}
</style>