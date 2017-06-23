<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 日志管理</el-breadcrumb-item>
                <el-breadcrumb-item>原始日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div  class="form-box">
            <div class="log-btn">
                <el-button-group>
                    <el-button type="primary" icon="upload" @click="uploadBtn()">上&nbsp;传</el-button>
                    <el-button type="primary" icon="share" @click="downloadBtn()">下&nbsp;载</el-button>
                    <el-button type="primary" icon="edit" 
                    @click="normalizeBtn()">规范化</el-button>
                    <el-button type="danger" icon="delete2" @click="deleteBtn()">删&nbsp;除</el-button>
                </el-button-group>
            </div>
            <div class="search-box">
                <el-input v-model="searchInput" > 
                    <el-button @click="searchBtn" slot="append" icon="search"></el-button>
                </el-input>

            </div>

            <div class="log-table">
                <el-table
                    ref="logTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @cell-click="handleClick"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                      type="selection"
                      align="left"
                      width="70">
                    </el-table-column>
                    <el-table-column
                      prop="originName"
                      label="原始日志"
                      align = "left"
                      width="130">
                      <template scope="scope">{{ scope.row.originName }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="standardName"
                      label="规范化日志"
                      align = "left"
                      width="150    ">
                      <template scope="scope">{{ scope.row.standardName }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="eventName"
                      label="事件化日志"
                      align = "left"
                       width="150"
                      show-overflow-tooltip>
                      <template scope="scope">{{ scope.row.eventName }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="creator"
                      label="作者"
                      width="120"
                      align = "left"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                      prop="createDate"
                      label="创建时间"
                      align = "left"
                      width="200"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column 
                      label="操作"
                      align = "center"
                      width="150">
                      <template scope="scope">
                          <el-button size="small" 
                          id="shareButton" :style="{display:scope.row.isMine?'inline':'none'}" @click="shareBtn(scope.$index,scope.row)" :type="scope.row.isShare?cancelType:shareType">{{scope.row.isShare?shareMsg:cancelMsg}}</el-button>
                      </template>    
                    </el-table-column>                

                </el-table>
            </div>
            <div class="page-box">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPageNum"
                  :page-size="100"
                  layout="prev, pager, next, jumper"
                  :total="1000">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<style scoped>
#shareButton {
}
.page-box{
    margin-top:30px;
}
.form-box{
    width:971px;
    margin-left:0px;
    box-shadow:0 0 8px 0
        rgba(232,237,250,.9),0 2px 4px 0
        rgba(232,237,250,.9);
    padding:30px 50px 30px 50px;      
    display: inline-block;
    text-align: center;
}
.log-btn{
  display: inline-block;
  float:left;
}
.search-box{
  margin-top:10px;
  display: inline-block;
  width:300px;
  float:right;
}
.log-btn{
    margin-top:10px;
}
.log-table{
    margin-top:80px;
}
</style>
<!-- function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return  unescape(r[2]); return null;
} -->
<script>
    import uploadBox from  './uploadBox.vue'
    export default {
        data: function(){
            return {
                hostUrl:"./static",
                // hostUrl:"/processmining",
                searchInput:"",
                currentPageNum:1,

                tableData: [{
                    id:0,
                    originName:"log1.text",
                    standardName:"log2.text",
                    eventName:"log3.text",
                    creator:"Madam Liu",
                    createDate:"1989-06-03",
                    isShare:false,
                    isMine:true,

                },
                {
                    id:1,
                    originName:"log1.text",
                    standardName:"log2.text",
                    eventName:"log3.text",
                    creator:"Madam Liu",
                    createDate:"1989-06-04",
                    isShare:true,
                    isMine:true

                },
                {
                    id:2,
                    originName:"log1.text",
                    standardName:"log2.text",
                    eventName:"log3.text",
                    creator:"Madam Liu",
                    createDate:"1989-06-05",
                    isShare:false,
                    isMine:false
                }],
                ajaxData:{
                    pageNum:1,
                    pageSize:3,
                    size:3,
                    orderBy:null,
                    startRow:1,
                    endRow:3,
                    total:100,
                    pages:34,
                    list:[{
                        id:1,
                        name:'file',
                        format:'txt',
                        createTime:'2017-6-19 16:31',
                        creator:'hemouren',
                        hdfsid:'',
                        isshared:true,
                        toNormLogId:0,
                        toNormLogName:null,
                        toEventLogId:0,
                        toEventLogName:null
                    }],
                    firstPage:1,
                    prePage:0,
                    nextPage:2,
                    lastPage:8,
                    isFirstPage:true,
                    isLastPage:false,
                    hasPreviousPage:false,
                    hasNextPage:true,
                    navigatePages:8,
                    navigatepageNums:[1,2,3]
                },
                multipleSelection: [],
                //分享按钮
                shareMsg:"fuckyou",
                cancelMsg:"asswecan",
                shareType:"primary",
                cancelType:"warning",
                //buffer
                selected:[],

            }
        },
        methods:{
            //get ajax
            getData:function(addUrl){
                var vm = this;
                vm.tableData = [];
                console.log("addurl= "+addUrl);
                this.$axios({
                    // url: '/rawLog/listAll'+addUrl,
                    url:'tableData.json',
                    method: 'get',
                    baseURL: vm.hostUrl,
                }).then((response) => {
                    var temp = {
                            id:0,
                            originName:"log1.text",
                            standardName:"log2.text",
                            eventName:"log3.text",
                            creator:"Madam Liu",
                            createDate:"1989-06-03",
                            isShare:false,
                            isMine:true
                      };
                    console.log("responseData:");
                    console.log(response.data);

                    if(response.data.code == 200){
                        vm.ajaxData = response.data.data;
                        console.log("AJAX DATA :");
                        console.log(vm.ajaxData);
                        vm.currentPageNum = vm.ajaxData.pageNum;
                        for(let i=0;i<vm.ajaxData.list.length;i++){
                            temp = {};
                            temp.id = vm.ajaxData.list[i].id;
                            temp.originName = vm.ajaxData.list[i].name;
                            temp.standardName = vm.ajaxData.list[i].toNormLogName;
                            temp.eventName = vm.ajaxData.list[i].toEventLogName;
                            temp.creator = vm.ajaxData.list[i].creator;
                            temp.createDate = vm.ajaxData.list[i].createTime;
                            temp.isShare = vm.ajaxData.list[i].isshared;

                            if(vm.ajaxData.list[i].creator == localStorage.getItem('ms_username')){
                                temp.isMine = true;
                            }
                            else{
                                temp.isMine = false;
                            }
                            vm.tableData.push(temp);
                        }
                        console.log("tableData:");
                        console.log(vm.tableData);
                    }
                    else{
                        this.$message({
                            type:'error',
                            message:'code is not 200'
                        });
                        console.log('code='+response.data.code);
                    }

                }).catch((error) => {
                    console.log("getdata ajax error=");
                    console.log(error);
                });
            },
            //make ajaxdata into tableData
            getTableData:function(){
                var vm = this;
                var addUrl = "?pageNum="+vm.currentPageNum;
                vm.getData(addUrl);
            },
            searchBtn:function(){
                var vm =this;
                if(vm.searchInput == ''){
                    this.$message({
                        type:'error',
                        message:'搜索内容为空'
                    });
                }
                else{
                    var searchUrl = "?search="+vm.searchInput;
                    console.log("searchUrl: " + searchUrl);
                    vm.getData(searchUrl);
                }
            },

            uploadBtn:function(){
                const h = this.$createElement;
                this.$msgbox({
                    title:'上传',
                    message:h(uploadBox),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                });
            },

            downloadBtn:function(){
                var vm = this;

                if(vm.selected.length ==0){
                    this.$message({
                        type:'error',
                        message:'没有选中任何文件'
                    });
                }
                else if(vm.selected.length == 1)
                {
                        var downloadId = vm.selected[0].id;
                        window.open(vm.hostUrl+"/rawLog/"+downloadId);
                }
                else{
                    var branchUrl = '';
                    window.open*(vm.hostUrl+branchUrl);
                }


            },
            normalizeBtn:function(){
                //code by...
            },
            deleteBtn:function(){
                var vm = this;
                var deleteId = {
                    idList:[]
                };
                console.log("selected=");
                console.log(vm.selected);
                if(vm.selected.length>0){
                    for(let i =0;i<vm.selected.length;i++){
                        deleteId.idList.push(vm.selected[i].id);
                    }
                    // var deleteUrl = deleteId.join('&');
                    console.log("Delete id = ");
                    console.log(deleteId.idList);
                    this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios({
                        url: 'rawLog/',
                        method: 'delete',
                        baseURL: vm.hostUrl,
                        data:deleteId
                        }).then((response) =>{
                            vm.getTableData();
                            if(response.data.code=="200"){
                                this.$alert('选中文件均已删除成功', '删除结果', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        this.$message({
                                            type: 'info',
                                            message:'已删除'
                                        });
                                }
                                });
                            }
                            else{
                                console.log("code = "+response.data.code);
                                this.$alert('删除失败或文件不存在', '删除结果', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        this.$message({
                                            type: 'info',
                                            message: `action: ${ action }`
                                        });
                                }
                                });
                            };
                        }).catch((error) => {
                            console.log("error=");
                            console.log(error);
                        });
                    }).catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消删除'
                        });          
                    });
                }
                else{
                    this.$message({
                        type:"warning",
                        message:"未选择任何日志！"
                    });
                }

            },
            // 分享按钮
            shareBtn:function(index,row){
                var vm = this;
                console.log("share click =")
                console.log(index);
                console.log(row);

                // row.isShare = !row.isShare;
                if(!row.isShare){
                    this.$axios({
                        url:'/rawLog/share/'+ row.id,
                        method: 'get',
                        baseURL:vm.hostUrl
                    }).then((response) => {
                        vm.getTableData();
                        console.log("code =="+response.data.code);
                        if(response.data.code =="200"){
                            this.$message({
                                type:"success",
                                message:"分享成功！"
                            });
                            row.isShare = !row.isShare;
                        }
                        else{
                            this.$message({
                                type:"error",
                                message:"系统错误"
                            });
                        }
                    }).catch((error) => {
                        this.$message({
                            type:"error",
                            message:"网络无连接"
                        });
                    });
                }
                else{
                    this.$axios({
                        url:'/rawLog/unshare/'+ row.id,
                        method: 'get',
                        baseURL:vm.hostUrl
                    }).then((response) => {
                        vm.getTableData();
                        console.log("code =="+response.data.code);
                        if(response.data.code =="200"){
                            this.$message({
                                type:"success",
                                message:"取消分享成功！"
                            });
                            row.isShare = !row.isShare;
                        }
                        else{
                            this.$message({
                                type:"error",
                                message:"系统错误"
                            });
                        }
                    }).catch((error) => {
                        this.$message({
                            type:"error",
                            message:"网络无连接"
                        });
                    });

                }
            },
            handleSelectionChange(val){
                var vm = this;
                vm.selected = val;
                console.log("selected = ")
                console.log(vm.selected);
            },
            
            handleCurrentChange:function(){
                var vm=this;
                console.log("current-Page:");
                console.log(vm.currentPageNum);
            },
            handleClick:function(val){
                console.log("CLICK:");
                console.log(val);
            }

        },
        mounted(){
          var vm=this;
          vm.getTableData();
        }
    }
</script>
