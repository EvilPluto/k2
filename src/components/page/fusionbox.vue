
<template>
  <div class="fusionbox">
       <el-popover
       ref="popover1"
       placement="bottom"
       width="752"
       triger="click"       
       v-model="pop1Visible">
         <el-table 
          :data="list1"
          highlight-current-row
          @current-change="selectLog1">
            <el-table-column width="400" property="name" label="事件日志"></el-table-column>
            <el-table-column width="150" property="creator" label="创建者"></el-table-column>
            <el-table-column width="250" property="createTime" label="创建时间"></el-table-column>
         </el-table>
        <div class="pageBox">
            <el-pagination
              @current-change="handleCurrentChange1"
              :current-page.sync="currentPageNum1"
              :page-size="pageSize1"
              small
              layout="total, prev, pager, next"
              :total="logsTotal1">
            </el-pagination>
        </div>
       </el-popover>
       <el-popover
       ref="popover2"
       placement="bottom"
       width="752"
       triger="click"
       v-model="pop2Visible">
         <el-table 
          :data="list2"
          max-height="250"
          highlight-current-row
          @current-change="selectLog2">
            <el-table-column width="400" property="name" label="事件日志"></el-table-column>
            <el-table-column width="150" property="creator" label="创建者"></el-table-column>
            <el-table-column width="250" property="createTime" label="创建时间"></el-table-column>
         </el-table>
        <div class="pageBox">
            <el-pagination
              @current-change="handleCurrentChange2"
              :current-page.sync="currentPageNum2"
              :page-size="pageSize2"
              small
              layout="total, prev, pager, next"
              :total="logsTotal2">
            </el-pagination>
        </div>
       </el-popover>
       <div class="top">
           <div class="SelectLog left">
              <input class="padi" id="fileName1" readonly="readonly" placeholder="导入日志文件-1"/>
	            <a class="addFile"  v-popover:popover1 @click="getTableData1"><img src="../../assets/addFile.png" alt="按钮"></a>
			     </div>
           <div class="SelectLog right">
              <input class="padi" id="fileName2" readonly="readonly"placeholder="导入日志文件-2"/>
	            <a class="addFile" v-popover:popover2 @click="getTableData2"><img src="../../assets/addFile.png" alt="按钮"></a>
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
              style="width:100%"
              max-height="400">
              <el-table-column
                prop="name"
                label="参数名"
                align="center"
                width="304">   
              </el-table-column>
              <el-table-column
                label="设置值"
                align="center"
                width="304">
                <template scope="scope">
                  <div class="scopeStyle" v-if="scope.row.type === 1">
                    <el-input 
                      type="number"
                      v-model="defaultValues[scope.$index]"
                      placeholder="整型"
                      @change="sentToFather">
                    </el-input>
                  </div>
                  <div class="scopeStyle" v-if="scope.row.type === 2">
                    <el-input 
                      type="number"
                      v-model="defaultValues[scope.$index]"
                      placeholder="浮点型"
                      @change="sentToFather">
                    </el-input>
                  </div>
                  <div class="scopeStyle" v-if="scope.row.type === 3">
                    <el-select 
                      v-model="defaultValues[scope.$index]" 
                      placeholder="请选择" 
                      @change="sentToFather">
                      <el-option
                        v-for="item in scope.row.dataArr"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="scopeStyle" v-if="scope.row.type === 4">
                    <el-select 
                      v-model="defaultValues[scope.$index]" 
                      placeholder="请选择" 
                      @change="sentToFather">
                      <el-option
                        v-for="item in scope.row.dataArr"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="scopeStyle" v-if="scope.row.type === 5">
                    <el-select 
                      v-model="defaultValues[scope.$index]" 
                      placeholder="请选择" 
                      @change="sentToFather">
                      <el-option
                        v-for="item in scope.row.dataArr"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
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
        // hostUrl: 'http://110.64.72.33:8888/processmining',
        hostUrl: '/processmining',
        pageSize1: 5,
        currentPageNum1: 1,
        logsTotal1: 20,
        list1:[],
        evtLog1: '',

        pageSize2: 5,
        currentPageNum2: 1,
        logsTotal2: 20,
        list2:[],
        evtLog2: '',

        fusion:[],
        defaultValues: [],
        pop1Visible: false,
        pop2Visible: false,
      }
    },
    props:['paraList'],
    created() {
      this.sentToFather(); 
      console.log('created');
    },
    methods: {
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
                  window.location.replace("../processmining/index.html");
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
     sentToFather() {
       this.$emit('changeValue',this.evtLog1,this.evtLog2,this.defaultValues);
     },
     parseType(type) {
      switch(type) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        default:
          break;
      }
     },
     handleCurrentChange1() {
      var self = this;
      console.log("current-Page:", self.currentPageNum1);
      self.getTableData1();
     },
     getTableData1(){
        var self = this;
        var addUrl = "?pageNum=" + self.currentPageNum1 + "&pageSize=" + self.pageSize1;
        self.$axios({
            url: '/eventLog/listAll' + addUrl,
            method: 'get',
            baseURL: this.hostUrl
        })
        .then((response) => {
            var json = response.data;
              if (json.code === 200) {
              self.logsTotal1 = json.data.total;
              self.list1 = json.data.list;
              this.$message({
                  message: '数据加载成功!',
                  type: 'success'                        
              })
            } else {
              self.codeParsing(json.code);
            }
        })
        .catch((error) => {
            this.$message({
                message: '数据加载失败: ' + '请重试!',
                type: 'error'
            });
            console.log("【Error】:", error);
        });
     },
     handleCurrentChange2() {
      var self = this;
      console.log("current-Page:", self.currentPageNum2);
      self.getTableData2();
     },
     getTableData2(){
        var self = this;
        var addUrl = "?pageNum=" + self.currentPageNum2 + "&pageSize=" + self.pageSize2;
        self.$axios({
            url: '/eventLog/listAll' + addUrl,
            method: 'get',
            baseURL: this.hostUrl
        })
        .then((response) => {
            var json = response.data;
              if (json.code === 200) {
              self.logsTotal2 = json.data.total;
              self.list2 = json.data.list;
              self.$message({
                  message: '数据加载成功!',
                  type: 'success'                        
              })
            } else {
              self.codeParsing(json.code);
            }
        })
        .catch((error) => {
            self.$message({
                message: '数据加载失败: ' + '请重试!',
                type: 'error'
            });
            console.log("【Error】:", error);
        });
     },
     changeInputValue(index, row) {
      console.log(index, row);
     },
     selectLog1(val) {
      if (val) {
        if (val.name.length > 20)
          val.name = val.name.slice(0, 20) + '...';

        $("#fileName1").attr("value", val.name);
        this.evtLog1 = val.id;
        this.pop1Visible = false;
        this.sentToFather();
      }
     },
     selectLog2(val) {
      if (val) {
        if (val.name.length > 20)
          val.name = val.name.slice(0, 20) + '...';
        $("#fileName2").attr("value", val.name);
        this.evtLog2 = val.id;
        this.pop2Visible = false;
        this.sentToFather();
      }
     },
     Init(){
       var self = this;
       for (var i=0; i<this.paraList.length; i++) {
        var tmp = this.paraList[i];
        var obj = {};
        var defaultV;
        obj.name = tmp.displayName;
        obj.type = tmp.type;
        var arr = new Array();
        switch(tmp.type) {
          case 1:
          case 2:
            arr.push(tmp.defaultValue);
            break;
          case 3:
          case 4:
          case 5:
            arr = tmp.defaultValue.split(";");
            break;
          default:
            break;
        }
        defaultV = arr[0];
        obj.dataArr = arr;
        self.fusion.push(obj);
        self.defaultValues.push(defaultV);
       }
    }
    },

    mounted(){
      var self = this;
      self.Init();
    }
  }
</script>
<style scoped>
.scopeStyle {
  margin: auto;
  width: 80px;
}
.pageBox {
  padding-top: 10px;
}
.inputTag {
  width: 100px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  color: white;
  font-size: 11px;
  min-width: 20px;
}
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
  border-radius: 4px;
  text-align: center;
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