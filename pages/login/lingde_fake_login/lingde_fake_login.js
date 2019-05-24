var common = require('../../common/common.js'),
    api = common.api,
    toolkit = common.toolkit;

Page({
    data: {
        status: 1, //登录页
        time: 60,
        suffix: ['@test.com', '@qeebu.cn'],
        email: '',
        suffixHint: [],
        scrollTop: 0,
        blankHidden: true,
        token: ''
    },
    onShareAppMessage() {
        
        return toolkit.wxShare();
    },
    doctorLogin: function(event) {
        let loginIn = event.currentTarget.dataset.login;
        let user = '';
        let password = '';
        let user_type = 0;
        wx.login({
            success(res) {
                if (0 == loginIn) {
                    toolkit.goLogin();
                }else if ('hao_0' == loginIn) {
                    user = 15811202928;
                    password = 111111;
                }else if ('hao_1' == loginIn) {
                    user = 15266666666;
                    password = 123456;
                }else if ('hao_2' == loginIn) {
                    user = 15811208888;
                    password = 123456;
                }else if ('hao_3' == loginIn) {
                    user = 15811206666;
                    password = 123456;
                }else if ('chenliu_0' == loginIn) {
                    user = 15210379707;
                    password = 123456;
                }else if ('zhuzhen_0' == loginIn) {
                    user = 15556938420;
                    password = 'zhu1196044459';
                }else if ('ruoxi_0' == loginIn) {
                    user = 15110045978;
                    password = 123456;
                }else if ('ming_0' == loginIn) {
                    user = 17365437215;
                    password = 123456;
                }else if ('ming_0' == loginIn) {
                    user = 17365437215;
                    password = 123456;
                }else if ('pengxu_0' == loginIn) {
                    user = 15255142685;
                    password = 123456;
                }else if ('fanghenwei_0' == loginIn) {
                    user = 18896504243;
                    password = 123456;
                } else if ('xiexiaofei_0' == loginIn) {
                  user = 15161601717;
                  password = 123456;
                }else if ('jintao_0' == loginIn) {
                    user = 18913059173;
                    password = 123456;
                }else if ('yunchao_0' == loginIn) {
                    user = 13011069828;
                    password = 123456;
                }else if ('jiandong_0' == loginIn) {
                    user = 13720072067;
                    password = 123456;
                }else if ('jiandong_1' == loginIn) {
                    user = 13011111111;
                    password = 123456;
                }else if ('xueying_0' == loginIn) {
                    user = 15022358903;
                    password = 123456;
                }else if ('hongrunyi_0' == loginIn) {
                    user = 18210925501;
                    password = 123456;
                }else if ('limingzhe_0' == loginIn) {
                    user = 13000000004;
                    password = 123456;
                }else if('yiming_0' == loginIn){
                    user = 15371862380;
                    password = 123456;
                }else if('ceshi_1' == loginIn){
                    user = 19911111111;
                    password = 123456;
                }else if('ceshi_2' == loginIn){
                    user = 19922222222;
                    password = 123456;
                }else if('guanli_1' == loginIn){
                    user = 19999999999;
                    password = 123456;
                }
                // 发起网络请求
                toolkit.post(api.user.login, {
                    code: res.code,
                    //齐菲
                    IDCard: user,
                    tel: user,
                    password: password,
                    user_type: user_type,
                }, function(resp) {
                    wx.setStorage({
                        key: 'baseInfo',
                        data: resp.data.data
                    });

                    if(resp.data.data.auth == 'assistant' || resp.data.data.auth == 'patient'){
                        //医生助理和患者
                        wx.reLaunch({
                            url: toolkit.page.mine.main
                        });
                    } else {
                        wx.reLaunch({
                            url: toolkit.page.home
                        });
                    }

                });
            }
        });
    },
    patientLogin: function(event) {
        let page = this;
        wx.login({
            success(res) {
                let params = {
                    code: res.code,
                    patient_name: '李浩',
                    tel: 15510558202,
                    user_type: 1,
                    tel_code: 538779
                };
                params.IDCard = event.currentTarget.dataset.login;

                // 发起网络请求
                toolkit.post(api.user.login, params, function(resp) {
                    wx.setStorage({
                        key: 'baseInfo',
                        data: resp.data.data
                    });
                    page.setData({
                        token: resp.data.data.token
                    });
                    wx.navigateTo({
                        url: toolkit.page.home
                    })
                });
            }
        });
    },
    pay() {
        let page = this;
        toolkit.get(`${api.consult.pay}/36`, {
            token: page.data.token
        }, res => {
            wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonce_str,
                package: `prepay_id=${res.data.data.prepay_id}`,
                paySign: res.data.data.paySign,
                signType: 'MD5',
                success(res) {},
                fail(err) {}
            })
        })
    },
    payBack() {
        let page = this;
        toolkit.post(`${api.consult.checkPay}/36`, {
            token: page.data.token
        }, res => {
        })
    },
    register(){
        wx.navigateTo({
          url: toolkit.page.user.register.main
        })
    }
});
