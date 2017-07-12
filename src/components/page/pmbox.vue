<template>
  <div class="pmbox">
       <el-popover
       ref="popover"
       placement="top"
       width="752"
       popper-class='popover'
       triger="click">
         <div class="btns"style="margin-bottom:10px;">
             <el-button type="primary" @click='handleClick_sure'>确定</el-button>
             <el-button @click='handleClick_cancel'>取消</el-button>
         </div>
         <el-table 
         :data="list" 
         highlight-current-row 
          @current-change="handleSelectChange">
              <el-table-column property="id"  label="id" align="center" width="1">
                <template scope="scope">
                 <span> </span>
                </template>       
              </el-table-column>
            <el-table-column width="250" property="logName"align="center" label="事件日志"></el-table-column>
            <el-table-column width="250" property="creator" align="center" label="创建者"></el-table-column>
            <el-table-column width="250" property="createTime"align="center" label="创建时间"></el-table-column>
         </el-table>
        <div class="pageBar">
            <el-pagination
            @current-change ="handlePageChange"
            :current-page.sync='curPage'
            :page-size='pageSize'
            layout="prev, pager, next"
            :total="pageTotal">
            </el-pagination>
        </div>
       </el-popover>
       <div class="top">
           <div class="SelectLog">
              <input class="padi" id="fileName1" readonly="readonly" placeholder="  导入事件日志"/>
	            <a class="addFile"  v-popover:popover @click="getLog(curPage)"><img src="../../assets/addFile.png" alt="按钮"></a>
			     </div>
       </div>
       <div class="modifyPara">
           <div style="background:#EEF1F6;width:100%;height:40px;margin-bottom:10px;text-align:center">
              <p style="line-height:40px;">算法参数设置</p>
           </div>
           <el-table
              ref="pmTable"
              :data="miningData"
              border
              highlight-current-row 
              style="width:100%"
              max-height="400">
              <el-table-column
                prop="id"
                label="下标"
                align="center"
                width="1">
                <template scope="scope">
                 <span> </span>
                </template>       
              </el-table-column>
              <el-table-column
                prop="displayName"
                label="参数名"
                align="center"
                width="244">
                <template scope="scope">
                 <span>{{scope.row.displayName}}</span>
                </template>       
              </el-table-column>
              <el-table-column
                prop="val"
                label="设置值"
                align="center"
                width="164">
                <template scope="scope">
                   <div v-if="scope.row.type == 1" class="wrap-style">
                    <input type="number" v-model="scope.row.val" @change='checkParaList' @blur='checkPara(scope.row.val,scope.row.type)'>
                   </div>
                   <div v-if="scope.row.type == 2" class="wrap-style">
                    <input v-model="scope.row.val" @change='checkParaList' @blur='checkPara(scope.row.val,scope.row.type)'>
                   </div>
                   <div v-if="scope.row.type == 3">
                     <el-select v-model="scope.row.val" placeholder="请选择"@change='checkParaList' >
                         <el-option v-for="item in arr[scope.$index]":key='item' :label='item' :value='item'>
                         </el-option>
                     </el-select>
                   </div>
                    <div v-if="scope.row.type == 4">
                      <el-select v-model="scope.row.val" placeholder="请选择"@change='checkParaList' >
                         <el-option v-for="item in arr[scope.$index]":key='item' :label='item' :value='item'>
                         </el-option>
                      </el-select>
                   </div>
                    <div v-if="scope.row.type == 5">
                     <el-select v-model="scope.row.val" placeholder="请选择"@change='checkParaList' >
                         <el-option v-for="item in arr[scope.$index]":key='item' :label='item' :value='item'>
                         </el-option>
                     </el-select>
                   </div>
                </template>   
              </el-table-column>
             </el-table>
        </div>
        <div class="bottom" style="margin:20px 0;">
          <el-select v-model="imageType" placeholder="请选择流程表示模型" @change='setPara' >
             <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
             </el-option>
          </el-select>
        </div>
   </div>
</template>
<script>
  export default {
    data() {
      return {
        miningData:[],                //算法参数
        arr:[],                       //算法参数默认值列表
        hostUrl:"/processmining",
        list:[],
        curPage:1,
        pageSize:10,
        pageTotal:0,
        isPaging:false,
        currentRow:'',
        selectLogId:'',
        selectLogName:'',
        isParaListOK:true,
        imageType:'',
        options: [{
          value: 1,
          label: '工作流网'
        }, {
          value: 2,
          label: '流程图'
        }, {
          value: 3,
          label: '桑基图'
        }, {
          value: '4',
          label: '力导向图'
        }],
        boxShow:true
      }
    },
    props:['paraList'],                                             //从父组件接收的参数列表
    methods: {
     handleSelectChange(val){
       console.log(val);
       if(val!=null&&parseInt(val.id)){
        // console.log(val);
          this.currentRow=val;
          this.selectLogId=val.id;
          this.selectLogName=val.logName;
       }
     },
     handleClick_sure(){                                               //用户确认所选择的事件日志
        if(!this.currentRow){
             this.$message({title:'提示',message:'请选择日志文件',type:'error'});
        }
       var pop=document.getElementsByClassName('popover')[0];
       pop.style.display='none';
       var tip=document.getElementsByClassName('padi')[0];
       tip.value='   '+this.selectLogName;
       this.setPara();
     },
     handleClick_cancel(){                                             //用户取消选择日志
       var pop=document.getElementsByClassName('popover')[0];
       pop.style.display='none';
       var tip=document.getElementsByClassName('padi')[0];
       tip.value='';
       tip.placeholder='  导入事件日志';
       this.selectLogId='';
       this.selectLogName='';
       this.currentRow='';
       this.setPara();
     },
     handlePageChange(){                             //监听用户翻页
        this.getLog(this.curPage);
     },
     checkPara(val,type){                               //检测用户输入
       if(type==1){
         if(!this.testInteger(val)){
           this.$message({title:'提示',message:'请输入整数',type:'error'});
         }
       }
       if(type==2){
         if(!this.testFloat(val)){
           this.$message({title:'提示',message:'请输入浮点数',type:'error'});
         }
       }
     },
     testInteger(val){                            //测试是否为整数
        var p1=/^\d{1,}$/;
        if(!p1.test(val)){
          return false;
        }
        return true;
     },
     testFloat(val){                              //测试是否为浮点数
        var p1=/^\d{1,}\.$/;
        var p2=/^\.\d{1,}$/;
        if(p1.test(val)||p2.test(val)){
          val=parseFloat(val);
        }
        var p3=/^\d{1,}(\.\d{1,})?\d{0,}$/;
        if(!p3.test(val)){
          return false;
        }
        return true;
     },
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
            case 301:
                msg('权限问题', '用户已禁用，请联系管理员');
                break;
            case 302:
                msg('权限问题', '用户未激活，请去邮箱激活用户');
                break;
            case 400:
               msg('权限问题', '用户未登录或被下线，请重新登录：3s后跳转');
                setTimeout(function() {
                    window.location.replace("../processmining/index.html")
                }, 3000);
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
     getLog(pageNum){                                //获取事件日志列表
       this.list=[];
       var self=this;
       this.$axios({
           url:'/eventLog/listAll?pageNum='+pageNum+'&pageSize=5',
           method:'get',
           baseURL:self.hostUrl
       }).then((response)=>{
          if(response.data.code==200){
              var data=response.data.data;
              var logs=data.list;
              self.curPage=data.pageNum;
              self.pageSize=data.pageSize;
              self.pageTotal=data.total;
              for(let i=0;i<logs.length;i++){
                  let obj={};
                  // console.log(obj);
                  obj.id=logs[i].id;
                 // console.log(obj.id);
                  obj.type=logs[i].type;
                  obj.logName=logs[i].name;
                  obj.creator=logs[i].creator;
                  obj.createTime=logs[i].createTime;
                  this.list.push(obj);
              }
          }else{
            self.codeParsing(response.data.code);
          }
       })
     },
     Init(){                                   //初始化弹框
       this.arr=new Array(this.paraList.length);
       for(let i=0;i<this.arr.length;i++){
         this.arr[i]=[];
       }
       for(let i=0;i<this.paraList.length;i++){
           let obj={};
           obj.sub=i;
           obj.displayName=this.paraList[i].displayName;
           obj.name=this.paraList[i].name;
           obj.type=parseInt(this.paraList[i].type);
           switch(obj.type){
             case 1:
             case 2:
                obj.val=this.paraList[i].defaultValue;
                this.arr[i].push(obj.val);
                break;
            case 3:
            case 4:
            case 5:
               this.arr[i]=this.paraList[i].defaultValue.split(';');
                obj.val=this.arr[i][0];
           };
           this.miningData.push(obj);
       }
    },
    setPara(){
      this.$emit('changePara',this.selectLogId,this.miningData,this.isParaListOK,this.imageType);
    },
    // loop(){                                    //周期性向父组件传递消息
    //   var self=this;
    //   setInterval(function(){
    //     self.setPara();
    //   },500);
    // },
    checkParaList(){
       this.isParaListOK=true;
       for(let i=0;i<this.miningData.length;i++){
         var val=this.miningData[i].val;
         if(val==''){
           this.isParaListOK=false;
           break;
         }
         var type=this.miningData[i].type;
         if(type==1||type==3){
           if(!this.testInteger(val)){
              this.isParaListOK=false;
              break;
           }
         };
         if(type==2||type==4){
           if(!this.testFloat(val)){
              this.isParaListOK=false;
              break;
           }
         }
       }
       this.setPara();
    }
    },
    mounted(){
      var vm=this;
      vm.Init();
      //vm.loop();
    },
  }
</script>
<style scoped>
.pmbox .top{
   height: 36px;
   width: 100%;
   margin-bottom: 10px;
}
.pmbox .SelectLog{
  display: inline-block;
  height: 36px;
}
.pmbox .padi{
  display: inline-block;
  width: 408px;
  height: 36px;
  border:solid #e4e4e4 1px;
}
.pmbox .wrap-style{
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 8px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
.pmbox .modifyPara input{
   position: relative;
   left: 28px;
   background: none;
   border:none;
   height: 30px;
   width:80px;
   outline:none;
}
.pmbox .SelectLog a{
  position: relative;
  cursor: pointer;
  display: block;
  width: 33px;
  height: 30px;
  left: 376px;
  top:-36px;
}
.pmbox .SelectLog img{
  width: 33px;
  height: 33px;
  border: none;
}
</style>