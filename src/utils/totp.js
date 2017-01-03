const createHmac = require('create-hmac/browser');

function dec2hex(s) {
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
};

function hex2dec(s) {
    return parseInt(s, 16);
};

function base32tohex(base32) {
    let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let hex = "";
    for (let i = 0; i < base32.length; i++) {
        let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }

    for (let i = 0; i + 4 <= bits.length; i += 4) {
        let chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16);
    }

    if (hex.length % 2 && hex[hex.length - 1] === '0') {
        hex = hex.substr(0, hex.length - 1);
    }

    return hex;
};

function leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
        str = new Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
};

function generate(secret, counter) {
    secret = secret.replace(/\s/g, '');
    let len = 6;
    let key;
    if (/^[a-z2-7]+=*$/.test(secret.toLowerCase())) {
        key = base32tohex(secret);
    }
    else if (/^[0-9a-f]+$/.test(secret.toLowerCase())) {
        key = secret;
    }
    else if (/^bliz\-/.test(secret.toLowerCase())) {
        key = base32tohex(secret.substr(5));
        len = 8;
    }
    else if (/^blz\-/.test(secret.toLowerCase())) {
        key = base32tohex(secret.substr(4));
        len = 8;
    }

    if (isNaN(counter)) {
        let epoch = Math.round(new Date().getTime() / 1000.0);
        // if (localStorage.offset) {
        //     epoch = epoch + Number(localStorage.offset);
        // }
        counter = Math.floor(epoch / 30);
    }

    let time = leftpad(dec2hex(counter), 16, '0');

    let hmac = createHmac('sha1', Buffer.from(key, 'hex')).update(Buffer.from(time, 'hex')).digest('hex');
    let offset;
    if (hmac !== 'KEY MUST BE IN BYTE INCREMENTS') {
        offset = hex2dec(hmac.substring(hmac.length - 1));
    }

    let otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
    if (otp.length < len) {
        otp = new Array(len - otp.length + 1).join('0') + otp;
    }
    return (otp).substr(otp.length - len, len).toString();
};

module.exports = { generate };