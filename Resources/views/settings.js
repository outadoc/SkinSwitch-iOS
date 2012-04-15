var win = Ti.UI.currentWindow;
Ti.include('/includes/utils.js');

function getTextFieldRow(text, hint, isPassword) {
	var row = Ti.UI.createTableViewRow({
		title:text,
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
		backgroundColor:'white'
	});

	var textfield = Ti.UI.createTextField({
		color:'#336699',
		height:35,
		top:4,
		right:25,
		width:165,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_NEXT,
		hintText:hint,
		passwordMask:isPassword,
		autocapitalization:Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
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
	data:[getTextFieldRow('Username', 'Notch', false), getTextFieldRow('Password', '●●●●●●●●●●●●', true)],
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor:'transparent'
});

win.add(tableView);

tableView.setHeaderView(getHeaderFooterView('Minecraft.net Account ID', 20));
tableView.setFooterView(getHeaderFooterView('If your account has been migrated to a Mojang account, you have to use your email address instead of your Minecraft username.\n\nNote: we will NEVER store or use any of your informations for anything else than switching your Minecraft skins. Your account info is stored securely in the iOS keychain.', 200));

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
