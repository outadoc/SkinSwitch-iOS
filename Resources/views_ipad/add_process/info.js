var win = Ti.UI.currentWindow;
Ti.include('/includes/utils.js');
Ti.include('/includes/lib/json.i18n.js');

function getTextFieldRow(text) {
	var row = Ti.UI.createTableViewRow({
		title: text,
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});

	var textfield = Ti.UI.createTextField({
		color: '#336699',
		height: 30,
		right: 5,
		width: I('addProcess.skinInfo.fieldWidth'),
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
	});

	row.add(textfield);
	return row;
}

var view = Ti.UI.createView({
	height: Ti.UI.SIZE,
	top: 30
});

win.add(view);

var tableView = Ti.UI.createTableView({
	data: [getTextFieldRow(I('addProcess.skinInfo.name')), getTextFieldRow(I('addProcess.skinInfo.description'))],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage: null,
	scrollable: false,
	height: 160,
	rowHeight: 45
});

view.add(tableView);

tableView.data[0].rows[0].children[0].addEventListener('return', function(e) {
	tableView.data[0].rows[1].children[0].focus();
});
var b_next = Ti.UI.createButton({
	title: I('addProcess.next')
});

b_next.addEventListener('click', function(e) {
	if(tableView.data[0].rows[0].children[0].getValue() == '' && tableView.data[0].rows[1].children[0].getValue() == '') {
		alert(I('addProcess.skinInfo.error.nameDescription'));
	} else if(tableView.data[0].rows[0].children[0].getValue() == '') {
		alert(I('addProcess.skinInfo.error.name'));
	} else if(tableView.data[0].rows[1].children[0].getValue() == '') {
		alert(I('addProcess.skinInfo.error.description'));
	} else if(tableView.data[0].rows[0].children[0].getValue().length > 16) {
		alert(I('addProcess.skinInfo.error.length'));
	} else {
		var optionDialog = Ti.UI.createOptionDialog({
			title: I('addProcess.skinInfo.method.title'),
			options: [I('addProcess.skinInfo.method.pseudo'), I('addProcess.skinInfo.method.url'), I('addProcess.skinInfo.method.cancel')],
			cancel: 2
		});

		optionDialog.addEventListener('click', function(e) {
			var win_next = Ti.UI.createWindow({
				skinName: tableView.data[0].rows[0].children[0].getValue(),
				skinDesc: tableView.data[0].rows[1].children[0].getValue(),
				backButtonTitle: I('addProcess.skinInfo.shortTitle'),
				backgroundImage: getBGImage(),
				backgroundRepeat: true,
				url: 'url_select.js',
				masterGroup: win.masterGroup,
				prevWins: [win]
			});

			if(e.index == 0) {
				win_next.from = 'pseudo';
				win_next.setTitle(I('addProcess.skinInfo.method.pseudo'));
			} else if(e.index == 1) {
				win_next.from = 'url';
				win_next.setTitle(I('addProcess.skinInfo.method.url'));
			}
			
			win.masterGroup.open(win_next);
		});

		optionDialog.show();
	}
});

win.setRightNavButton(b_next);
tableView.data[0].rows[0].children[0].focus();