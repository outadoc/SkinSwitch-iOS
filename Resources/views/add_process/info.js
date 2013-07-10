Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils'),
	Database = require('/includes/db'),

view = Ti.UI.createView({
	height: Ti.UI.SIZE,
	top: (Utils.isiPad()) ? 30 : (((Ti.Platform.displayCaps.platformHeight - 70 - 215) / 2) - (180 / 2))
}),

tableView = Ti.UI.createTableView({
	data: [Utils.getTextFieldRow(I('addProcess.skinInfo.name'), I('addProcess.skinInfo.nameHint')), Utils.getTextAreaRow(I('addProcess.skinInfo.description'))],
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	scrollable: false,
	height: 180,
	rowHeight: 45
}),

b_next = Ti.UI.createButton({
	title: I('addProcess.next'),
	enabled: (win.skinIDToEdit != null || win.defaultSkinName != null)
});

//when returning on the name field
tableView.data[0].rows[0].children[1].addEventListener('return', function(e) {
	tableView.data[0].rows[1].children[1].focus();
});

//when returning on the description field
tableView.data[0].rows[1].children[1].addEventListener('return', function(e) {
	b_next.fireEvent('click', {});
});

tableView.data[0].rows[0].children[1].addEventListener('change', function(e) {
	if(e.value == '') {
		b_next.setEnabled(false);
	} else {
		b_next.setEnabled(true);
	}
});

b_next.addEventListener('click', function(e) {
	if(win.skinIDToEdit == null) {
		var win_process = Ti.UI.createWindow({
			title: I('addProcess.process.title'),
			url: 'processing.js',
			backgroundImage: Utils.getBGImage(),
			barColor: Utils.getNavColor(),
			backgroundRepeat: true,
	
			skinUrl: win.skinUrl,
			skinName: tableView.data[0].rows[0].children[1].getValue(),
			skinDesc: tableView.data[0].rows[1].children[1].getValue()
		});
		
		if(Utils.isiPad()) {
			win_process.masterGroup = win.masterGroup;
			win_process.prevWins = [win.prevWins[0], win];
			win.masterGroup.open(win_process);
		} else {
			win_process.container = win.container;
			win.navGroup.open(win_process);
		}
	} else {
		//if we're only updating an existing skin, just update its info in db
		var db = Ti.Database.open('skins');
		db.execute('UPDATE skins SET name=?, description=? WHERE id=?', tableView.data[0].rows[0].children[1].getValue(), tableView.data[0].rows[1].children[1].getValue(), win.skinIDToEdit);
		db.close();
		
		if(Utils.isiPad()) {
			win.updateSkinsList();
			win.masterGroup.close(win, {
				animated: true
			});
		} else {
			win.close(win, {
				animated: true
			});
		}
	}
});

if(Utils.isiPhone() && win.skinIDToEdit != null) {
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
	var db = Ti.Database.open(Database.getDbName());
	var skin = db.execute('SELECT * FROM skins WHERE id=?', win.skinIDToEdit);

	if(skin.rowCount != 0) {
		tableView.data[0].rows[0].children[1].setValue(skin.fieldByName('name'));
		tableView.data[0].rows[1].children[1].setValue(skin.fieldByName('description'));
	}

	db.close();
} else {
	if(win.defaultSkinName != null) {
		tableView.data[0].rows[0].children[1].setValue(win.defaultSkinName);
	}
	
	if(win.defaultSkinDescription != null) {
		tableView.data[0].rows[1].children[1].setValue(win.defaultSkinDescription);
	}
}

win.add(view);
view.add(tableView);

win.setRightNavButton(b_next);

try {
	tableView.data[0].rows[0].children[1].focus();
} catch(e) {}
