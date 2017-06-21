<template>
    <div class="login-wrap">
        <div class="ms-title">流程挖掘平台</div>
        <div class="ms-login">
            <el-tabs v-model="activePane">
                <el-tab-pane label="登录" name="login">
                    <el-form :model="login" :rules="loginRules" ref="login" label-width="0px" >
                        <el-form-item prop="username">
                            <el-input v-model="login.username" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="密码" v-model="login.password"></el-input>
                        </el-form-item>
                        <el-form :model="login" :rules="loginRules" ref="login" label-width="0px">
                            <el-form-item prop="verCode">
                                <el-popover
                                    ref="a"
                                    placement="right-end"
                                    trigger="hover">
                                        <img :src="imgUrl" alt="验证码图片" width="200px" @click="getVerCode">
                                </el-popover>
                                <el-input 
                                    v-popover:a
                                    placeholder="验证码" 
                                    v-model="login.verCode" 
                                    @keyup.enter.native="loginForm('login')">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="login-btn">
                            <el-button type="primary" @click="loginForm('login')">登录</el-button>
                        </div>
                        <div>
                            <br>
                            <p id="toRegister">Tips : 没有账号？<span @click="goToRegister" id="register">请注册 </span></p>
                        </div>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="注册" name="register">
                    <el-form :model="register" :rules="registerRules" ref="register" label-width="0px">
                        <el-form-item prop="username">
                            <el-input v-model="register.username" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item prop="nickname">
                            <el-input placeholder="昵称" v-model="register.nickname"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" placeholder="请输入6-20位密码" v-model="register.password"></el-input>
                        </el-form-item>
                        <el-form-item prop="repassword">
                            <el-input type="password" placeholder="确认密码" v-model="register.repassword"></el-input>
                        </el-form-item>
                        <el-form :model="register" :rules="registerRules" ref="register" label-width="0px">
                            <el-form-item prop="verCode">
                                <el-popover
                                    ref="b"
                                    placement="right-end"
                                    trigger="hover">
                                        <img :src="imgUrl" alt="验证码图片" width="200px" @click="getVerCode">
                                </el-popover>
                                <el-input 
                                    v-popover:b
                                    placeholder="验证码" 
                                    v-model="register.verCode" 
                                    @keyup.enter.native="registerForm('register')">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="login-btn">
                            <el-button type="primary" @click="registerForm('register')">注册</el-button>
                        </div>
                        <div>
                            <br>
                            <p id="toLogin">Tips : 已有账号？<span @click="goToLogin" id="login">去登录 </span></p>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>    
        </div>
        <div class="footer">
            <p>&copy 2017 K2流程挖掘平台 &nbsp &nbsp &nbsp 如有问题，请联系管理员<span id="help">10086@qq.com</span></p>
        </div>
    </div>
</template>`

<script>
    export default {
        data: function(){
            var checkPwd = (rule, value, callback) => {
                // console.log(value, this.register.password);
                if (value === '') {
                    // console.log(value, this.register.password);
                    callback(new Error('请再次输入密码!'));
                } else if (value !== this.register.password) {
                    // console.log(value, this.register.password);
                    callback(new Error('两次密码不相同!'));
                } else {
                    // console.log(value, this.register.password);
                    callback();
                }
            };

            var checkWord = (rule, value, callback) => {
                var reg = /^[a-zA-Z0-9]+$/;
                if (value.match(reg)) {
                    callback();
                } else {
                    callback(new Error('密码仅可由数字与字母组成'));
                }
            };

            var checkName = (rule, value, callback) => {
                // console.log(value.gblen());
                var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\\\]");
                if (value.indexOf(" ") >= 0) {
                    callback(new Error('请不要包含空格'));
                } else if (value.match(reg)) {
                    callback(new Error('请不要输入特殊字符'));
                } else if (value.gblen() <= 4 || value.gblen >= 16) {
                    callback(new Error('请输入4-16位字符'));
                } else {
                    callback();
                }
            };

            return {
                activePane: 'login',
                hostUrl: 'http://localhost:8888/processmining', // IP
                imgUrl: 'http://localhost:8888/processmining/checkcode',
                // hostUrl: '',
                login: {
                    username: '',
                    password: '',
                    verCode: ''
                },
                loginRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    verCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                register: {
                    username: '',
                    nickname: '',
                    password: '',
                    repassword: '',
                    verCode: ''
                },
                registerRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { type: "email", message: '请输入正确的Email格式', trigger: 'change' },
                        { type: "email", message: '请输入正确的Email格式', trigger: 'blur' }
                    ],
                    nickname: [
                        { required: true, message: '请输入昵称', trigger: 'blur' },
                        { validator: checkName, trigger: 'change' },
                        { validator: checkName, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: checkWord, trigger: 'change' },
                        { validator: checkWord, trigger: 'blur' },
                        { min: 6, max: 16, message: '长度在6-16之间', trigger: 'change' },
                        { min: 6, max: 16, message: '长度在6-16之间', trigger: 'blur' }
                    ],
                    repassword: [
                        // { required: true, message: '请确认密码', trigger: 'blur' },
                        { validator: checkPwd, trigger: 'change' },
                        { validator: checkPwd, trigger: 'blur' }
                    ],
                    verCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getVerCode();
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
                    case 201:
                        msg('输入域错误', '验证码错误');
                    case 300:
                        msg('输入域错误', '邮箱或密码错误');
                    case 301:
                        msg('权限问题', '用户已禁用，请联系管理员');
                    case 302:
                        msg('权限问题', '用户未激活，请去邮箱激活用户');
                    case 303:
                        msg('注册问题', '邮箱已占用，请更改邮箱');
                    case 304:
                        msg('注册问题', '昵称已占用，请更改昵称');
                    case 400:
                        msg('权限问题', '用户未登录，请重新登录');
                    case 401:
                        msg('权限问题', '用户无权访问，请联系管理员');
                    case 500:
                        msg('系统错误', '未知错误，请上报管理员');
                }
            },
            changeUrl() {
                var url = this.imgUrl;

                var timeStamp = (new Date()).valueOf();
                url = url.substring(0, 45);
                if ((url.indexOf('&') >= 0)) {
                    url = url + 'xtamp=' + timeStamp;
                } else {
                    url = url + '?timestamp=' + timeStamp;
                }

                return url;
            },

            loginForm(formName) {
                const self = this;

                self.$refs[formName].validate((valid) => {
                    if (valid) {
                       this.$axios({
                            url: '/user/login',
                            method: 'post',
                            baseURL: this.hostUrl,

                            data: {
                                email: this.login.username,
                                password: this.login.password,
                                checkcode: this.login.verCode
                            }
                        })
                        .then((response) => {
                            if (response.data.code === 200) {
                                if (response.data.type === 0) {
                                    localStorage.setItem('ms_username', response.data.nickname);
                                    self.$router.push('/user/');
                                } else {
                                    localStorage.setItem('ms_username', response.data.nickname);
                                    self.$router.push('/admin/');
                                }
                            } else {
                                // console.log(response);
                                console.log('code', response.data.code);
                                codeParsing(response.data.code);
                            }
                        })
                        .catch((error) => {
                            console.log("【Error】:", error);
                            this.$message({
                                title: '网络请求错误',
                                message: '请检查网络并重试',
                                type: 'error'
                            });
                        });
                    } else {
                        console.log('error login!!');
                        this.$message({
                            title: '格式错误',
                            message: '请检查输入域是否正确',
                            type: 'error'
                        });
                        return false;
                    }
                });
            },

            registerForm(formName) {   
                const self = this;

                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 弹出注册详情
                        const h = this.$createElement;

                        this.$notify({
                            title: '注册信息',
                            message: h
                                ('pre',
                                { style: 'color: teal' },
                                '\n邮箱: ' + this.register.username +
                                '\n昵称: ' + this.register.nickname +
                                '\n密码: ' + this.register.repassword
                                )
                        });

                        // 网络请求
                        this.$axios({
                            url: '/user/register',
                            method: 'post',
                            baseURL: this.hostUrl,

                            data: {
                                email: this.register.username,
                                password: this.register.password,
                                checkcode: this.register.verCode,
                                nickname: this.register.nickname
                            }
                        })
                        .then((response) => {
                            if (response.data.code === 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '注册成功!',
                                    type: 'success'
                                });
                                self.goToLogin();
                                self.login.username = self.register.username;
                                self.login.password = self.register.password;
                            } else {
                                console.log(response.data.code);
                                codeParsing(response.data.code);
                            }
                        })
                        .catch((error) => {
                            this.$notify({
                                title: '失败',
                                message: '注册失败: ' + '请重试!',
                                type: 'error'
                            });
                            console.log("【Error】:", error);
                        });
                    } else {
                        console.log('error register!!');
                        this.$message({
                            title: '格式错误',
                            message: '请检查输入域是否正确',
                            type: 'error'
                        });
                        return false;
                    }
                });          
            },

            goToRegister() {
                this.activePane = 'register';
            },

            goToLogin() {
                this.activePane = 'login';
            },

            getVerCode() {
                var self = this;
                self.imgUrl = self.changeUrl();
                // this.$axios({
                //     url: '/checkcode',
                //     method: 'get',
                //     baseURL: this.hostUrl
                // })
                // .then((response) => {
                //     // fixed
                //     this.login.imgUrl = response;
                // })
                // .catch((error) => {
                //     console.log("【Error】:", error);
                // });
            }
        }
    }
</script>

<style>
    #toRegister {
        cursor: pointer;
        font-size:12px;
        line-height:30px;
        color:#999;
    }
    #toLogin {
        cursor: pointer;
        font-size:12px;
        line-height:30px;
        color:#999;        
    }
    #register {
        color: #fff;
        font-weight: bold;
        cursor: help;
        text-decoration: underline;
    }
    #login {
        color: #fff;
        font-weight: bold;
        cursor: help;
        text-decoration: underline;        
    }
    #help {
        text-decoration: underline;
        cursor: help;
    }
    img {
        float: right;
        height: 34px;
        width: 100%;
        font-size: inherit;
        display: inline-block;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
    }
    .login-btn span{
        text-decoration: none;
    }
    .el-tabs__item {
        padding: 0 60px;
    }
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:32px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:300px;
        margin:-220px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        /*background: #fff;*/
    }
    .footer {
        cursor: pointer;
        position: absolute;
        bottom: 5px;
        left: 50%;
        width:380px;
        margin: 0 0 0 -190px;
        text-align: center;
        font-size:5px;
        color: rgb(153, 153, 153);     
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>