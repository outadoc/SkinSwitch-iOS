var win = Ti.UI.currentWindow;

Ti.include('/includes/utils.js');
Ti.include('/includes/lib/json.i18n.js');

function getTextFieldRow(text, hint, isPassword) {
	var row = Ti.UI.createTableViewRow({
		title: text,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});

	var textfield = Ti.UI.createTextField({
		color: '#336699',
		height: 35,
		top: 4,
		right: 25,
		width: 150,
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

var b_close = Ti.UI.createButton({
	title: I('buttons.close'),
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

b_close.addEventListener('click', function() {
	win.container.close();
});

win.setRightNavButton(b_close);

var b_credits = Ti.UI.createButton({
	title: I('credits.title')
});

b_credits.addEventListener('click', function() {
	var credits_win = Ti.UI.createWindow({
		url: 'credits.js',
		title: I('credits.title'),
		backgroundImage: getBGImage(),
		barColor: getNavColor()
	});

	win.navGroup.open(credits_win);
});

win.setLeftNavButton(b_credits);

var tableView = Ti.UI.createTableView({
	data: [getTextFieldRow(I('settings.username'), 'Notch', false), getTextFieldRow(I('settings.password'), '●●●●●●●●●●●●', true)],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage: null,
	scrollable: false,
	rowHeight: 45,
	top: 20
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
	left: 15,
	height: 30
});

win.add(lbl_header);

var lbl_footer = Ti.UI.createLabel({
	text: I('settings.footer.migratedAccount') + '\n\n' + I('settings.footer.privacy'),
	color: '#F8F8F8',
	font: {
		fontSize: 15
	},
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	},
	top: 135,
	left: 20,
	width: 285,
	height: I('settings.footer.height')
});

win.add(lbl_footer);

win.addEventListener('blur', function() {
	var keychain = require('clearlyinnovative.keychain');
	keychain.setForKey({
		key: 'username',
		value: tableView.getData()[0].getRows()[0].getChildren()[0].getValue(),
		serviceName: Ti.App.getId()
	}, function() {
	});

	keychain.setForKey({
		key: 'password',
		value: tableView.getData()[0].getRows()[1].getChildren()[0].getValue(),
		serviceName: Ti.App.getId()
	}, function() {
	});
});

win.addEventListener('focus', function() {
	var keychain = require('clearlyinnovative.keychain');
	keychain.getForKey({
		key: 'username',
		serviceName: Ti.App.getId()
	}, function(data) {
		tableView.getData()[0].getRows()[0].getChildren()[0].setValue(data.value);
	});

	keychain.getForKey({
		key: 'password',
		serviceName: Ti.App.getId()
	}, function(data) {
		tableView.getData()[0].getRows()[1].getChildren()[0].setValue(data.value);
	});
});
