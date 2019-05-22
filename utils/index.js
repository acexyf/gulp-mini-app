
let regs = {
    //手机号
    phone: /^(13[0-9]|14[1345678]|15[0-9]|16[6]|17[0135678]|18[0-9]|19[89])[0-9]{8,9}$/,
    //邮箱
    mail: /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    //18位身份证
    idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    //15位身份证
    idcard15: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/,
}





function checkPhone(values){
    return regs.phone.test(values);
}
function checkMail(values) {
    return regs.mail.test(values);
}

function checkIdCard(values) {
    if (values.length == 15) {
        return regs.idcard15.test(values)
    } else if (values.length == 18) {
        return regs.idcard.test(values)
    }
}

module.exports = {
    checkPhone,
    checkMail,
    checkIdCard,
}

