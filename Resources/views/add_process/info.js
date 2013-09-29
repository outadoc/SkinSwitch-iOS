Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils'),
	Database = require('/includes/db'),

view = Ti.UI.createView({
	height: Ti.UI.SIZE,
	top: 20
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
	enabled: (win.skinIDToEdit != null || win.defaultSkinName != null),
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

//when returning on the name field
tableView.data[0].rows[0].children[1].addEventListener('return', function(e) {
	tableView.data[0].rows[1].children[1].focus();
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
			backgroundImage: Utils.getModalBackgroundImage(),
			barColor: Utils.getNavColor(),
			translucent: false,
	
			skinUrl: win.skinUrl,
			skinName: tableView.data[0].rows[0].children[1].getValue(),
			skinDesc: tableView.data[0].rows[1].children[1].getValue()
		});
			
		win_process.container = win.container;
		win.navGroup.open(win_process);
	} else {
		//if we're only updating an existing skin, just update its info in db
		var db = Database.getDatabaseHandle();
		db.execute('UPDATE skins SET name=?, description=? WHERE id=?', tableView.data[0].rows[0].children[1].getValue(), tableView.data[0].rows[1].children[1].getValue(), win.skinIDToEdit);
		db.close();
		
		if(win.container != null) {
			win.container.close();
		} else {
			win.close();
		}
	}
});

if(win.skinIDToEdit != null) {
	var b_close = Ti.UI.createButton({
		title: I('buttons.close')
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
	var db = Database.getDatabaseHandle();
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
	
	if(win.defaultSkinDesc != null) {
		tableView.data[0].rows[1].children[1].setValue(win.defaultSkinDesc);
	}
}

win.add(view);
view.add(tableView);

win.setRightNavButton(b_next);

try {
	tableView.data[0].rows[0].children[1].focus();
} catch(e) {}
