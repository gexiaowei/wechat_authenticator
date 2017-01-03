const {generate} = require('./totp');
const {parse} = require('url-otpauth');

class Authenticator {
    constructor(key, type = 'totp', digits = 6, account = '', issuer = '') {
        this.key = key;
        this.type = type;
        this.digits = digits;
        this.account = account;
        this.issuer = issuer;
        this.initialize();
    }

    static generate(key) {
        return new Authenticator(key);
    }

    static generateFromURI(uri) {
        let {key, digits, type, account, issuer} = parse(uri);
        return new Authenticator(key, digits, type, account, issuer);
    }

    initialize() {
        this.code = generate(this.key);
    }
}

module.exports = Authenticator;