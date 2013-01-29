Ti.include('/includes/lib/json.i18n.js');

var Database = require('/includes/db');
var Utils = require('/includes/utils');

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
			var infoPanel = Ti.UI.createTableViewRow({
				height: 200,
				isInfoPanel: true,
				editable: false,
				selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
			});

			var panelView = Ti.UI.createView({
				height: 200,
				width: 300,
				backgroundImage: '/img/panel_bg.png'
			});

			infoPanel.add(panelView);

			var lbl_skin_desc_title = Ti.UI.createLabel({
				text: I('main.skinDetails.description'),
				top: 20,
				left: 135,
				color: 'darkGray',
				font: {
					fontWeight: 'bold'
				},
				height: 20,
				width: 150
			});

			panelView.add(lbl_skin_desc_title);

			var scrollView_desc = Ti.UI.createScrollView({
				height: 75,
				width: 180,
				top: 45,
				left: 140,
				scrollType: 'vertical',
				showVerticalScrollIndicator: true,
				contentHeight: 'auto'
			});

			panelView.add(scrollView_desc);

			var lbl_skin_desc = Ti.UI.createLabel({
				text: e.rowData.skinData.desc + '\n ',
				color: 'darkGray',
				top: 0,
				left: 0,
				font: {
					fontSize: 13
				},
				width: 150,
				height: Ti.UI.SIZE
			});

			scrollView_desc.add(lbl_skin_desc);

			var lbl_skin_time_title = Ti.UI.createLabel({
				text: I('main.skinDetails.creation'),
				top: 130,
				left: 135,
				color: 'darkGray',
				font: {
					fontWeight: 'bold'
				},
				height: 20,
				width: 150
			});

			panelView.add(lbl_skin_time_title);

			var creationDate = new Date(e.rowData.skinData.time);

			var lbl_skin_time = Ti.UI.createLabel({
				text: creationDate.toLocaleDateString(),
				color: 'darkGray',
				top: lbl_skin_time_title.getTop() + 25,
				left: 140,
				font: {
					fontSize: 13
				},
				height: 'auto',
				width: 150
			});

			panelView.add(lbl_skin_time);

			var view_skin = Ti.UI.createImageView({
				height: 170,
				width: 85,
				top: 15,
				left: 20
			});

			panelView.add(view_skin);

			var img_skin_front = Ti.UI.createImageView({
				defaultImage: '/img/char_front.png',
				image: Ti.Filesystem.getFile(Utils.getSkinsDir() + e.rowData.skinData.id + '/front.png').getNativePath(),
				height: 170,
				width: 85,
				top: 0,
				left: 0
			});

			view_skin.add(img_skin_front);

			var img_skin_back = Ti.UI.createImageView({
				defaultImage: '/img/char_back.png',
				image: Ti.Filesystem.getFile(Utils.getSkinsDir() + e.rowData.skinData.id + '/back.png').getNativePath(),
				height: 170,
				width: 85,
				top: 0,
				left: 0
			});

			img_skin_front.addEventListener('singletap', function() {
				view_skin.animate({
					view: img_skin_back,
					transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
				});
			});

			img_skin_back.addEventListener('singletap', function() {
				view_skin.animate({
					view: img_skin_front,
					transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
				});
			});

			tableView.insertRowAfter(e.index, infoPanel, {
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
			e.row.removePanel();
		}
	} else if(e.rowData.isPlaceholder) {
		b_add.fireEvent('click', null);
	}
});

function retractAllInfoPanels() {
	for(var i = 0; i < tableView.data[0].rowCount; i++) {
		if(tableView.data[0].rows[i].isInfoPanel) {
			tableView.setData(tableView.data);
			tableView.data[0].rows[i - 1].removePanel();
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