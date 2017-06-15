<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 课表</el-breadcrumb-item>
                <el-breadcrumb-item>课表导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="content-title">
            请选择需要导入的课表文件
        </div>
        <el-upload
            class="upload-demo"
            drag
            action="http://192.168.1.174:8080/timetable/uploadTimeTable"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过1MB</div>
        </el-upload>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                fileList: []
            }
        },
        methods:{
        }
    }
</script>

<style scoped>

</style>