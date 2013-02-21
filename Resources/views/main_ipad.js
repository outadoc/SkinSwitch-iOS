Ti.include('/includes/lib/json.i18n.js');

var Database = require('/includes/db');
var Utils = require('/includes/utils');
var Network = require('/includes/network');
var Ui = require('/includes/ui');

var win = Ti.UI.currentWindow;
var loadingWin = Utils.createLoadingWindow();
loadingWin.open();

var searchBar = Ti.UI.createSearchBar({
	hintText: I('main.searchHint')
});

var tableView = Ti.UI.createTableView({
	style: Ti.UI.iPhone.TableViewStyle.GROUPED,
	search: searchBar,
	filterAttribute: 'title',
	backgroundColor: 'transparent',
	rowBackgroundColor: 'white',
	top: 0
});

win.add(tableView);

win.addEventListener('focus', function() {
	loadingWin.open();
	tableView.setData(Database.getSkins());
	updateSkinCount();
	loadingWin.close();
});

var b_settings = Ti.UI.createButton({
	image: '/img/gear.png'
});

b_settings.addEventListener('click', function() {
	var win_settings = Ti.UI.createWindow({
		title: I('settings.title'),
		backgroundImage: Utils.getBGImage(),
		barColor: Utils.getNavColor(),
		backgroundRepeat: true,
		url: 'settings.js',
		masterGroup: win.masterGroup,
		detailGroup: win.detailGroup,
	});

	win.masterGroup.open(win_settings);
});

win.setLeftNavButton(b_settings);

var b_add = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});

b_add.addEventListener('click', function(e) {
	var info_win = Ti.UI.createWindow({
		url: 'add_process/info.js',
		title: I('addProcess.skinInfo.title'),
		backgroundImage: Utils.getBGImage(),
		barColor: Utils.getNavColor(),
		backgroundRepeat: true,
		masterGroup: win.masterGroup
	});

	win.masterGroup.open(info_win);
});

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
	tableView.setEditing(true);
	win.setRightNavButton(b_done, {
		animated: true
	});
	win.setLeftNavButton(b_add, {
		animated: true
	});

	win.detailWin.remove(win.detailContent);
	win.detailContent = win.initialInfoView;
	win.detailContent.setOpacity(0);

	win.detailWin.add(win.detailContent);
	win.detailContent.animate({
		opacity: 1,
		duration: 300,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN
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
});

tableView.addEventListener('click', function(e) {
	if(!e.rowData.isPlaceholder && e.index != null) {
		Ui.getiPadSkinInfoPanel(e.rowData.skinData, win);
	} else if(e.rowData.isPlaceholder) {
		b_add.fireEvent('click', null);
	}
});

function updateSkinCount() {
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

	tableView.setFooterView(lbl_footer);
}