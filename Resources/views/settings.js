var win = Ti.UI.currentWindow;
Ti.include('/includes/utils.js');
Ti.include('/includes/lib/json.i18n.js');

function getTextFieldRow(text, hint, isPassword) {
	var row = Ti.UI.createTableViewRow({
		title:text,
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});

	var textfield = Ti.UI.createTextField({
		color:'#336699',
		height:35,
		top:4,
		right:25,
		width:150,
		autocorrect:false,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_NEXT,
		hintText:hint,
		passwordMask:isPassword,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		clearButtonMode:Ti.UI.INPUT_BUTTONMODE_ONFOCUS
	});

	row.add(textfield);
	return row;
}

var b_close = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.DONE
});

b_close.addEventListener('click', function() {
	win.close();
});

win.setLeftNavButton(b_close);

var tableView = Ti.UI.createTableView({
	data:[getTextFieldRow(I('settings.username'), 'Notch', false), getTextFieldRow(I('settings.password'), '●●●●●●●●●●●●', true)],
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage:null,
	scrollable:false,
	rowHeight:45
});

win.add(tableView);

tableView.setHeaderView(getHeaderFooterView(I('settings.header'), 30));
tableView.setFooterView(getHeaderFooterView(I('settings.footer.migratedAccount') + '\n\n' + I('settings.footer.privacy'), I('settings.footer.height')));

win.addEventListener('blur', function() {
	var keychain = require('clearlyinnovative.keychain');
	keychain.setForKey({
		key:'username',
		value:tableView.getData()[0].getRows()[0].getChildren()[0].getValue(),
		serviceName:Ti.App.getId()
	}, function() {
	});

	keychain.setForKey({
		key:'password',
		value:tableView.getData()[0].getRows()[1].getChildren()[0].getValue(),
		serviceName:Ti.App.getId()
	}, function() {
	});
});

win.addEventListener('focus', function() {
	var keychain = require('clearlyinnovative.keychain');
	keychain.getForKey({
		key:'username',
		serviceName:Ti.App.getId()
	}, function(data) {
		tableView.getData()[0].getRows()[0].getChildren()[0].setValue(data.value);
	});

	keychain.getForKey({
		key:'password',
		serviceName:Ti.App.getId()
	}, function(data) {
		tableView.getData()[0].getRows()[1].getChildren()[0].setValue(data.value);
	});
});
