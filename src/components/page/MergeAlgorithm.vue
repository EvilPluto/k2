<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-date"></i> 算法管理</el-breadcrumb-item>
                <el-breadcrumb-item>融合算法管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-button 
                type="primary" 
                class="submit-btn"
                :disabled="tapOrNot"
                @click="uploadAlgorighm">
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
                <el-form>
                    <p class="title">融合算法导入及参数设置</p>
                    <el-form-item>
                        <el-col :span="11">
                            <el-input
                                v-model="fileUpload.package"
                                placeholder="导入算法包"
                                icon="upload"
                                :on-icon-click="getFiles"
                                width="100%"
                                >
                            </el-input>
                        </el-col>
                        <el-col :span="2">
                            &nbsp
                        </el-col>
                        <el-col :span="11">
                            <el-input
                                v-model="fileUpload.conf"
                                placeholder="导入配置文件"
                                icon="upload"
                                :on-icon-click="getFiles"
                                width="100%"
                                >
                            </el-input>                     
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-input
                            placeholder="设置算法名称"
                            v-model="fileUpload.name"
                            width="100%"
                            >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
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
                fileUpload: {
                    package: '',
                    conf: '',
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

            }
        },
        methods:{
            uploadAlgorighm() {
                this.tapOrNot = true;
                $('.tableForm').css('display', 'none');
                $('.content').addClass('hangUp');
                $('.upload').css('display', 'block');
                // $('.breadcrumb').append(
                //     '<span class="el-breadcrumb__item"><span class="el-breadcrumb__item__inner"><i class="el-icon-upload"></i> 上传算法</span><span class="el-breadcrumb__separator">/</span></span>'
                //     );
            },
            backToForm() {
                this.tapOrNot = false;
                $('.tableForm').css('display', 'block')
                $('.content').removeClass('hangUp');
                $('.upload').css('display', 'none');
            },
            getFiles() {
                // console.log(this.$refs.upload);
            },
            logPrint() {
                console.log('233');
            }
        }
    }
</script>

<style>
    .uploadBtn {
        width: 100%;
    }
    .hangUp {
        background: rgba(204, 204, 204, 0.5);
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
</style>