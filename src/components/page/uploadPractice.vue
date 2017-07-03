<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-upload"></i> Test</el-breadcrumb-item>
                <el-breadcrumb-item>上传测试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="myContent">
                <el-form ref="fileUpload" :model="fileUpload">
                    <p class="title">算法导入及参数设置</p>
                    <el-form-item>
                        <el-col :span="11">
                            <el-input
                                placeholder="导入算法包"
                                icon="upload"
                                v-model="fileUpload.package"
                                :on-icon-click="uploadPackage"
                                >
                            </el-input>
                            <input type="file" name="package" class="file" id="package"
                                accept="image/png,image/gif,image/jpeg" ref="package"
                                @change="getPackage" />
                        </el-col>
                        <el-col :span="2">
                            &nbsp
                        </el-col>
                        <el-col :span="11">
                            <el-input
                                placeholder="导入配置文件"
                                icon="upload"
                                v-model="fileUpload.conf"
                                :on-icon-click="uploadConf"
                                >
                            </el-input>
                            <input type="file" name="conf" class="file" id="conf"
                                accept="image/png,image/gif,image/jpeg" ref="conf"
                                @change="getConf" />          
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
                                @click="submit"
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
                hostUrl: '/processmining', // IP'
                fileUpload: {
                    package: '',
                    conf: '',
                    name: '',
                    desc: ''
                }
            }
        },
        methods:{
            uploadPackage() {
                $('#package').click();
            },
            uploadConf() {
                $('#conf').click();
            },
            getPackage(e) {
                let file = e.target.files[0];
                console.log(file);
                this.fileUpload.package = '已选择文件：' + file.name;
                // let param = new FormData();
                // formData.append('package', file, file.name);
                // this.fileUpload.package = file;
                // this.fileUpload.packageName = file.name;
            },
            getConf(e) {
                let file = e.target.files[0];
                console.log(file);
                this.fileUpload.conf = '已选择文件：' + file.name;
                // let param = new FormData();
                // formData.append('conf', file, file.name);
                // console.log(formData.get('file'));
                // this.fileUpload.conf = file;
                // this.fileUpload.confName = file.name;             
            },
            submit() {
                // console.log(formData.get('file'));
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
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    }
</script>

<style>
    .myContent .title {
        padding-bottom: 20px;
    }
    .file {
        display: none;
    }
    .uploadBtn {
        width: 100%;
    }
</style>