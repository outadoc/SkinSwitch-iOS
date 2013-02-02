Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var Utils = require('/includes/utils');

var view = Ti.UI.createView({
	height: Ti.UI.SIZE,
	top: 30
});

win.add(view);

var tableView = Ti.UI.createTableView({
	data: [Utils.getTextFieldRow(I('addProcess.skinInfo.name'), false), Utils.getTextAreaRow(I('addProcess.skinInfo.description'), false)],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
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
		if(win.skinIDToEdit == null) {
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
					backgroundImage: Utils.getBGImage(),
					backgroundRepeat: true,
					url: '/views_common/url_select.js',
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
		} else {
			//if we're only updating an existing skin, just update its info in db
			var db = Ti.Database.open('skins');
			db.execute('UPDATE skins SET name=?, description=? WHERE id=?', tableView.data[0].rows[0].children[0].getValue(), tableView.data[0].rows[1].children[0].getValue(), win.skinIDToEdit);
			db.close();
			
			win.masterGroup.close(win, {
				animated: true
			});
		}
	}
});

win.setRightNavButton(b_next);

//if we're editing a skin and not actually creating a new one
if(win.skinIDToEdit != null) {
	var db = Ti.Database.open('skins');
	var skin = db.execute('SELECT * FROM skins WHERE id=?', win.skinIDToEdit);

	if(skin.rowCount != 0) {
		tableView.data[0].rows[0].children[0].setValue(skin.fieldByName('name'));
		tableView.data[0].rows[1].children[0].setValue(skin.fieldByName('description'));
	}
	
	db.close();
}

tableView.data[0].rows[0].children[0].focus();
