<template>
  <div class="fusionbox">
       <el-popover
       ref="popover1"
       placement="bottom"
       width="752"
       triger="click">
         <el-table :data="list1">
            <el-table-column width="250" property="name" label="事件日志"></el-table-column>
            <el-table-column width="250" property="creator" label="创建者"></el-table-column>
            <el-table-column width="250" property="createTime" label="创建时间"></el-table-column>
         </el-table>
        <div class="pageBar">
            <el-pagination
            @current-change ="handlePageChange1"
            :current-page.sync='curPage1'
            :page-size='pageSize1'
            layout="prev, pager, next"
            :total="pageTotal1">
            </el-pagination>
        </div>
       </el-popover>
       <el-popover
       ref="popover2"
       placement="bottom"
       width="752"
       triger="click">
         <el-table :data="list2">
            <el-table-column width="250" property="name" label="事件日志"></el-table-column>
            <el-table-column width="250" property="creator" label="创建者"></el-table-column>
            <el-table-column width="250" property="createTime" label="创建时间"></el-table-column>
         </el-table>
         <div class="pageBar">
            <el-pagination
            @current-change ="handlePageChange2"
            :current-page.sync='curPage2'
            :page-size='pageSize2'
            layout="prev, pager, next"
            :total="pageTotal2">
            </el-pagination>
         </div>
       </el-popover>
       <div class="top">
           <div class="SelectLog left">
              <input class="padi" id="fileName1" readonly="readonly" placeholder="导入日志文件-1"/>
	            <a class="addFile"  v-popover:popover1><img src="../../assets/addFile.png" alt="按钮"></a>
			     </div>
           <div class="SelectLog right">
              <input class="padi" id="fileName2" readonly="readonly"placeholder="导入日志文件-2"/>
	            <a class="addFile" v-popover:popover2><img src="../../assets/addFile.png" alt="按钮"></a>
			     </div>
       </div>
       <div class="modifyPara">
           <div style="background:#EEF1F6;width:100%;height:40px;margin-bottom:10px;text-align:center">
              <p style="line-height:40px;">算法参数设置</p>
           </div>
           <el-table
              ref="fusionTable"
              :data="fusion"
              border
              highlight-current-row 
              @current-change="handleChange"
              style="width:100%"
              max-height="400">
              <el-table-column
                prop="sub"
                label="下标"
                align="center"
                width="1">
                <template scope="scope">
                 <span> </span>
                </template>       
              </el-table-column>
              <el-table-column
                prop="name"
                label="参数名"
                align="center"
                width="304">
                <template scope="scope">
                 <span>{{scope.row.name}}</span>
                </template>       
              </el-table-column>
              <el-table-column
                prop="val"
                label="设置值"
                align="center"
                width="304">
                <template scope="scope">
                 <input v-model="scope.row.val">
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
        fusion:[],

        list1:[{name:'log.txt',creator:'Ella',createTime:'2017-06-29'},
        {name:'log.txt',creator:'Ella',createTime:'2017-06-29'},
        {name:'log.txt',creator:'Ella',createTime:'2017-06-29'}],
        curPage1:1,
        pageSize1:10,
        pageTotal1:0,
        
          
        list2:[{name:'log.txt',creator:'Ella',createTime:'2017-06-29'},
        {name:'log.txt',creator:'Ella',createTime:'2017-06-29'},
        {name:'log.txt',creator:'Ella',createTime:'2017-06-29'}],
        curPage2:1,
        pageSize2:10,
        pageTotal2:0,

        ajaxdata1:[

        ]
      }
    },
    props:['paraList'],
    methods: {
     handleChange(){

     },
     handlePageChange1(){

     },
     handlePageChange2(){

     },
     Init(){
       let sub=0;
       for(var item of this.paraList ){
         for(var prop in item){
             let obj={};
             obj.sub=sub;
             obj.name=prop;
             obj.val=item[prop];
             this.fusion.push(obj);
             sub++;
         }
       }
    }
    },
    mounted(){
      var vm=this;
      vm.Init();
    },
  }
</script>
<style scoped>
.top{
   height: 36px;
   width: 100%;
   margin-bottom: 10px;
}
.SelectLog{
  display: inline-block;
  height: 36px;
}
.padi{
  display: inline-block;
  width: 278px;
  height: 36px;
  border:solid #e4e4e4 1px;
}
.modifyPara input{
   background: none;
   border:none;
   height: 30px;
   outline:none;
}
.right{
  position: relative;
  left: 46px;
}
.SelectLog a{
  position: relative;
  cursor: pointer;
  display: block;
  width: 33px;
  height: 30px;
  left: 244px;
  top:-36px;
}
.SelectLog img{
  width: 33px;
  height: 33px;
  border: none;
}
</style>