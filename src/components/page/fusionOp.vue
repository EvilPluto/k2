<template>
  <div class="mix">
   <el-dialog 
    class="resultDialog"
    title="日志融合结果" 
    :visible.sync="mergeResultVisible">

   </el-dialog>
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
            hostUrl: '/processmining',
            boxShow:true,
            mergeResultVisible: false,
            submitJsonData: {
              evtLog1Id: '',
              evtLog2Id: '',
              algoId: '',
              param: {}
            },
            fusionData:[],
            paraListDesc: []
          }
      },
      created() {
        // 加载初始算法列表
        this.loadFusionList();
      },
      methods:{
        practice() {
          this.mergeResultVisible = true;
        },
        showMsg(msg) {
          if (msg.data.code === 200) {
              const h = this.$createElement;

              this.$notify({
                  title: '融合结果',
                  message: h
                      ('pre',
                      { style: 'color: teal' },
                      '\n融合用时: ' + msg.data.payload.time
                      // '\n昵称: ' + this.register.nickname +
                      // '\n密码: ' + this.register.repassword
                      )
              });
          }
        },
        validSubmitJson(params) {
          var self = this;
          var regInt = new RegExp("^[0-9]*$");
          var regIntDot = new RegExp("\\d+(\\.\\d+)?$");
          if (!(self.submitJsonData.evtLog1Id && self.submitJsonData.evtLog2Id)) {
              self.$message({
                  message: '请选择需要融合的日志文件！',
                  type: 'error'                        
              });
              return false;
          }
          for (var i=0; i<self.paraListDesc.length; i++) {
            if (self.paraListDesc[i].type === 1) {
              // 检查整型
              if (!regInt.test(params[i])) {
                self.$message({
                    message: '请输入正确参数格式！(整数)',
                    type: 'error'                        
                });  
                return false;              
              }
            } else if (self.paraListDesc[i].type === 2) {
              if (!regIntDot.test(params[i])) {
                self.$message({
                    message: '请输入正确参数格式！(浮点数)',
                    type: 'error'                        
                });  
                return false;              
              }
            }
          }
          return true;
        },
        loadFusionList() {
          this.$axios({
              url: '/manager/listMergeAlgo',
              // url: '/api/practice',
              method: 'get',
              baseURL: this.hostUrl
          })
          .then((response) => {
              var data = new Array();
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
                  self.paraListDesc = data.config.params;
                }
                console.log(self.fusionData);
              },
              error: function(error) {
                  console.log(error);
              }
          }); 

          this.clearBox();
          var parTmp;
          const h = this.$createElement;
          this.$msgbox({
            title: this.fusionData[index].fusionType,
            message: h(
              'fusionBox',
              {
                props: {paraList:self.fusionData[index].paraList},
                key:self.boxShow,
                on: {changeValue: function(evtLog1, evtLog2, params) {
                  self.submitJsonData.evtLog1Id = evtLog1;
                  self.submitJsonData.evtLog2Id = evtLog2;
                  parTmp = params;
                  var paramObj = {};

                  $('.confirmSubmit').removeClass('is-disabled'); // 重置
                  for (var i=0; i<self.paraListDesc.length; i++) {
                    if (!params[i]) {
                      $('.confirmSubmit').addClass('is-disabled'); 
                    }
                    paramObj[self.paraListDesc[i].name] = params[i];
                  }
                  self.submitJsonData.param = paramObj;
                }}
              }),
            showCancelButton: true,
            confirmButtonClass: 'confirmSubmit',
            confirmButtonText: '确定',
            customClass:'fusionPop',
            cancelButtonText: '取消',
            closeOnPressEscape: false,
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                if (self.validSubmitJson(parTmp)) {
                    // log没选择
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    console.log("merge");
                    this.$axios({
                      url: 'merge',
                      method: 'post',
                      baseURL: this.hostUrl,

                      data: this.submitJsonData
                    })
                    .then((response) => {
                      console.log(response.data);
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText = '确定';
                      this.$message({
                          message: '日志融合成功！',
                          type: 'success'
                      });
                      done();
                      self.showMsg(response);
                    })
                    .catch((error) => {
                      console.log("【Error】:", error);
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText = '确定';
                      this.$message({
                          message: '日志融合失败！：请重试',
                          type: 'error'
                      });
                    });
                }
              } else {
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = '确定';
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'info',
              message: action
            });
         });
        }
      },
     
  }
</script>

<style>
  .disableBtn {

  }
  .main {
    width: 800px;
  }
  .fusionPop{
    width: 650px;
  }
</style>