<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 算法管理</el-breadcrumb-item>
                <el-breadcrumb-item>挖掘算法管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <div class="form-box">
            <el-button type="primary" class="submit-btn" >上传算法</el-button>
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
                        width="270">
                    </el-table-column>
                    <el-table-column
                        width="108" 
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


    </div>
</template>

<script>
    
    export default {
        data() {
            return {
                algorithmData: [
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
                    {
                        name: 'login.txt',
                    },
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
        }
    }
</script>

<style>
.tableForm .el-table th {
    text-align: center;
}
.tableForm {
    width: 480px;
    text-align: center;
}
.crumbs{
    text-decoration: none;
}
.submit-btn{
    width:180px;
}
</style>