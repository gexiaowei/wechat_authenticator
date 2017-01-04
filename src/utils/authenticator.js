const {generate} = require('./totp');
const {parse} = require('url-otpauth');

class Authenticator {
    constructor(key, type = 'totp', digits = 6, account = '', issuer = '') {
        this.key = key;
        this.type = type;
        this.digits = digits;
        this.account = account;
        this.issuer = issuer;
    }

    static get offset() {
        return 0;
    }

    static generate(key) {
        return new Authenticator(key);
    }

    static generateFromURI(uri) {
        let {key, digits, type, account, issuer} = parse(uri);
        return new Authenticator(key, digits, type, account, issuer);
    }

    get code() {
        return generate(this.key);
    }

    get info() {
        return {
            key: this.key,
            type: this.type,
            digits: this.digits,
            account: this.account,
            issuer: this.issuer,
            code: this.code,
        }
    }
}

module.exports = Authenticator;