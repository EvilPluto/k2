<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-date"></i> 算法管理</el-breadcrumb-item>
                <el-breadcrumb-item>挖掘算法管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button 
                type="primary" 
                class="submit-btn"
                :disabled="tapOrNot"
                @click="uploadAlgorithm">
                上传算法
            </el-button>
        </div>
        
        <br>

        <div class="tableForm">
            <el-table 
                ref="algorithmList"
                :data="algorithmData" 
                border
                stripe
                max-height="450"
                style="width: 100%">
                    <el-table-column 
                        type="index" 
                        width="100">
                    </el-table-column>
                    <el-table-column 
                        prop="name" 
                        label="算法名称"
                        width="370">
                    </el-table-column>
                    <el-table-column 
                        label="操作">
                        <template scope="scope">
                            <el-button
                                size="mini"
                                type="danger"
                                :plain="true"
                                @click="deleteAlgorithm(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
            </el-table>            
        </div>
        <div class="upload">
            <el-button
                type="text"
                icon="close"
                size="large"
                class="rightClose"
                @click="backToForm">
            </el-button>
            <div class="myContent">
                <el-form ref="fileUpload" :model="fileUpload" :rules="uploadRules">
                    <p class="title">挖掘算法导入及参数设置</p>
                    <el-row>
                        <el-col :span="11">
                        <el-form-item prop="package">
                            <el-input
                                placeholder="导入算法包(*.jar)"
                                icon="upload"
                                v-model="fileUpload.package"
                                :on-icon-click="uploadPackage"
                                readonly="readonly"
                                >
                            </el-input>
                            <input type="file" name="package" class="file" id="package"
                                ref="package"
                                @change="getPackage" />
                        </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            &nbsp
                        </el-col>
                        <el-col :span="11">
                        <el-form-item prop="conf">
                            <el-input
                                placeholder="导入配置文件(*.json)"
                                icon="upload"
                                v-model="fileUpload.conf"
                                :on-icon-click="uploadConf"
                                readonly="readonly"
                                >
                            </el-input>
                            <input type="file" name="conf" class="file" id="conf"
                                ref="conf" accept="application/json"
                                @change="getConf" />      
                        </el-form-item>    
                        </el-col>
                    </el-row>
                    <el-form-item prop="name">
                        <el-input
                            placeholder="设置算法名称"
                            v-model="fileUpload.name"
                            width="100%"
                            >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="desc">
                        <el-input
                            type="textarea"
                            v-model="fileUpload.desc"
                            :rows="6"
                            placeholder="请输入算法说明"
                            >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="11">
                            <el-button
                                type="primary"
                                size="large"
                                class="uploadBtn"
                                @click="submit('fileUpload')"
                            >
                            添加
                            </el-button>
                        </el-col>
                        <el-col :span="2">
                            &nbsp
                        </el-col>
                        <el-col :span="11">
                            <el-button
                                type="primary"
                                size="large"
                                :plain="true"
                                class="uploadBtn"
                                @click="cancel"
                            >
                            取消
                            </el-button>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    
    export default {
        data() {
            return {
                tapOrNot: false,
                hostUrl: '/processmining', // IP'
                fileUpload: {
                    package: '',
                    conf: '',
                    name: '',
                    desc: ''
                },
                algorithmData: [
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    }
                ],
                uploadRules: {
                    package: [
                        { required: true, message: '请上传算法包', trigger: 'change' }
                    ],
                    conf: [
                        { required: true, message: '请上传算法配置文件', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请填写算法名称', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请添加算法描述', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            uploadAlgorithm() {
                this.tapOrNot = true;
                $('.tableForm').css('display', 'none');
                // $('.content').addClass('hangUp');
                $('.upload').css('display', 'block');
            },

            backToForm() {
                this.tapOrNot = false;
                $('.tableForm').css('display', 'block')
                // $('.content').removeClass('hangUp');
                $('.upload').css('display', 'none');
            },

            uploadPackage() {
                $('#package').click();
            },

            uploadConf() {
                $('#conf').click();
            },

            getPackage(e) {
                let file = e.target.files[0];
                console.log(file);
                var suffix = file.name.substring(file.name.lastIndexOf(".")+1, file.name.length);
                if (suffix === 'jar') {
                    this.fileUpload.package = file.name;
                } else {
                    this.$message({
                        title: '算法包格式错误',
                        message: '请上传正确的.jar算法包！',
                        type: 'error'
                    });
                }
            },

            getConf(e) {
                let file = e.target.files[0];
                console.log(file);
                this.fileUpload.conf = file.name;
            },

            cancel() {
                var self = this;
                this.$refs['fileUpload'].resetFields();
                this.fileUpload.package = '';
                this.fileUpload.conf = '';
                self.backToForm();
            },

            submit(formName) {
                var self = this;

                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        const h = this.$createElement;

                        this.$notify({
                            title: '注册信息',
                            message: h
                                ('pre',
                                { style: 'color: teal' },
                                '\n算法包: ' + this.fileUpload.package +
                                '\n配置文件: ' + this.fileUpload.conf +
                                '\n算法名称: ' + this.fileUpload.name +
                                '\n算法描述: ' + this.fileUpload.desc
                                )
                        });

                        let pac = this.$refs.package.files[0];
                        let con = this.$refs.conf.files[0];
                        let formData = new FormData();
                        formData.append('pack', pac, pac.name);
                        formData.append('conf', con, con.name);
                        formData.append('name', this.fileUpload.name);
                        formData.append('desc', this.fileUpload.desc);

                        this.$axios ({
                            method: 'post',
                            url: '/manager/uploadJarAndConfig',
                            baseURL: this.hostUrl,
                            headers: { 'Content-Type': 'multiple/form-data' },
                            data: formData,
                        })
                        .then((response) => {
                            // 还未处理
                            console.log(response);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    } else {
                        this.$message({
                            title: '算法上传失败',
                            message: '请确保填写所有配置信息',
                            type: 'error'
                        });
                        return false;
                    }
                });   
            }
        }
    }
</script>

<style>
 /*   .hangUp {
        background: rgba(204, 204, 204, 0.8);
    }
*/    .loadStyle .el-upload--text{
        width: 100%;
        height: 100%;
        overflow: inherit;
        border: 1px #d9d9d9;
    }
    .uploadBtn {
        width: 100%;
    }
    .uploadWidget {
        display: none;
    }
    .rightClose {
        position: absolute;
        right: 0;
        color: rgba(204, 204, 204, 0.5);
        padding: 10px 10px 0 0;
    }
    .tableForm .el-table th {
        text-align: center;
    }
    .tableForm {
        width: 600px;
        text-align: center;
        display: block;
    }
    .upload {
        position: relative;
        width: 600px;
        min-height: 400px;
        background: white;

        border-radius: 10px;
        border: 1px solid #bfcbd9;
        display: none;

        font-family: '微软雅黑';
        font-weight: 700;
    }
    .crumbs{
        text-decoration: none;
    }
    .submit-btn{
        width:180px;
    }
    .myContent {
        width: 560px;
        min-height: 360px;
        /*background: red;*/
        padding-top: 20px;
        padding-right: 20px;
        padding-left: 20px;
    }
    .myContent .title {
        padding-bottom: 20px;
    }
    .file {
        display: none;
    }
</style>