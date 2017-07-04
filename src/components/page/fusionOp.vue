<template>
  <div class="mix">
   <div class="head" style="margin-bottom:30px;">
       <el-breadcrumb separator="/">
        <el-breadcrumb-item> 日志融合</el-breadcrumb-item>
        <el-breadcrumb-item>融合操作</el-breadcrumb-item>
       </el-breadcrumb>
   </div>
   <div class="main">
       <el-table
         ref="fusionTypeTable"
         :data="fusionData"
         border
         highlight-current-row
         style="width:86%;margin-bottom:60px;"
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
           prop="fusionType"
           label="融合方法"
           width="344"
           align='center'>
           <template scope="scope">
               <span>{{scope.row.fusionType}}</span>
           </template>
         </el-table-column>
          <el-table-column
           prop="fusionDescription"
           label="方法说明"
           width="280"
           align='center'>
           <template scope="scope">
             <el-popover trigger="click" placement="top"width='260'>
                <h4>{{ scope.row.fusionType }}</h4>
                <p style="margin-top:14px">{{scope.row.fusionDescription}}</p>
                <div slot="reference" class="name-wrapper">
                  <el-button type='text'>查看说明</el-button>
                </div>
             </el-popover>
           </template>
         </el-table-column>
         <el-table-column
           prop="apply"
           label="操作"
           width="200"
           align='center'>
           <template scope="scope">
               <el-button @click='popUp(scope.row.sub)'>应用</el-button>
           </template>
         </el-table-column>
       </el-table>
   </div>
  </div>
</template>
 
<script>
import fusionBox from './fusionbox.vue'
  export default {
     components:{fusionBox},
      data(){
          return {
            boxShow:true,
            fusionData:[{
               sub:0,
               fusionType:'人工免疫日志融合算法',
               fusionDescription:'人工免疫日志融合方法是一种基于人工免疫算法'
               +'的日志融合方法，是在实例级别进行日志融合。您可以点击“应用”按'
               +'钮进行参数配置，然后进行融合计算。',
               apply:false,
               paraList:[{'初始种群规模':60},{'种群最大进化代数':10000}]
            },{
               sub:1,
               fusionType:'混合人工免疫日志融合算法',
               fusionDescription:'混合人工免疫日志融合方法是一种基于人工免疫算法'
               +'的日志融合方法，是在实例级别进行日志融合。您可以点击“应用”按'
               +'钮进行参数配置，然后进行融合计算。',
               apply:false,
               paraList:[{'初始种群规模':60},
               {'种群最大进化代数':10000},{'退火接受最大连续退化次数':50},{'退火记忆库个体数':6},{'每代克隆选择比率':0.6}]
            }],

          }
      },
      methods:{
        clearBox(){                                             //依据key清除子组件缓存
          this.boxShow=!this.boxShow;
        },
        popUp(index){
          this.clearBox();
          const h = this.$createElement;
          var self=this;
          this.$msgbox({
            title: this.fusionData[index].fusionType,
            message: h('fusionBox',{props:{paraList:self.fusionData[index].paraList},key:self.boxShow}),
            showCancelButton: true,
            confirmButtonText: '确定',
            customClass:'fusionPop',
            cancelButtonText: '取消',
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
          }).then(action => {
            this.$message({
              type: 'info',
              message: 'action: ' + action
            });
         });
        }
      },
     
  }
</script>

<style>
  .fusionPop{
    width: 650px;
  }
</style>