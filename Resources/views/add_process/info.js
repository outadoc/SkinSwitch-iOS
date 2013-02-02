Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var Utils = require('/includes/utils');

var view = Ti.UI.createView({
	height: Ti.UI.SIZE,
	top: (Utils.isiPad()) ? 30 : (((Ti.Platform.displayCaps.platformHeight - 70 - 215) / 2) - (180 / 2))
});

win.add(view);

var tableView = Ti.UI.createTableView({
	data: [Utils.getTextFieldRow(I('addProcess.skinInfo.name'), "My Awesome Skin"), Utils.getTextAreaRow(I('addProcess.skinInfo.description'))],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	scrollable: false,
	height: 180,
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
	if(tableView.data[0].rows[0].children[0].getValue() == '') {
		alert(I('addProcess.skinInfo.error.name'));
	} else {
		if(win.skinIDToEdit == null) {
			//if we're adding a new skin to the database, ask for more info
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
					barColor: Utils.getNavColor(),
					backgroundRepeat: Utils.isiPad(),
					url: 'url_select.js'
				});

				if(e.index == 0 || e.index == 1) {
					if(e.index == 0) {
						win_next.from = 'pseudo';
						win_next.setTitle(I('addProcess.skinInfo.method.pseudo'));
					} else if(e.index == 1) {
						win_next.from = 'url';
						win_next.setTitle(I('addProcess.skinInfo.method.url'));
					}

					if(Utils.isiPad()) {
						win_next.masterGroup = win.masterGroup;
						win_next.prevWins = [win];
						win.masterGroup.open(win_next);
					} else {
						win_next.navGroup = win.navGroup;
						win_next.container = win.container;
						win.navGroup.open(win_next);
					}					
				}
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

if(Utils.isiPhone()) {
	var b_close = Ti.UI.createButton({
		title: I('buttons.close'),
		style: Titanium.UI.iPhone.SystemButtonStyle.DONE
	});

	b_close.addEventListener('click', function(e) {
		if(win.container != null) {
			win.container.close();
		} else {
			win.close();
		}
	});

	win.setLeftNavButton(b_close);
}

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
