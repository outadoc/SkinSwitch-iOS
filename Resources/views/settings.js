Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils'),
	Keychain = require('clearlyinnovative.keychain');

var b_credits = Ti.UI.createButton({
	title: I('credits.title')
});

b_credits.addEventListener('click', function() {
	var credits_win = Ti.UI.createWindow({
		url: 'credits.js',
		title: I('credits.title'),
		barColor: Utils.getNavColor(),
		backgroundImage: Utils.getModalBackgroundImage(),
		translucent: false
	});
	
	win.navGroup.open(credits_win);
});

var b_close = Ti.UI.createButton({
	title: I('buttons.close'),
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

b_close.addEventListener('click', function() {
	win.container.close();
});

win.setRightNavButton(b_credits);
win.setLeftNavButton(b_close);

var lbl_header = Ti.UI.createLabel({
	text: I('settings.header'),
	color: '#F8F8F8',
	font: {
		fontSize: 17,
		fontWeight: 'bold'
	},
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	},
	top: 15,
	left: 15,
	height: Ti.UI.SIZE
}),

tableView = Ti.UI.createTableView({
	data: [Utils.getTextFieldRow(I('settings.username'), 'Notch', false, true), Utils.getTextFieldRow(I('settings.password'), '●●●●●●●●●●●', true)],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	scrollable: false,
	rowHeight: 45,
	height: 120,
	top: (Utils.getMajorOsVersion() < 7) ? 0 : -20
}),

lbl_footer = Ti.UI.createLabel({
	text: I('settings.footer.migratedAccount') + '\n\n' + I('settings.footer.privacy'),
	color: '#F8F8F8',
	font: {
		fontSize: (Utils.isiPad()) ? 18 : 15
	},
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	},
	top: 15,
	left: 15,
	right: 15,
	height: Ti.UI.SIZE
});

win.add(lbl_header);
win.add(tableView);
win.add(lbl_footer);

Keychain.getForKey({
	key: 'username',
	serviceName: Ti.App.getId()
}, function(data) {
	tableView.getData()[0].getRows()[0].getChildren()[1].setValue(data.value);
});

Keychain.getForKey({
	key: 'password',
	serviceName: Ti.App.getId()
}, function(data) {
	tableView.getData()[0].getRows()[1].getChildren()[1].setValue(data.value);
});

function saveCredentials() {
	Keychain.setForKey({
		key: 'username',
		value: tableView.getData()[0].getRows()[0].getChildren()[1].getValue(),
		serviceName: Ti.App.getId()
	}, function() {
	});

	Keychain.setForKey({
		key: 'password',
		value: tableView.getData()[0].getRows()[1].getChildren()[1].getValue(),
		serviceName: Ti.App.getId()
	}, function() {
	});
}

win.addEventListener('blur', saveCredentials);
tableView.getData()[0].getRows()[0].getChildren()[1].addEventListener('blur', saveCredentials);
tableView.getData()[0].getRows()[1].getChildren()[1].addEventListener('blur', saveCredentials);
