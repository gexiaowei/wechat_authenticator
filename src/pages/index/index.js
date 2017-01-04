const app = getApp();
const Authenticator = require('../../utils/authenticator');
let authenticators = [];

Page({
	data: { authenticators },
	onLoad: function () {
		initialize(this);
	},
	scan: function (event) {
		var that = this;
		wx.scanCode({
			success: function (res) { addAuthenticator(that, res) }
		});
	}
});

function initialize(page) {
	authenticators = getStorage();
	page.setData({ authenticators: authenticators.map(item => item.info) });
	setData(page, authenticators);
	setInterval(() => setData(page, authenticators), 1000);
}

function getStorage() {
	let uri = wx.getStorageSync('authenticator_uris') || [];
	return uri.map(item => Authenticator.generateFromURI(item));
}

function addAuthenticator(page, res) {
	authenticators.push(Authenticator.generateFromURI(res.result));
	setData(page, authenticators, true);
}

function getContext(percent = 0) {
	let radius = 12;
	let height = radius * 2;
	let width = radius * 2;
	let context = wx.createContext();
	context.setFillStyle("#3D7FF7")
	context.moveTo(width / 2, height);
	context.lineTo(width / 2, height / 2);
	context.lineTo(width / 2 + Math.sin(Math.PI * 2 * percent), height / 2 + + Math.cos(Math.PI * 2 * percent));
	context.arc(height / 2, width / 2, radius, (2 * percent - 0.5) * Math.PI, 1.5 * Math.PI);
	context.fill();
	return context;
}

function setData(page, authenticators, sync) {
	let count = getCount();
	authenticators.forEach(item => {
		wx.drawCanvas({
			canvasId: `count_${item['key']}`,
			actions: getContext(count / 30).getActions() // 获取绘图动作数组
		});
	});
	if (count == 0 || sync) {
		page.setData({ authenticators: authenticators.map(item => item.info) });
	}
}

function getCount() {
	return new Date(Date.now() + Authenticator.offset).getSeconds() % 30;
}