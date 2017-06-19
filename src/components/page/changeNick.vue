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
                <el-form-item label = "新昵称" prop="name">
                    <el-input ref = "abc" v-model="ruleForm.name" @keyup=""></el-input>   
                </el-form-item>
            </el-form>
            <div class="submit-btn">
                <el-button type = "primary" :disabled="allowSubmit  " @click="submitForm('ruleForm')">确认</el-button>
            </div>
        </div>       
    </div>
</template>

<script>
    String.prototype.gblen = function() {  
      var len = 0;  
      for (var i=0; i<this.length; i++) {  
        if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {  
           len += 2;  
         } else {  
           len ++;  
         }  
       }  
      return len;  
    }
    export default {
        data: function(){
            var checkNick = (rule,value,callback) => {
                var vm = this.$data;
                if(!value){
                    vm.allowSubmit = true;
                    return callback(new Error('昵称不能为空'));
                }
                else if(value.gblen() < 4 || value.gblen() > 15){
                    vm.allowSubmit = true;
                    return callback(new Error('长度为4 - 15个字符'));
                }
                else{
                    vm.allowSubmit = false;
                }
            };
            return {
                allowSubmit:true,
                ruleForm: {
                    name:''
                },
                rules:{
                    // name:[
                    //     { required:true, message: '昵称不能为空',trigger:'blur'},
                    //     {min:4, max:5,message:'长度为4 - 15个字符',trigger:'blur'}

                    // ]
                    name:[
                        { validator: checkNick, trigger:'change'}
                    ]
                }
            }
        },
        methods:{
            submitForm:function(){
                var vm = this;
                console.log(vm.$refs.abc.han)
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