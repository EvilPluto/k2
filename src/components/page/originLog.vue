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
                    <el-button type="primary" icon="caret-bottom" @click="downloadBtn()">下&nbsp;载</el-button>
                    <el-button type="primary" icon="edit" 
                    @click="normalizeBtn">规范化</el-button>
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
                    style="width:100%"
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
                      label="共享"
                      align = "center"
                      width="150">
                      <template scope="scope">
                          <el-button size="small" 
                          id="shareButton" :style="{display:scope.row.isMine?'inline':'none'}" @click="shareBtn(scope.$index,scope.row)" :type="scope.row.isShare?cancelType:shareType">{{scope.row.isShare?cancelMsg:shareMsg}}</el-button>
                      </template>    
                    </el-table-column>                

                </el-table>
            </div>
            <div class="page-box">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPageNum"
                  :page-size="pageSize"
                  layout="prev, pager, next, jumper"
                  :total="pageTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<style>
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
.normalize-wrap{
    width:900px;
} 
.normalize-wrap .el-message-box__btns {
    position: relative;
    margin-top:-76px;
    width:660px;
    left: 200px; 
}
</style>
<script>
    import uploadRawBox from  './uploadRawBox.vue'
    import msgBox from './msgBox.vue'
    export default {
        data: function(){
            return {
                // hostUrl:"./static",
                hostUrl:"/processmining",
                searchInput:"",
                currentPageNum:1,
                pageSize:1,
                pageTotal:20,
                myKey:true,
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
                shareMsg:"分享",
                cancelMsg:"取消",
                shareType:"primary",
                cancelType:"warning",
                //buffer
                selected:[],
                //
                //
                //MSG BOX PART
         isWell:true,
         toFormat:[{
          sub:0,
          name:'[QC]',
          mark:'ABCD',
          identifying:'[Method]',
          originForm:'Incident:A-B-C-D,Plan:C/B/ATD,Task:A/B/CTD,DEFAULT:A-B-CTD',
          targetForm:'A-B-CTD'
        }],
        toConformTime:[{originTime:'[QC]',targetTime:'Time'}],
        toConformData:[{sub:0,originData:'[Method];[Status]',targetData:'EventName'},
                      {sub:1,originData:'[FKPlanID]',targetData:'FKPlanID'},
                      {sub:2,originData:'[PKIncidentID]',targetData:'PKIncidentID'},
                      {sub:3,originData:'[PKTaskID]',targetData:'PKTaskID'},
                      {sub:4,originData:'[PKPlanID]',targetData:'PKPlanID'},
                      {sub:5,originData:'[FKIncidentID]',targetData:'FKIncidentID'}],
       recordings:[{dataSeparator:'\\t',nameSeparator:' ',nullSeparator:' '}],

            //normalize postData
            normalizeData:{
                id:1,
                formats:'',
                timeNames:'',
                targetTimeName:'',
                dataNames:'',
                oriitemSeparator:'',
                orinameValSeparator:'',
                orinulVal:'',
                targetitemSeparator:'',
                targetnameValSeparator:'',
                targetnulVal:''
            }

            }
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
                    case 201:
                        msg('输入域错误', '验证码错误');
                        break;
                    case 300:
                        msg('输入域错误', '邮箱或密码错误');
                        break;
                    case 301:
                        msg('权限问题', '用户已禁用，请联系管理员');
                        break;
                    case 302:
                        msg('权限问题', '用户未激活，请去邮箱激活用户');
                        break;
                    case 303:
                        msg('注册问题', '邮箱已占用，请更改邮箱');
                        break;
                    case 304:
                        msg('注册问题', '昵称已占用，请更改昵称');
                        break;
                    case 400:
                        msg('权限问题', '用户未登录，请重新登录');
                        window.location.replace("../index.html");
                        break;
                    case 401:
                        msg('权限问题', '用户无权访问，请联系管理员');
                        break;
                    case 402:
                        msg('操作错误', '删除错误,请刷新重试');
                        break;
                    case 500:
                        msg('系统错误', '未知错误，请上报管理员');
                        break;
                    case 600:
                        msg('TIME_OUT', '访问超时，请检查网络连接');
                        break;
                    case 700:
                        msg('激活错误', '非法激活链接，请联系管理员');
                        break;
                    case 800:
                        msg('激活错误', '用户已被激活，请直接登录');
                        break;
                    case 900:
                        msg('事件化错误', '事件化失败');
                        break;
                    case 901:
                        msg('上传错误', '文件大小为0');
                        break;   
                    default:
                        break;
                }
            },
            //get ajax
            getData:function(addUrl){
                var vm = this;
                vm.tableData = [];
                console.log("addurl= "+addUrl);
                this.$axios({
                    url: '/rawLog/listAll'+addUrl,
                    // url:'./static/tableData.json',
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
                        vm.pageSize = vm.ajaxData.pageSize;
                        vm.pageTotal = vm.ajaxData.total;
                        console.log("============");
                        console.log(vm.ajaxData.list[0]);
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
                        vm.codeParsing(response.data.code);
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
                    var searchUrl = "?info="+vm.searchInput;
                    console.log("searchUrl: " + searchUrl);
                    vm.getData(searchUrl);
                }
            },

            uploadBtn:function(){
                var self= this;
                self.clearKey();
                const h = this.$createElement;
                this.$msgbox({
                    title:'上传',
                    message:h(uploadRawBox,{key:self.myKey}),
                    showConfirmButton:false,
                    showCancelButton: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                });
            },
            clearKey:function(){
                var self = this;
                self.myKey = !self.myKey;
            },
            downloadBtn:function(){
                var vm = this;
                var postData = [];
                var postSTR = "";
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
                    for(let i =0;i<vm.selected.length;i++){
                        postData.push(vm.selected[i].id);
                    }
                    postSTR = postData.join(';');
                    window.open(vm.hostUrl+"/rawLog/downloadBatch?idList="+postSTR);
                }


            },
            normalizeBtn:function(){
                var vm = this;
                console.log(vm.selected);
                if(vm.selected.length == 0){
                    this.$message({
                        type:'warning',
                        message:'请先选择日志'
                    });
                }
                else if(vm.selected.length>1){
                    this.$message({
                        type:'error',
                        message:'一次只能规范化一个日志！'
                    });
                }
                else if(!vm.selected[0].isMine){
                    this.$message({
                        type:'info',
                        message:'不能操作不属于你的日志！'
                    });
                }
                else if(vm.selected[0].standardName){
                    const h = vm.$createElement;
                    vm.clearKey();
                    this.$msgbox({
                        title:'警告',
                        message:h('p',{key:vm.myKey},'选择的日志已被规范化过，确定要重新规范化吗？'),
                        showCancelButton:true,
                        showConfirmButton:true,
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '执行中...';
                                setTimeout(() => {
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 300);
                                }, 1000);
                            }
                            else {
                              done();
                            }   
                        }
                    }).then(action=>{
                        if(action == "confirm"){
                            vm.setup();
                        }
                        else{
                            this.$message({
                                type:'warning',
                                message:'已取消'
                            });
                        }
                    }).catch(() => {
                        console.log('SBBBBBBBBBBBBBBB');
                    });
                }
                else{
                    vm.setup();
                }

            },
            setup:function(){
                //code by...Liu
                const h = this.$createElement; 
                var self=this;
                self.clearKey();
                this.$msgbox({
                  title: '规范化',
                  message: h(msgBox,{on:{changePara:function(arr1,arr2,arr3,arr4,isOK){
                    self.toFormat=arr1;
                    self.toConformTime=arr2;
                    self.toConformData=arr3;
                    self.recordings=arr4;
                    self.isWell=isOK;
                  }},key:self.myKey}),
                  showCancelButton: false,
                  customClass:'normalize-wrap',
                  confirmButtonText: '确定',
                  beforeClose: (action, instance, done) => {
                       if (action === 'confirm') {
                         if(self.isWell){
                           instance.confirmButtonLoading = true;
                           instance.confirmButtonText = '执行中...';
                           setTimeout(() => {
                           done();
                           setTimeout(() => {
                           instance.confirmButtonLoading = false;
                           }, 300);
                         }, 1000);
                         } else{
                          alert('错误：存在空行或缺失数据项');
                          return;
                       }         
                    } else {
                      done();
                    }
                  }
                }).then(action => {
                  if(action=='confirm'){
                    //formats========================
                    var formatsArr = [];
                    for(let i=0;i<self.toFormat.length;i++){
                        var str1 = self.toFormat[i].name+","+self.toFormat[i].mark+","+self.toFormat[i].identifying+","+self.toFormat[i].originForm+","+self.toFormat[i].targetForm;
                        formatsArr.push(str1);
                    };
                    self.normalizeData.formats = formatsArr.join(';');
                    //================================

                    //timeNames-=======================
                    console.log(self.toConformTime);
                    self.normalizeData.timeNames = self.toConformTime[0].originTime;
                    self.normalizeData.targetTimeName = self.toConformTime[0].targetTime;
                    //================================

                    //dataNames======================
                    var dataNamesArr = [];
                    for(let i=0;i<self.toConformData.length;i++){
                        var str2 = self.toConformData[i].originData+":"+self.toConformData[i].targetData;
                        dataNamesArr.push(str2);
                    }
                    self.normalizeData.dataNames = dataNamesArr.join(',');
                    //===============================
                    // Recordings
                    self.normalizeData.oriitemSeparator = self.recordings[0].dataSeparator;
                    self.normalizeData.orinameValSeparator = self.recordings[0].nameSeparator;
                    self.normalizeData.orinulVal = self.recordings[0].nullSeparator;
                    self.normalizeData.id = self.selected[0].id;
                    console.log(self.normalizeData);
                    //AJAX============================
                    this.$axios({
                        url:'/rawLog/convertToNormLog',
                        method:'post',
                        baseURL:this.hostUrl,
                        data:this.normalizeData
                    }).then((response) => {
                        self.getTableData();
                        if(response.data.code == "200"){
                            this.$message({
                                type:'success',
                                message:'规范化成功'
                            });
                        }
                        else {
                            console.log(response.data.code);
                            this.codeParsing(response.data.code);                                
                        }      
                    }).catch((error) => {
                        console.log(error);
                        self.$message({
                                type:'error',
                                message:'网络无连接'
                        });
                    });
                    //==================================
                  }       
                });   

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
                        if(!vm.selected[i].isMine){
                            this.$message({ 
                                type:'error',
                                message:'不能删除不属于你的日志！'
                            });
                            return 0;
                        }
                    }

                    console.log("Delete id = ");
                    console.log(deleteId.idList);

                    const h = vm.$createElement;
                    vm.clearKey();
                    this.$msgbox({
                        title:'警告',
                        message:h('p',{key:vm.myKey},'此操作将永久删除文件, 是否继续?'),
                        showCancelButton:true,
                        showConfirmButton:true,
                        confirmButtonText:'确定',
                        cancelButtonText:'取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '执行中...';
                                setTimeout(() => {
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 300);
                                }, 1000);
                            }
                            else {
                              done();
                            }   
                        }
                    }).then(action=>{
                        if(action == "confirm"){
                            this.$axios({
                                url: 'rawLog/',
                                method: 'delete',
                                baseURL: vm.hostUrl,
                                data:deleteId
                            }).then((response) =>{
                                vm.getTableData();
                                if(response.data.code=="200"){
                                    this.$message({
                                        type:'success',
                                        message:'删除成功'                                    
                                    });
                                }
                                else{
                                    console.log("code = "+response.data.code);
                                    vm.codeParsing(response.data.code);
                                };
                            }).catch((error) => {
                                this.$message({
                                    type:'error',
                                    message:'网络无连接'
                                });
                                console.log("error=");
                                console.log(error);
                                vm.getTableData();
                            });   
                        }
                        else{
                            this.$message({
                                type:'warning',
                                message:'已取消'
                            });
                        }
                    }).catch(() => {
                        console.log('SBBBBBBBBBBBBBBB')
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
                            vm.codeParsing(response.data.code);
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
                             vm.codeParsing(response.data.code);
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
                vm.getTableData();
            },
            handleClick:function(val){
                console.log("CLICK!!!");
                console.log(arguments);
            }

        },
        mounted(){
          var vm=this;
          vm.getTableData();
        }
    }
</script>
