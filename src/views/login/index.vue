<template>
    <div id="login">

        <div class="login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item class="title">
                    <span>后台管理</span>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" prefix-icon="el-icon-login-user" placeholder="请输入账号">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"
                        prefix-icon="el-icon-login-password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-form-item class="loginbtn">
                    <el-checkbox class="rember-margin" v-model="remember">记住密码</el-checkbox>
                    <span @click="submitForm('ruleForm')">登录</span>
                </el-form-item>
                <!-- <el-form-item>
                    </el-form-item> -->
            </el-form>
        </div>


    </div>
</template>
<script>
import router, { initAsyncRouter } from '@/router';
import { login, routerBase, getUserInfo, getRoles } from '@/api/login';
import { setCookie, getCookie, removeCookie } from '@/utils/cookie';
import store from '@/store';
export default {
    beforeRouteEnter(to, from, next) {
        if (localStorage.getItem('token')) {
            next({ path: '/' })
        } else {
            next()
        }
    },
    data() {
        return {
            loading: false,
            remember: false,
            ruleForm: {
                username: "",
                password: "",
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ],
            }
        };
    },
    created() {
        this.rememberPwd()
    },
    methods: {
        //remember
        rememberPwd() {
            let remember = getCookie('remember')
            if (remember) {
                let user = getCookie('user')
                let pwd = getCookie('pwd')
                this.ruleForm = {
                    username: user,
                    password: pwd,
                }
                this.remember = true
            } else {
                this.ruleForm = {
                    username: 'root',
                    password: '123456',
                }
            }
        },
        // 登录
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    login(this.ruleForm).then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            this.remember == true ? this.remberme() : this.removeRember();
                            store.commit('set_token', res.result.token);
                            store.commit('set_userType', res.result.user.userType);
                            // getUserInfo().then(res => {
                            //     if (res.code == 200) {
                            //         let user = res.result.user.realName ? res.result.user.realName : '未知'
                            //         store.commit('set_userName', user);
                            //     }
                            // })
                            getRoles(res.result.role).then(res => {
                                if (res.code == 200) {
                                    this.loading = false;
                                    console.log(res, 'role');
                                    store.commit('set_userRole', res.data);
                                    initAsyncRouter();
                                    router.push({ path: '/' });
                                }
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        remberme() {
            setCookie('user', this.ruleForm.username);
            setCookie('pwd', this.ruleForm.password);
            setCookie('remember', this.remember);
        },
        removeRember() {
            removeCookie('user');
            removeCookie('pwd');
            removeCookie('remember');
        }
    }
}
</script>
<style lang="scss" scoped>
#login {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: url("@/assets/images/login/1510643317606947.png") no-repeat;
    background-size: 100% 100%;


    :deep .login {
        background-color: rgba(27, 219, 194, .3);
        width: 440.17px;
        height: 100%;
        position: fixed;
        right: 0%;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: flex-start;

        .title {

            color: #fff;
            text-align: center;

            span {
                font-size: 24px;
            }
        }

        form.el-form.demo-ruleForm {
            padding-top: 10.01px;
            width: 300.08px;
            padding-left: 60.01px;
            height: 105.06px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        /* 添加用户名密码小图标 */
        .el-icon-login-user {
            background: url(@/assets/images/login/user.png) center no-repeat;
            background-size: contain;
        }

        .el-icon-login-user:before {
            content: "\66ff";
            font-size: 8px;
            visibility: hidden;
        }

        .el-icon-login-password {
            background: url(@/assets/images/login/pass.png) center no-repeat;
            background-size: contain;
        }

        .el-icon-login-password:before {
            content: "替";
            font-size: 8px;
            visibility: hidden;
        }

        .el-input__prefix {
            left: 5px;
        }

        .el-form-item {
            margin-bottom: 18.01px;
        }

        .el-form-item.loginbtn {

            .el-form-item__content {

                display: flex;
                justify-content: space-between;
            }

            .rember-margin {
                margin-right: 160px;
            }

            span {

                cursor: pointer;
            }

            span:last-of-type {
                font-size: 18px;
            }
        }




        .el-checkbox {
            span.el-checkbox__label {
                color: #000;
            }
        }

        .el-checkbox__input .el-checkbox__inner {
            border-radius: 50%;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: transparent !important;
            border: .02rem solid #fff !important;
            border-radius: 50%;
        }

        .el-checkbox__inner:hover {
            border-color: #fff;
        }

        .el-checkbox__input.is-checked+.el-checkbox__label {
            color: #fff;
        }

        .el-checkbox__input.is-focus .el-checkbox__inner {
            border-color: #fff !important;
        }


    }
}
</style>