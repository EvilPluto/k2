<template>
  <div class="mix">
   <el-dialog 
    class="resultDialog"
    title="日志融合结果" 
    :visible.sync="mergeResultVisible">
    <el-card>
      <table border="10" width="100%" class="resultDialog">
      <tr>
        <th class="headerResult">名称</th>
        <th class="headerResult">项值</th>
      </tr>
      <tr>
        <th>总耗时</th>
        <td>{{ result.time }}</td>
      </tr>      
      <tr>
        <th>总实例数</th>
        <td>{{ result.totalinstancenum }}</td>
      </tr>
      <tr>
        <th>总事件数</th> 
        <td>{{ result.totaleventnum }}</td>
      </tr>
      <tr>
        <th>平均每实例中事件数</th> 
        <td>{{ result.average }}</td>
      </tr>
      <tr>
        <th>流程活动事件</th> 
        <td>{{ result.processactivityevent }}</td>
      </tr>
      <tr>
        <th>流程活动操作人</th> 
        <td>{{ result.controller }}</td>
      </tr>
      </table>
    </el-card>
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
            // hostUrl: 'http://110.64.72.33:8888/processmining',
            boxShow:true,
            mergeResultVisible: false,
            submitJsonData: {
              evtLog1Id: '',
              evtLog2Id: '',
              algoId: '',
              param: {}
            },
            fusionData:[],
            paraListDesc: [],
            result: {
              time: "",
              totalinstancenum: "",
              totaleventnum: "",
              average: "",
              processactivityevent: "",
              controller: ""
            },
          }
      },
      created() {
        // 加载初始算法列表
        this.loadFusionList();
        // this.practice();
      },
      methods:{
        // practice() {
        //   this.mergeResultVisible = true;
        // },
        showMsg(json) {
          var resultTmp = {};
          resultTmp.time = json.time + "(ms)";
          resultTmp.totalinstancenum = json.resultLog.totalinstancenum;
          resultTmp.totaleventnum = json.resultLog.totaleventnum;
          resultTmp.average = json.resultLog.average;
          resultTmp.processactivityevent = json.resultLog.processactivityevent;
          resultTmp.controller = json.resultLog.controller;
          this.result = resultTmp;
          this.mergeResultVisible = true;          
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
                      self.showMsg(response.data.payload);
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
  .resultDialog {
    text-align: center;
    font-family: "微软雅黑";
  }
  .resultDialog th {
    width: 200px;
    color: #bfcbd9;
    font-weight: bold;
  }
  .resultDialog td {
    padding: 5px;
    word-break: break-all;
    word-wrap: break-word;
    table-layout: fixed;
  }
  .resultDialog .headerResult {
    color: black;
    font-weight: bolder;
  }
  .disableBtn {

  }
  .main {
    width: 800px;
  }
  .fusionPop{
    width: 650px;
  }
</style>