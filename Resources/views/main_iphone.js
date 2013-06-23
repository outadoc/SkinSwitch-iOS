Ti.include('/includes/lib/json.i18n.js');

var Database = require('/includes/db');
var Utils = require('/includes/utils');
var Network = require('/includes/network');
var Ui = require('/includes/ui');

var win = Ti.UI.currentWindow;
var skinsShowcase = Ui.getSkinsShowcase([]);
var loadingWin = Utils.createLoadingWindow();

loadingWin.open();

/*
var iad = Ti.UI.iOS.createAdView({
	adSize: Ti.UI.iOS.AD_SIZE_PORTRAIT,
	height: Ti.UI.SIZE,
	width: Ti.UI.FIT,
	bottom: 0
});

win.add(iad);
*/

function updateSkinsList() {
	loadingWin.open();
	skinsShowcase = Ui.getSkinsShowcase(Database.getSkins());
	win.add(skinsShowcase);
	loadingWin.close();
}

var b_add = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});

b_add.addEventListener('click', function(e) {
	var container = Ti.UI.createWindow({
		navBarHidden: true
	});

	var info_win = Ti.UI.createWindow({
		url: 'add_process/info.js',
		title: I('addProcess.skinInfo.title'),
		backgroundImage: Utils.getBGImage(),
		container: container,
		barColor: Utils.getNavColor()
	});

	var group = Ti.UI.iPhone.createNavigationGroup({
		window: info_win
	});

	info_win.navGroup = group;
	container.add(group);
	container.addEventListener('close', updateSkinsList);
	container.open({
		modal: true
	});
});

var b_settings = Ti.UI.createButton({
	image: '/img/gear.png'
});

b_settings.addEventListener('click', function() {
	var win_settings = Ti.UI.createWindow({
		title: I('settings.title'),
		barColor: Utils.getNavColor(),
		backgroundImage: Utils.getBGImage(),
		url: 'settings.js'
	});

	var container = Ti.UI.createWindow({
		navBarHidden: true
	});
	
	container.addEventListener('close', updateSkinsList);
	
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: win_settings
	});

	container.add(navGroup);

	win_settings.navGroup = navGroup;
	win_settings.container = container;

	container.open({
		modal: true
	});
});

win.setLeftNavButton(b_settings);
win.setRightNavButton(b_add);

updateSkinsList();