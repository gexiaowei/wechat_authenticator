var app = getApp();
var authenticator = require('../../utils/authenticator');

Page({
	data: {
		authenticators: []
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function () {
		initialize(this);
	}
});

function initialize(page) {
	let authenticators = [];
	for (let i = 0; i < 2; i++) {
		authenticators.push(authenticator.generateFromURI('otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'));
	}
	page.setData({ authenticators });
	setTimeout(function () {
		authenticators[0].code = 123456;
		page.setData({ authenticators })
	}, 5000);

	wx.drawCanvas({
		canvasId: 'firstCanvas',
		actions: update().getActions() // 获取绘图动作数组
	})
}

function update() {
	let radius = 12;
	let height  = radius * 2;
	let width  = radius * 2;
	let context = wx.createContext();
	context.setFillStyle("#3D7FF7")
	context.moveTo(width / 2, height);
	context.lineTo(width / 2, height / 2);
	context.lineTo(width, height / 2);
	context.arc(height / 2, width / 2, radius, 0, 1.5 * Math.PI);
	context.fill();
	return context;
}