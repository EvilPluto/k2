<template>
    <div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 教师</el-breadcrumb-item>
                <el-breadcrumb-item>教师信息录入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="form-box">
        </div>





    </div>
</template>
<style>

</style>

<script>
    export default {
        data() {
            return {
                hostUrl:'http://localhost:8888/timetable',
            }
        },
        methods: {
            // onSubmit() {
            //     this.$message.success('提交成功！' + this.teacher.region);
            //     this.$axios({
            //         url: '/teacher',
            //         method: 'post',
            //         baseURL: this.hostUrl,
            //         data: {
            //             teacherName: this.teacher.name,
            //             groupId: this.teacher.region
            //         }
            //     })
            //     .then((response) => {
            //         this.tableData = response.data;
            //     })
            //     .catch((error) => {
            //         console.log("Error:", error);
            //     });
            // },
            // clear(formElement) {
            //     this.$refs[formElement].resetFields();
            // },
            
        }
    }//export end
</script>