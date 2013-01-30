Ti.include('/includes/lib/json.i18n.js');

var Database = require('/includes/db');
var Utils = require('/includes/utils');
var Ui = require('/includes/ui');

var win = Ti.UI.currentWindow;
var loadingWin = Utils.createLoadingWindow();
loadingWin.open();

var searchBar = Ti.UI.createSearchBar({
	hintText: I('main.searchHint'),
	barColor: '#888888'
});

searchBar.addEventListener('focus', retractAllInfoPanels);

var tableView = Ti.UI.createTableView({
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	search: searchBar,
	filterAttribute: 'title',
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	top: 0
});

win.add(tableView);

var iad = Ti.UI.iOS.createAdView({
	adSize: Ti.UI.iOS.AD_SIZE_PORTRAIT,
	height: Ti.UI.SIZE,
	width: Ti.UI.FIT,
	bottom: 0
});

win.add(iad);

function updateSkinsList() {
	loadingWin.open();
	
	if(tableView.getData().length > 0) {
		retractAllInfoPanels();
	}
	
	tableView.setData(Database.getSkins());
	updateSkinCount();
	loadingWin.close();
}

win.addEventListener('focus', updateSkinsList);

var b_add = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});

b_add.addEventListener('click', function(e) {
	var container = Ti.UI.createWindow({
		navBarHidden: true
	});

	var info_win = Ti.UI.createWindow({
		url: 'add_process/info.js',
		title: I('addProcess.skinInfo.title'),
		backgroundImage: Utils.getBGImage(),
		container: container,
		barColor: Utils.getNavColor()
	});

	var group = Ti.UI.iPhone.createNavigationGroup({
		window: info_win
	});

	info_win.navGroup = group;
	container.add(group);
	container.addEventListener('close', updateSkinsList);
	container.open({
		modal: true
	});
});

var b_settings = Ti.UI.createButton({
	image: '/img/gear.png'
});

b_settings.addEventListener('click', function() {
	var win_settings = Ti.UI.createWindow({
		title: I('settings.title'),
		barColor: Utils.getNavColor(),
		backgroundImage: Utils.getBGImage(),
		url: 'settings.js'
	});

	var container = Ti.UI.createWindow({
		navBarHidden: true
	});
	
	container.addEventListener('close', updateSkinsList);
	
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: win_settings
	});

	container.add(navGroup);

	win_settings.navGroup = navGroup;
	win_settings.container = container;

	container.open({
		modal: true
	});
});

win.setLeftNavButton(b_settings);

var b_done = Ti.UI.createButton({
	title: I('buttons.done'),
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

b_done.addEventListener('click', function(e) {
	tableView.setEditing(false);
	win.setRightNavButton(b_edit, {
		animated: true
	});
	win.setLeftNavButton(b_settings, {
		animated: true
	});
});

var b_edit = Ti.UI.createButton({
	title: I('buttons.edit')
});

b_edit.addEventListener('click', function(e) {
	retractAllInfoPanels();
	tableView.setEditing(true);
	win.setRightNavButton(b_done, {
		animated: true
	});
	win.setLeftNavButton(b_add, {
		animated: true
	});
});

win.setRightNavButton(b_edit);

tableView.addEventListener('delete', function(e) {
	var db = Ti.Database.open('skins');
	db.execute('DELETE FROM skins WHERE id=?', e.rowData.skinData.id);
	db.close();

	Ti.Filesystem.getFile(Utils.getSkinsDir() + e.rowData.skinData.id).deleteDirectory(true);
	//Ti.API.debug(Ti.Filesystem.getFile(Utils.getSkinsDir() + e.rowData.skinData.id + '/').getExists());
	//Ti.API.debug('deleting skin id ' + e.rowData.skinData.id);

	updateSkinCount();

	if(tableView.data[0] == null) {
		win.fireEvent('focus', null);
	}
	
	if(e.rowData.isExpanded) {
		tableView.setData(tableView.data);
		tableView.deleteRow(e.index, {
			animationStyle: Ti.UI.iPhone.RowAnimationStyle.TOP
		});
	}
});

tableView.addEventListener('click', function(e) {
	if((e.row.children == null || (e.row.children != null && e.source != e.row.children[0])) && e.index != null && !e.rowData.isInfoPanel && !e.rowData.isPlaceholder) {
		if(!e.rowData.isExpanded) {
			tableView.insertRowAfter(e.index, Ui.getiPhoneSkinInfoPanel(e.rowData.skinData.id, e.rowData.skinData.desc, e.rowData.skinData.time, updateSkinsList), {
				animated: true,
				animationStyle: Titanium.UI.iPhone.RowAnimationStyle.FADE
			});

			e.rowData.isExpanded = true;

			if(searchBar.getValue() != '') {
				tableView.scrollToIndex(e.index + 1);
			}
		} else {
			tableView.deleteRow(e.index + 1, {
				animated: true,
				animationStyle: Titanium.UI.iPhone.RowAnimationStyle.FADE
			});
			e.row.isExpanded = false;
		}
	} else if(e.rowData.isPlaceholder) {
		b_add.fireEvent('click', null);
	}
});

function retractAllInfoPanels() {
	for(var i = 0; i < tableView.data[0].rowCount; i++) {
		if(tableView.data[0].rows[i].isInfoPanel) {
			tableView.data[0].rows[i - 1].isExpanded = false;
			tableView.deleteRow(i);
		}
	}
}

function updateSkinCount() {
	var view_wrapper = Ti.UI.createView({
		left: 0,
		right: 0, 
		height: 55
	});
	
	var lbl_footer = Ti.UI.createLabel({
		text: I('main.skins', String(Database.getSkinCount())),
		color: '#F8F8F8',
		font: {
			fontSize: 15,
			fontWeight: 'bold'
		},
		shadowColor: 'black',
		shadowOffset: {
			x: 0,
			y: 1
		},
		top: 0,
		left: 15,
		height: 16
	});
	
	view_wrapper.add(lbl_footer);
	tableView.setFooterView(view_wrapper);
}