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

tableView.addEventListener('delete', function(e) {
	var db = Ti.Database.open(Database.getDbName());
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