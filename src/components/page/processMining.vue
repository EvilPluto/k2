<template>
  <div class="pm">
    <div class="head" style="margin-bottom:30px;">
        <p> 流程挖掘</p>
    </div>
   <div class="main">
       <el-table
         ref="processMiningTable"
         :data="pmData"
         border
         highlight-current-row
         style="width:100%;margin-bottom:60px;"
         max-height="350">
         <el-table-column
           prop="sub"
           label="#"
           width="50"
           align='center'>
            <template scope="scope">
               <span>{{scope.row.sub}}</span>
             </template>
         </el-table-column>
         <el-table-column
           prop="miningType"
           label="挖掘方法"
           width="200"
           align='center'>
           <template scope="scope">
               <span>{{scope.row.miningType}}</span>
           </template>
         </el-table-column>
          <el-table-column
           prop="bagName"
           label="包名"
           width="200"
           align='center'>
           <template scope="scope">
              <span>{{scope.row.bagName}}</span>
           </template>
         </el-table-column>
         <el-table-column
           prop="className"
           label="类名"
           width="217"
           align='center'>
           <template scope="scope">
              <span>{{scope.row.className}}</span>
           </template>
         </el-table-column>
          <el-table-column
           prop="methodName"
           label="方法名"
           width="200"
           align='center'>
           <template scope="scope">
              <span>{{scope.row.methodName}}</span>
           </template>
         </el-table-column>
         <el-table-column
           prop="applyId"
           label="操作"
           width="150"
           align='center'>
           <template scope="scope">
               <el-button @click='apply(scope.row.applyId,scope.row.miningType)'>应用</el-button>
           </template>
         </el-table-column>
       </el-table>
   </div>
  </div>
</template>
 
<script>
import pmBox from './pmbox.vue'
import drawGraph from './renderGraph.vue'
  export default {
     components:{pmBox,drawGraph},
      data(){
          return {
            boxShow:true,
            hostUrl:"http://110.64.72.33:8888/processmining",
            methodId:'',          //用户选中的算法ID
            pmData:[],            //算法列表
            paraList:[],          //某个算法的参数
            configList:[],         //传递给后端的算法参数
            isConfigOK:true,       //参数是否完整
            logId:'',             //目标事件日志
            imageType:'',         //流程表示模型
            payload:'',          //挖掘结果
          }
      },
      methods:{
        clearBox(){                                             //依据key清除子组件缓存
          this.boxShow=!this.boxShow;
        },
        popUp(name){
          this.clearBox();
          const h = this.$createElement;
          var self=this;
          var tag=0;                                                            //挖掘是否成功的标志位
          this.$msgbox({
            title: name,
            message: h('pmBox',{props:{paraList:self.paraList},key:self.boxShow,
            on:{changePara:function(logId,list,isListFull,imageType){          //实时接收子组件的消息
                 self.configList=[];
                  for(let i=0;i<list.length;i++){
                    let obj={};
                    obj.name=list[i].name;
                    obj.type=list[i].type;
                    obj.value=list[i].val;
                    self.configList.push(obj);
                  }
                  self.logId=logId;
                  self.isConfigOK=isListFull;
                  self.imageType=parseInt(imageType);
               }}
            }),
            showCancelButton: true,
            confirmButtonText: '确定',
            customClass:'pmPop',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                if(self.valid()){
                   instance.confirmButtonLoading = true;
                   instance.confirmButtonText = '执行中...';
                   self.$axios({
                      url:'/processmining/logMining/mining',
                      method:'post',
                      data:{
                         logId:self.logId,
                         methodId:self.methodId,
                         paramList:self.configList,
                         imageType:self.imageType
                      }
                   }).then((response)=>{
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText='确定';
                      if(response.data.code==200){
                        done();
                        self.payload=response.data.payload;
                        tag=1;
                        console.log(self.payload);
                      }
                   })
                }
              } else {
                done();
              }
            }
          }).then(action => {
             if(tag==1){
                this.renderGraph();
             }
         });
        },
        Init(){                                   //初始化挖掘算法列表
            var self=this;
            this.$axios({
                url:'/processmining/logMining/method',
                method:'get',
                //baseURL: self.hostUrl,
            }).then((response)=>{
                if(response.data.code==200){
                  var data=response.data.data;
                  for(let i=0;i<data.length;i++){
                      let obj={};
                      obj.sub=i;
                      obj.miningType=data[i].name;
                      obj.bagName=data[i].packagename;
                      obj.className=data[i].classname;
                      obj.methodName=data[i].method;
                      obj.applyId=data[i].id;
                      self.pmData.push(obj);
                  }
                }else{
                   // alert(response);
                }
            })
        },
        apply(id,name){                   //应用某个算法
            if(id){
               this.methodId=id;
                var self=this;
                this.$axios({
                    url:'/processmining/logMining/algoConfig/'+id,
                    method:'get',
                    //baseURL:self.hostUrl
                }).then((response)=>{
                    if(response.data.code==200){
                        self.paraList=response.data.config.params;
                        self.popUp(name);
                    }
                })
            }
        },
        valid(){                             //验证挖掘参数是否完整
          let tag=0;
          if(this.logId==''){
              this.$message({title:'提示',message:'请选择事件日志',type:'error'});
              return false;
           }
          if(!this.isConfigOK){
              this.$message({title:'提示',message:'参数不能缺省',type:'error'});
              return false;
          }
          if(this.imageType==''){
              this.$message({title:'提示',message:'请选择流程表示模型',type:'error'});
              return false;
          }
          return true;
        },
        renderGraph(){
          const h = this.$createElement;
          var self=this;
          this.$msgbox({
                title: ' ',
                message: h('drawGraph',{props:{payload:self.payload,imageType:self.imageType,logId:self.logId,methodId:self.methodId,paramList:self.configList}}),
                showConfirmButton:false,
                customClass:'showBox',
                beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                   instance.confirmButtonLoading = true;
                   instance.confirmButtonText = '执行中...';
                   setTimeout(() => {
                        done();
                        setTimeout(() => {
                            instance.confirmButtonLoading = false;
                        }, 300);
                    }, 3000);
                } else {
                    done();
                }
                }
        })
      },
    //   showTitle(){
    //     let msg='';
    //     switch(this.imageType){
    //      case 1:
    //        msg='工作流网';
    //        break;
    //      case 2:
    //        msg='流程图';
    //        break;
    //      case 3:
    //        msg='桑基图';
    //        break;
    //      case 4:
    //        msg='力导向图';
    //        break;
    //      default:
    //        break;
    //    };
    //    return msg;
    //  }
  },
     mounted(){
         var self=this;
         this.Init();
     }
  }
</script>

<style>
  .pm .head{
    font-size: 13px;
    font-family: "Helvetica Neue",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
  }
  .pmPop{
    width: 450px;
  }
  .pmPop .el-message-box__btns{
    position: relative;
    margin-top:-96px;
    width:180px;
    left: 232px; 
  }
  .showBox{
    width:1000px;
  }
  .showBox .el-message-box__header{
    width:700px;
    position: relative;
    left: 250px;
  }
</style>