Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var Utils = require('/includes/utils');
var keychain = require('clearlyinnovative.keychain');

function getTextFieldRow(text, hint, isPassword) {
	var row = Ti.UI.createTableViewRow({
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});
	
	var rowText = Ti.UI.createLabel({
		text: text,
		left: 10,
		width: 140,
		height: 20,
		font: {
			fontWeight: 'bold',
			fontSize: 17
		}
	});
	
	row.add(rowText);

	var textfield = Ti.UI.createTextField({
		color: '#336699',
		height: 35,
		top: 4,
		right: 5,
		width: 140,
		autocorrect: false,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		hintText: hint,
		passwordMask: isPassword,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
	});

	row.add(textfield);
	return row;
}

var b_credits = Ti.UI.createButton({
	title: I('credits.title')
});

b_credits.addEventListener('click', function() {
	var credits_win = Ti.UI.createWindow({
		url: 'credits.js',
		title: I('credits.title'),
		backgroundRepeat: Utils.isiPad(),
		barColor: Utils.getNavColor(),
		backgroundImage: Utils.getBGImage()
	});
	
	if(Utils.isiPad()) {
		win.masterGroup.open(credits_win);
	} else {
		win.navGroup.open(credits_win);
	}
});

if(Utils.isiPhone()) {
	var b_close = Ti.UI.createButton({
		title: I('buttons.close'),
		style: Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	b_close.addEventListener('click', function() {
		win.container.close();
	});
	
	win.setRightNavButton(b_credits);
	win.setLeftNavButton(b_close);
} else {
	win.setRightNavButton(b_credits);
}

var tableView = Ti.UI.createTableView({
	data: [getTextFieldRow(I('settings.username'), 'Notch', false), getTextFieldRow(I('settings.password'), '●●●●●●●●●●●', true)],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	scrollable: false,
	rowHeight: 45,
	top: 30
});

win.add(tableView);

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
	top: 5,
	left: (Utils.isiPad()) ? '7%' : 15,
	height: (Utils.isiPad()) ? Ti.UI.SIZE : 30
});

win.add(lbl_header);

var lbl_footer = Ti.UI.createLabel({
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
	top: (Utils.isiPad) ? 155 : 145,
	left: (Utils.isiPad) ? '7%' : 20,
	right: (Utils.isiPad) ? '7%' : 20,
	height: Ti.UI.SIZE
});

win.add(lbl_footer);

win.addEventListener('focus', function() {
	keychain.getForKey({
		key: 'username',
		serviceName: Ti.App.getId()
	}, function(data) {
		tableView.getData()[0].getRows()[0].getChildren()[1].setValue(data.value);
	});

	keychain.getForKey({
		key: 'password',
		serviceName: Ti.App.getId()
	}, function(data) {
		tableView.getData()[0].getRows()[1].getChildren()[1].setValue(data.value);
	});
});

function saveCredentials() {
	keychain.setForKey({
		key: 'username',
		value: tableView.getData()[0].getRows()[0].getChildren()[1].getValue(),
		serviceName: Ti.App.getId()
	}, function() {
	});

	keychain.setForKey({
		key: 'password',
		value: tableView.getData()[0].getRows()[1].getChildren()[1].getValue(),
		serviceName: Ti.App.getId()
	}, function() {
	});
}

win.addEventListener('blur', saveCredentials);
tableView.getData()[0].getRows()[0].getChildren()[1].addEventListener('blur', saveCredentials);
tableView.getData()[0].getRows()[1].getChildren()[1].addEventListener('blur', saveCredentials);
