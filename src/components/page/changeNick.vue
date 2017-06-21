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
                            }
                            else if(response.data.code == "304"){
                                this.$message({
                                    type:'error',
                                    message:'昵称被占用'
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