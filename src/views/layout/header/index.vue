<template>
    <div class="header">
        <el-header>
            <div class="left">
                <!-- <img class="logo" src="@/assets/images/login/logo.png" alt=""> -->
                <span>xxxx后台管理系统</span>
            </div>

            <div class="username">
                <div class="ava">
                    <!-- <img src="@/assets/images/avatar.png" alt=""> -->
                </div>
                <p>{{user}}</p>
                <div class="logout">
                    <P @click="logout">退出登录</P>
                    <P @click="change">修改密码</P>
                </div>
            </div>
        </el-header>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="原密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="rePassword">
                    <el-input type="password" v-model="ruleForm.rePassword" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import router from '@/router'
import { mapState } from 'vuex'
import { changePassword } from '@/api/login'
export default {
    computed: {
        ...mapState(['userName'])
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.rePassword !== '') {
                    this.$refs.ruleForm.validateField('rePassword');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
        return {
            user: '',
            dialogVisible: false,
            ruleForm: {
                password: '',
                newPassword: '',
                rePassword: '',
            },
            rules: {
                newPassword: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                rePassword: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }
        }
    },
    created() {
        this.user = this.userName
    },
    methods: {
        change() {
            this.dialogVisible = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    changePassword(this.ruleForm).then(res => {
                        if (res.code === 200) {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                            this.dialogVisible = false
                            setTimeout(() => {
                                this.logout()
                            }, 500);
                        }
                    })
                }
            });
        },
        logout() {
            localStorage.clear()
            router.push({ path: '/login' })
        }
    },
}
</script>

<style lang="scss" scoped>
header.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2e69eb;
    color: white;

    .left {
        display: flex;
        align-items: center;

        .logo {
            margin-right: 20px;
            width: 36px;
            height: 36px;
        }
    }



    .username {
        text-align: center;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;

        >p {
            min-width: 80px;
            cursor: pointer;
            line-height: 55px;
        }

        .ava {
            width: 48px;
            height: 48px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .logout {
            cursor: pointer;
            display: none;
            position: absolute;
            width: 100%;
            text-align: center;
            border: 1px solid #ccc;
            background-color: #fff;
            color: #000;
            top: 60px;
            line-height: 40px;
            z-index: 999;
        }
    }

    .username:hover .logout {
        display: block;
    }
}
</style>