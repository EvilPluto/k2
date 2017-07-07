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
              <input class="padi" id="fileName1" readonly="readonly" placeholder="导入事件日志"/>
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
                 <input v-model="scope.row.val" @change='checkParaList'>
                </template>   
              </el-table-column>
             </el-table>
        </div>
        <div class="bottom" style="margin:20px 0;">
          <el-select v-model="imageType" placeholder="请选择流程表示模型">
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

        list:[],
        curPage:1,
        pageSize:10,
        pageTotal:0,
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
      }
    },
    props:['paraList'],                                             //从父组件接收的参数列表
    methods: {
     handleSelectChange(val){
        this.currentRow=val;
        this.selectLogId=val.id;
        this.selectLogName=val.logName;
     },
     handleClick_sure(){                                               //用户确认所选择的事件日志
        if(!this.currentRow){
             alert('请选择日志文件');
        }
       var pop=document.getElementsByClassName('popover')[0];
       pop.style.display='none';
       var tip=document.getElementsByClassName('padi')[0];
       tip.value=this.selectLogName;
     },
     handleClick_cancel(){                                             //用户取消选择日志
       var pop=document.getElementsByClassName('popover')[0];
       pop.style.display='none';
       var tip=document.getElementsByClassName('padi')[0];
       tip.value='';
       this.selectLogId='';
       this.selectLogName='';
     },
     handlePageChange(){
        this.getLog(this.curPage);
     },
     getLog(pageNum){                                //获取事件日志列表
       this.list=[];
       var self=this;
       this.$axios({
           url:'/processmining//eventLog/listAll?pageNum='+pageNum+'&pageSize=5',
           method:'get',
       }).then((response)=>{
          if(response.data.code==200){
              var data=response.data.data;
              var logs=data.list;
              self.curPage=data.pageNum;
              self.pageSize=data.pageSize;
              self.pageTotal=data.total;
              for(let i=0;i<logs.length;i++){
                  let obj={};
                  obj.id=logs[i].id;
                 // console.log(obj.id);
                  obj.type=logs[i].type;
                  obj.logName=logs[i].name;
                  obj.creator=logs[i].creator;
                  obj.createTime=logs[i].createTime;
                  this.list.push(obj);
              }
          }
       })
     },
     Init(){                                   //初始化弹框
       for(let i=0;i<this.paraList.length;i++){
           let obj={};
           obj.sub=i;
           obj.displayName=this.paraList[i].displayName;
           obj.name=this.paraList[i].name;
           obj.type=this.paraList[i].type;
           obj.val=this.paraList[i].defaultValue;
           this.miningData.push(obj);
       }
    },
    setPara(){
      this.$emit('changePara',this.selectLogId,this.miningData,this.isParaListOK,this.imageType);
    },
    loop(){                                    //周期性向父组件传递消息
      var self=this;
      setInterval(function(){
        self.setPara();
      },1000);
    },
    checkParaList(){
       for(let i=0;i<this.miningData.length;i++){
         if(this.miningData[i].val==''){
           this.isParaListOK=false;
           this.setPara();
           return;
         }
       }
    }
    },
    mounted(){
      var vm=this;
      vm.Init();
      vm.loop();
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