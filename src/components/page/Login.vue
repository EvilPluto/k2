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
                                        <img :src="imgUrl" alt="验证码图片" width="200px">
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
                                        <img :src="imgUrl" alt="验证码图片" width="200px">
                                </el-popover>
                                <el-input 
                                    v-popover:b
                                    placeholder="验证码" 
                                    v-model="login.verCode" 
                                    @keyup.enter.native="loginForm('login')">
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
            return {
                activePane: 'login',
                imgUrl: '../../assets/logo.png',
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
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    nickname: [
                        { required: true, message: '请输入昵称', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在6-20之间', trigger: 'blur' }
                    ],
                    repassword: [
                        { required: true, message: '请确认密码', trigger: 'blur' }
                    ],
                    verCode: [
                        { required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            loginForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',self.login.username);
                        self.$router.push('/readme');
                    } else {
                        console.log('error login!!');
                        return false;
                    }
                });
            },
            registerForm(formName) {
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
            },
            goToRegister() {
                this.activePane = 'register';
            },
            goToLogin() {
                this.activePane = 'login';
            },
            getVerCode() {
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