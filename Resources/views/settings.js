var win = Ti.UI.currentWindow;

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

var lbl_header = Ti.UI.createLabel({
	text:'Minecraft.net ID',
	color:'white',
	font: {
		fontSize:15,
		fontWeight:'bold'
	},
	shadowColor:'black',
	shadowOffset: {
		x:0,
		y:1
	},
	top:10,
	left:15
});

var headerView = Ti.UI.createView({
	height:25
});
headerView.add(lbl_header);
tableView.setHeaderView(headerView);

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
