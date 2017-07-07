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
         style="width:100%;"
         max-height="350">
         <el-table-column 
            type="index" 
            width="80"
            align="center">
         </el-table-column>
         <el-table-column
           prop="fusionType"
           label="融合方法"
           width="400"
           align="center">
         </el-table-column>
          <el-table-column
           prop="fusionDescription"
           label="方法说明"
           width="170"
           align="center">
           <template scope="scope">
             <el-popover trigger="click" placement="top" width='260'>
                <h4>{{ scope.row.fusionType }}</h4>
                <p style="margin-top:14px">{{scope.row.fusionDescription}}</p>
                <div slot="reference" class="name-wrapper">
                  <el-button type='text'>查看说明</el-button>
                </div>
             </el-popover>
           </template>
         </el-table-column>
         <el-table-column
           label="操作"
           align="center">
           <template scope="scope">
               <el-button @click='popUp(scope.$index, scope.row)'>应用</el-button>
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
            hostUrl: 'http://110.64.72.33:8888/processmining',
            boxShow:true,
            submitJsonData: {
              evtLog1Id: '',
              evtLog2Id: '',
              algoId: '',
              param: {}
            },
            fusionData:[{
               fusionType:'人工免疫日志融合算法',
               fusionDescription:'人工免疫日志融合方法是一种基于人工免疫算法'
               +'的日志融合方法，是在实例级别进行日志融合。您可以点击“应用”按'
               +'钮进行参数配置，然后进行融合计算。',
               paraList:[
               {
                name: 'cszqgm',
                type: 1,
                defaultValue: 60,
                displayName: '初始种群规模'
               },
               {
                name: 'zqzdjhds',
                type: 2,
                defaultValue: 1.2,
                displayName: '种群最大进化代数'
               }
               ]
            },{
               fusionType:'混合人工免疫日志融合算法',
               fusionDescription:'混合人工免疫日志融合方法是一种基于人工免疫算法'
               +'的日志融合方法，是在实例级别进行日志融合。您可以点击“应用”按'
               +'钮进行参数配置，然后进行融合计算。',
               paraList:[
               {
                name: 'das',
                type: 3,
                defaultValue: '1;2;3',
                displayName: '初始种群规模'
               },
               {
                name: 'asd',
                type: 4,
                defaultValue: '3.0;4.0;5.0',
                displayName: '种群最大进化代数'
               },
               {
                name: 'sb',
                type: 5,
                defaultValue: true,
                displayName: 'SB了吧'
               }
               ]
            }],

          }
      },
      created() {
        // 屏蔽esc        
        $(document).ready(function() {
        }).keydown(function(e) {
          if (e.which === 27) {
            console.log('ESC');
            e.keyCode = 0;
            // e.cancelBubble = true;
            e.returnValue = false;
            return false;
          }
        });

        // 加载初始算法列表
        this.loadFusionList();
      },
      methods:{
        loadFusionList() {
          this.$axios({
              url: '/manager/listMergeAlgo',
              // url: '/api/practice',
              method: 'get',
              baseURL: this.hostUrl
          })
          .then((response) => {
              var data = new Array();
              // 不知道为什么for in 不行
              for (var i=0; i<response.data.length; i++) {
                var algo = response.data[i];
                var algoJson = {
                  id: algo.id,
                  fusionType: algo.name,
                  fusionDescription: algo.info,
                  paraList: []
                };
                data.push(algoJson);
              }
              this.fusionData = data;
              this.$message({
                  message: '数据加载成功!',
                  type: 'success'                        
              })
          })
          .catch((error) => {
              this.$message({
                  message: '数据加载失败: ' + '请重试!',
                  type: 'error'
              });
              console.log("【Error】:", error);
          });
        },
        clearBox(){                                             //依据key清除子组件缓存
          this.boxShow=!this.boxShow;
        },
        mergeSubmit() {
          console.log("merge");
          this.$axios({
            url: 'merge',
            method: 'post',
            baseURL: this.hostUrl,

            data: this.submitJsonData
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log("【Error】:", error);
          });
        },
        popUp(index, row){
          var self = this;
          var paraListDesc;
          console.log(row.id);
          console.log(index);
          self.submitJsonData.algoId = row.id;
          $.ajax({
              url: self.hostUrl + '/manager/algoConfig/' + row.id,
              // url: '/api/practice1',
              type: 'GET',
              async: false,
              success: function(data) {
                if (data.code === 200) {
                  self.fusionData[index].paraList = data.config.params;
                  paraListDesc = data.config.params;
                }
                console.log(self.fusionData);
              },
              error: function(error) {
                  console.log(error);
              }
          }); 

          this.clearBox();

          const h = this.$createElement;
          this.$msgbox({
            title: this.fusionData[index].fusionType,
            message: h(
              'fusionBox',
              {
                props: {paraList:self.fusionData[index].paraList},
                key:self.boxShow,
                on: {changeValue: function(evtLog1, evtLog2, params) {
                  console.log(evtLog1, evtLog2, params);
                  self.submitJsonData.evtLog1Id = evtLog1;
                  self.submitJsonData.evtLog2Id = evtLog2;
                  var paramObj = {};
                  console.log(self.fusionData);
                  for (var i=0; i<paraListDesc.length; i++) {
                    paramObj[paraListDesc[i].name] = params[i];
                  }
                  self.submitJsonData.param = paramObj;
                  // console.log(self.submitJsonData);
                }}
              }),
            showCancelButton: true,
            confirmButtonText: '确定',
            customClass:'fusionPop',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                self.mergeSubmit();
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
  .main {
    width: 800px;
  }
  .fusionPop{
    width: 650px;
  }
</style>