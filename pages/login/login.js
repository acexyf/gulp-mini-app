let common = require('../common/common.js'),
    api = common.api,
    toolkit = common.toolkit;

    const {
        checkIdCard,
        checkPhone,
    } = require('../../../utils/index')

const app = getApp();


Page({
    data: {
        timing: 60,
        suffix: ['@test.com', '@qeebu.cn'],
        email: '',
        suffixHint: [],
        scrollTop: 0,
        blankHidden: true,
        token: '',
        status: 1,
        role: 2,
        account: '',
        password: '',
        msgCode: '',
        name: '',
        IDCard: '',
        tel: '',
        code: '',
        getting: false,
        //医生登录模式，0密码登录；1验证码登录
        doctorMode: 0,
    },
    onLoad(options) {
        this.setData({
            status: options.status,
        })
    },
    onShow() {
        toolkit.hideLoading();
    },
    onShareAppMessage() {
        return toolkit.wxShare();
    },
    login: function() {
        let page = this;
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求
                    let params = {
                        code: res.code,
                        user_type: Number(page.data.status),
                    };
                    if (params.user_type) {
                        //患者登录
                        params.IDCard = page.data.IDCard;
                        params.tel = page.data.tel;
                        params.tel_code = page.data.code;
                        params.name = page.data.name;
                        params.patient_name = page.data.name;
                        if (!page.data.name) {
                            toolkit.alert("请填写姓名");
                            return
                        } else if (!page.data.IDCard) {
                            toolkit.alert("请填写身份证号");
                            return
                        } else if (!params.tel) {
                            toolkit.alert("请填写手机号");
                            return
                        } else if(!checkPhone(params.tel)){
                            toolkit.alert("手机号格式不正确");
                            return
                        } else if (!params.tel_code) {
                            toolkit.alert("请填写验证码");
                            return
                        }

                        wx.setStorage({
                            key: 'patient_info',
                            data: params
                        });
                    } else {
                        //医生管理员登录
                        const {
                            doctorMode,
                        } = page.data;
                        if(!page.data.account){
                            toolkit.alert("请填写手机号");
                            return
                        }
                        if(!checkPhone(page.data.account)){
                            toolkit.alert("手机号格式不正确");
                            return
                        }

                        if(doctorMode == 1){
                            //验证码登录
                            params.tel = page.data.account;
                            params.tel_code = page.data.msgCode;
                            if(!page.data.msgCode){
                                toolkit.alert("请填写验证码");
                                return
                            }
                        } else if(doctorMode == 0) {
                            //密码登录
                            params.tel = page.data.account;
                            params.password = page.data.password;
                            if (!page.data.password) {
                                toolkit.alert("请填写密码");
                                return
                            }
                        }
                        wx.getStorage({
                            key: 'teamInvitation',
                            success: res => {
                                if (typeof(res.data) != 'undefined') {
                                    params.team_id = res.data.team_id;
                                    params.invitation_id = res.data.invitation_id;
                                    params.share_id = res.data.share_id;
                                    params.team_share = res.data.team_share;
                                }
                            }
                        });
                    }
                    toolkit.post(api.user.login, params, function(resp) {
                        if (resp.data.status_code == 1) {
                            wx.setStorage({
                                key: 'baseInfo',
                                data: resp.data.data
                            });
                            app.globalData.baseInfo = resp.data.data;
                            wx.removeStorage({key: 'teamInvitation'});
                            wx.reLaunch({
                                url: toolkit.page.home
                            });
                        } else if (resp.data.status_code == 2) {
                            wx.navigateTo({
                                url: `${toolkit.page.user.login.check}?id=${resp.data.data.id}&is_verify=${resp.data.data.is_verify}`
                            });
                        } else {
                            toolkit.alert(resp.data.message)
                        }
                    });
                } else {
                    wx.hideLoading();
                    toolkit.alert('登录失败！' + res.errMsg);
                }
            }
        });
    },

    bindAccount(e) {
        this.setData({
            account: e.detail.value
        })
    },
    bindPassword(e) {
        this.setData({
            password: e.detail.value
        })
    },
    bindName(e) {
        this.setData({
            name: e.detail.value
        })
    },
    bindIDCard(e) {
        this.setData({
            IDCard: e.detail.value
        })
    },
    bindTel(e) {
        this.setData({
            tel: e.detail.value
        })
    },
    bindCode(e) {
        this.setData({
            code: e.detail.value
        })
    },
    bindMsgCode(e) {
        this.setData({
            msgCode: e.detail.value
        })
    },
    getCode() {
        let page = this;
        if (!checkPhone(page.data.tel)) {
            toolkit.alert('手机号不正确');
            return
        }
        toolkit.get(api.referral.send_verify, {
            tel: page.data.tel
        }, (res) => {

            if(api.setVerify){
                //测试验证码
                page.setData({
                    code: res.data.data
                });
            }
            //======================
            if (res.data.status_code) {
                page.setData({
                    getting: true,
                    timing: 60
                });
                page.timer = setInterval(() => {
                    let i = page.data.timing;
                    --i;
                    if(i == 0){
                        clearInterval(page.timer);
                        page.setData({
                            getting: false
                        })
                    }
                    page.setData({
                        timing: i
                    })
                }, 1000);
            }
        })
    },
    goRegister : function () {
        wx.navigateTo({
          url: toolkit.page.user.register.main
        });
    },
    onHide(){
        clearInterval(this.timer)
    },
    onUnload(){
        clearInterval(this.timer)
    },
    toggleDoctorMode(){
        const {
            doctorMode
        } = this.data;
        this.setData({
            doctorMode: doctorMode == 0 ? 1 : 0,
        })
    },
    getMsgCode(){

        const {
            account
        } = this.data;
        const page = this;

        if(!account){
            toolkit.alert('请输入手机号')
            return;
        }
        if(!checkPhone(account)){
            toolkit.alert('手机号格式不正确')
            return;
        }

        toolkit.get(api.user.msgcode,{
            type: 'login',
            mobile: account,
            userid: ''
        },(resp)=>{
            if(resp.data.status_code == 1){
                //发送成功

                page.setData({
                    getting: true,
                    timing: 60
                });
                page.timer = setInterval(() => {
                    let i = page.data.timing;
                    --i;
                    if(i == 0){
                        clearInterval(page.timer);
                        page.setData({
                            getting: false
                        })
                    }
                    page.setData({
                        timing: i
                    })
                }, 1000);
            }
        })

    },
});
