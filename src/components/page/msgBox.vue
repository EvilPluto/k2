
<template>
<div class="popBox">
 <el-tabs v-model="activeName">
    <el-tab-pane label="数据项格式配置" name="first">       
       <el-table
         ref="formatTable"
         :data="toFormat"
         border
         highlight-current-row 
         @current-change="handleFormatChange"
         style="width:100%"
         max-height="300">
         <el-table-column
          prop="sub"
          label="下标"
          width="1">
          <template scope="scope">
             <span> </span>
           </template>       
         </el-table-column>
         <el-table-column
           prop="name"
           label="数据项名"
           width="130">
           <template scope="scope">
             <input v-model="scope.row.name" ondragenter="return false" @keyup="scope.row.name=
             scope.row.name.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>()~#$^.&{}|\']/g,'')"
              oncontextmenu="return false;" @change='watchToFormat'>
           </template>       
         </el-table-column>
         <el-table-column
           prop="mark"
           label="占位符"
           width="128">
           <template scope="scope">
               <input v-model="scope.row.mark" ondragenter="return false" @keyup="scope.row.mark=
             scope.row.mark.replace(/[^\a-\z\A-\Z0-9]/g,'')"
              oncontextmenu="return false;" @change='watchToFormat'>
           </template>   
         </el-table-column>
         <el-table-column
           prop="identifying"
           label="格式标识符"
           width="150">
           <template scope="scope">
               <input v-model="scope.row.identifying" ondragenter="return false"@keyup="scope.row.identifying=
             scope.row.identifying.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>()~#$^.&{}|\']/g,'')"
               oncontextmenu="return false;"  @change='watchToFormat'>
           </template>   
         </el-table-column>
         <el-table-column
           prop="originForm"
           label="原格式"
           width="290">
           <template scope="scope">
               <input v-model="scope.row.originForm" ondragenter="return false" @keyup="scope.row.originForm=
             scope.row.originForm.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>(),.:+/~#$^&|\'\\{} ]/g,'')"
               oncontextmenu="return false;"  @change='watchToFormat'>
           </template>   
         </el-table-column>
          <el-table-column
           prop="targetForm"
           label="目标格式"
           width="160">
           <template scope="scope">
               <input v-model="scope.row.targetForm"ondragenter="return false"@keyup="scope.row.targetForm=
             scope.row.targetForm.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>().:+/~#$^&|\'\\{} ]/g,'')"
               oncontextmenu="return false;" @change='watchToFormat'>
           </template>   
         </el-table-column>      
       </el-table>
       <div style="margin-top:40px" class="op">
             <el-button type="primary" @click="addFormatRow">添加</el-button>
             <el-button @click.native.prevent="removeFormatRow">删除</el-button>
       </div>
    </el-tab-pane>
    <el-tab-pane label="数据项整合配置" name="second">
        <div class="topTable">
          <p>时间项整合：</p>
          <el-table
           ref="conformTimeTable"
           :data="toConformTime"
           border
           highlight-current-row
           style="width:100%"
           max-height="150">
           <el-table-column
             prop="originTime"
             label="原数据项"
             width="429">
             <template scope="scope">
               <input v-model="scope.row.originTime" ondragenter="return false" @keyup="scope.row.originTime=
             scope.row.originTime.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>()~#$^.&{}|\']/g,'')"
              oncontextmenu="return false;" @change='watchToConformTime'>
             </template>   
           </el-table-column>
           <el-table-column
             prop="targetTime"
             label="目标数据项"
             width="429">
             <template scope="scope">
               <input v-model="scope.row.targetTime"ondragenter="return false" @keyup="scope.row.targetTime=
             scope.row.targetTime.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>()~#$^.&{}|\']/g,'')"
              oncontextmenu="return false;" @change='watchToConformTime'>
             </template>
           </el-table-column>
         </el-table>
        </div>
        <div class="bottomTable" style="margin-top:10px">
          <p>数据项整合（不包含时间项）：</p>
          <el-table
           ref="conformDataTable"
           :data="toConformData"
           border
          @current-change="handleConformChange"
           highlight-current-row
           style="width:100%"
           max-height="280">
           <el-table-column
            prop="sub"
            label="下标"
            width="1">
            <template scope="scope">
             <span> </span>
            </template>       
           </el-table-column>
           <el-table-column
             prop="originData"
             label="原数据项"
             width="429">
             <template scope="scope">
               <input v-model="scope.row.originData" @change='watchToConformData' 
               ondragenter="return false" @keyup="scope.row.originData=
             scope.row.originData.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>()~#$^;.&{}|\']/g,'')"
              oncontextmenu="return false;">
             </template>
           </el-table-column>
           <el-table-column
             prop="targetData"
             label="目标数据项"
             width="429">
             <template scope="scope">
               <input v-model="scope.row.targetData"ondragenter="return false" @keyup="scope.row.targetData=
             scope.row.targetData.replace(/[^\a-\z\A-\Z0-9\[\]\-\_<>()~#$^.&{}|\']/g,'')" 
             oncontextmenu="return false;" @change='watchToConformData'>
             </template>
           </el-table-column>    
         </el-table>
        </div>
        <div style="margin-top:40px" class="op">
          <el-button type="primary" @click='addConformRow'>添加</el-button>
          <el-button @click='removeConformRow'>删除</el-button>
        </div>
    </el-tab-pane>
    <el-tab-pane label="记录格式配置" name="third">
       <el-table
         ref="recordingTable"
         :data="recordings"
         border
         highlight-current-row
         style="width:100%;margin-bottom:60px;"
         max-height="250">
         <el-table-column
           prop="dataSeparator"
           label="原数据项分隔符"
           width="286">
            <template scope="scope">
               <input v-model="scope.row.dataSeparator" ondragenter="return false" @keyup="scope.row.dataSeparator=
             scope.row.dataSeparator.replace(/[^\-\_~*#$^|.&\\fnrtv ]/g,'')" 
             oncontextmenu="return false;" @change='watchRecordings'>
             </template>
         </el-table-column>
         <el-table-column
           prop="nameSeparator"
           label="原名称值分隔符"
           width="286">
           <template scope="scope">
               <input v-model="scope.row.nameSeparator"ondragenter="return false" @keyup="scope.row.nameSeparator=
             scope.row.nameSeparator.replace(/[^\-\_~*#$^|.&\\fnrtv ]/g,'')" 
             oncontextmenu="return false;" @change='watchRecordings'>
           </template>
         </el-table-column>
          <el-table-column
           prop="nullSeparator"
           label="原空值字符串"
           width="286">
           <template scope="scope">
               <input v-model="scope.row.nullSeparator"ondragenter="return false" @keyup="scope.row.nullSeparator=
             scope.row.nullSeparator.replace(/[^\-\_~*#$^|.&\\fnrtv ]/g,'')" 
             oncontextmenu="return false;" @change='watchRecordings'>
           </template>
         </el-table-column>
       </el-table>
    </el-tab-pane>
  </el-tabs>
   </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        isWell:true,
        toFormat:[{
          sub:0,
          name:'[QC]',
          mark:'ABCD',
          identifying:'[Method]',
          originForm:'Incident:A-B-C-D,Plan:C/B/ATD,Task:A/B/CTD,DEFAULT:A-B-CTD',
          targetForm:'A-B-CTD'
        }],
        formatRow:null,
        formatLen:1,
        formatIndex:-1,
        tag1:0,
        isMeet1:true,

        toConformTime:[{originTime:'[QC]',targetTime:'Time'}],
        isMeet2:true,

        toConformData:[{sub:0,originData:'[Method];[Status]',targetData:'EventName'},
                      {sub:1,originData:'[FKPlanID]',targetData:'FKPlanID'},
                      {sub:2,originData:'[PKIncidentID]',targetData:'PKIncidentID'},
                      {sub:3,originData:'[PKTaskID]',targetData:'PKTaskID'},
                      {sub:4,originData:'[PKPlanID]',targetData:'PKPlanID'},
                      {sub:5,originData:'[FKIncidentID]',targetData:'FKIncidentID'}],
        conformRow:null,
        conformLen:6,
        conformIndex:-1,
        tag2:0,
        isMeet3:true,

        recordings:[{dataSeparator:'\\t',nameSeparator:' ',nullSeparator:' '}],
        isMeet4:true
      }
    },
    watch:{
      toFormat:function(newtoFormat){
        this.watchToFormat();
      },
      toConformTime:function(newtoConformTime){
        this.watchToConformTime();
      },
      toConformData:function(newtoConformData){
        this.watchToConformData()
      },
      recordings:function(newRecordings){
        this.watchRecordings();
      }
    },
    methods: {
      setPara(){
         this.$emit('changePara',this.toFormat,this.toConformTime,this.toConformData,this.recordings,this.isWell);
      },
      handleFormatChange(newval){               //调整数据项格式配置表格的当前行
         if(this.tag1===0){
          this.formatIndex=parseInt(newval.sub);
           this.formatRow=newval;
          
         }else{
           this.tag1=0;
         }
          
      },
      handleConformChange(newval){
        if(this.tag2===0){
          this.conformIndex=parseInt(newval.sub);
          this.conformRow=newval;
          
        }else{
          this.tag2=0;
          console.log(newval);
        }          
      },
      hasNullColumn(dataArr){
        for(var item of dataArr){
          for(var prop in item){
            if(item.hasOwnProperty(prop)){
                 if(item[prop]===''){       
                    return false;
                 }
            }
          }
        }
        return true;
      },
      removeFormatRow(){                    //删除数据项格式配置表格的某一行
       if(this.formatRow){   
         this.toFormat.splice(this.formatIndex,1);
         if(this.formatIndex<this.formatLen-1){
           for(let i=this.formatIndex;i<this.formatLen-1;i++){
               (this.$refs.formatTable.data[i].sub)--; 
           }
         }
         this.formatLen--;
         this.formatRow=null;
         this.formatIndex=-1;
         this.tag1=1;
       }else{
         alert("请选择要删除的项");
       }
      },
      removeConformRow(){                    //删除数据项整合配置表格的某一行
       if(this.conformRow){   
         this.toConformData.splice(this.conformIndex,1);
         if(this.conformIndex<this.conformLen-1){
           for(let i=this.conformIndex;i<this.conformLen-1;i++){
               (this.$refs.conformDataTable.data[i].sub)--; 
           }
         }
         this.conformLen--;
         this.conformRow=null;
         this.conformIndex=-1;
         this.tag2=1;
       }else{
         alert("请选择要删除的项");
       }
      },
      addFormatRow(){
        this.$refs.formatTable.data.splice(this.formatLen,0,{
          sub:this.formatLen,
          name:'',
          mark:'',
          identifying:'',
          originForm:'',
          targetForm:''});
        this.formatLen++;
        
      },
      addConformRow(){
        this.$refs.conformDataTable.data.splice(this.conformLen,0,{
          sub:this.conformLen,
          originData:'',
          targetData:''});
        this.conformLen++;
      },
      watchToFormat(){
        this.isMeet1=this.hasNullColumn(this.toFormat);
        this.merge();
        this.setPara();
      },
      watchToConformTime(){
        this.isMeet2=this.hasNullColumn(this.toConformTime);
        this.merge();
        this.setPara();
      },
      watchToConformData(){
        this.isMeet3=this.hasNullColumn(this.toConformData);
        this.merge();
        this.setPara();
      },
      watchRecordings(){
        this.isMeet4=this.hasNullColumn(this.recordings);
        this.merge();
        this.setPara();
      },
      merge(){
        this.isWell=(this.isMeet1)&&(this.isMeet2)&&(this.isMeet3)&&(this.isMeet4);
      }
    }
  };
</script>
<style scoped>
 .popBox .el-button{
   cursor: pointer;
 }
 .popBox input{
   ime-mode:disabled;
   position: relative;
   left: -10px;
   background: none;
   border:none;
   height: 30px;
   outline:none;
   width: 400px;
   max-width: 500px;
 }
</style>