<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-date"></i> 算法管理</el-breadcrumb-item>
                <el-breadcrumb-item>融合算法管理</el-breadcrumb-item>
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
                    <p class="title">融合算法导入及参数设置</p>
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
            var checkName = (rule, value, callback) => {
                var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\\\]");
                if (value.indexOf(" ") >= 0) {
                    callback(new Error('请不要包含空格'));
                } else if (value.match(reg)) {
                    callback(new Error('请不要输入特殊字符'));
                } else if (value.gblen() > 44) {
                    callback(new Error('请输入少于44位字节的名字'));
                } else {
                    callback();
                }
            };

            var checkDesc = (rule, value, callback) => {
                if (value.gblen() > 255) {
                    callback(new Error('请输入少于255位字节的描述'));
                } else {
                    callback();
                }
            };

            return {
                tapOrNot: false,
                hostUrl: '/processmining', // IP'
                fileUpload: {
                    package: '',
                    conf: '',
                    name: '',
                    desc: ''
                },
                algorithmData: [],
                uploadRules: {
                    package: [
                        { required: true, message: '请上传算法包', trigger: 'change' }
                    ],
                    conf: [
                        { required: true, message: '请上传算法配置文件', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请填写算法名称', trigger: 'blur' },
                        { validator: checkName, trigger: 'change, blur' }
                    ],
                    desc: [
                        { required: true, message: '请添加算法描述', trigger: 'blur' },
                        { validator: checkDesc, trigger: 'change, blur' }
                    ]
                }
            }
        },
        created() {
            this.loadData();
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
                    default:
                        break;
                }
            },

            loadData() {
                this.$axios({
                    url: '/manager/listMergeAlgo',
                    method: 'get',
                    baseURL: this.hostUrl
                })
                .then((response) => {
                    this.algorithmData = response.data;
                    this.$message({
                        message: '数据加载成功!',
                        type: 'success'                        
                    })
                })
                // fixed: 经常跳出
                .catch((error) => {
                    this.$message({
                        message: '数据加载失败: ' + '请重试!',
                        type: 'error'
                    });
                    console.log("【Error】:", error);
                });
            },

            deleteAlgorithm(index, row) {
                var self = this;
                console.log(index, row);
                console.log(row.id);
                this.$axios({
                    url: '/manager/deleteJarAndConfig/' + row.id,
                    method: 'delete',
                    baseURL: this.hostUrl
                })
                .then((response) => {
                    if (response.data.code === 200) {
                        self.$message({
                            message: '数据删除成功!',
                            type: 'success'                        
                        });
                        self.algorithmData = response.data.algo;
                    } else {
                        console.log(response.data.code);
                        self.codeParsing(response.data.code);
                    }
                })
                .catch((error) => {
                    this.$message({
                        message: '数据删除失败: ' + '请重试!',
                        type: 'error'
                    });
                    console.log("【Error】:", error);
                });  
            },

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
                    this.$refs.package.value = null;
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
                var suffix = file.name.substring(file.name.lastIndexOf(".")+1, file.name.length);
                if (suffix === 'json') {
                    this.fileUpload.conf = file.name;
                } else {
                    this.$refs.conf.value = null;
                    this.$message({
                        title: '配置文件格式错误',
                        message: '请上传正确的.json配置文件！',
                        type: 'error'
                    });
                }
            },

            cancel() {
                var self = this;
                this.$refs['fileUpload'].resetFields();
                this.fileUpload.package = '';
                this.fileUpload.conf = '';

                this.$refs.package.value = null;
                this.$refs.conf.value = null;

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
                        formData.append('package', pac, pac.name);
                        formData.append('config', con, con.name);
                        formData.append('algoName', this.fileUpload.name);
                        formData.append('description', this.fileUpload.desc);
                        formData.append('type', 0);

                        this.$axios ({
                            method: 'post',
                            url: '/manager/uploadAlgo',
                            baseURL: this.hostUrl,
                            headers: { 'Content-Type': 'multiple/form-data' },
                            data: formData,
                        })
                        .then((response) => {
                            if (response.data.code === 200) {
                                self.$message({
                                    message: '数据上传成功!',
                                    type: 'success'                        
                                });
                                self.algorithmData = response.data.payload;
                                console.log(self.algorithmData);
                            } else {
                                console.log(response.data.code);
                                self.codeParsing(response.data.code);
                            }
                            self.cancel();
                        })
                        .catch((error) => {
                            console.log("【Error】:" + error);
                        });
                    } else {
                        this.$message({
                            title: '算法上传失败',
                            message: '请确保所有配置信息填写正确',
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