Ti.include('/includes/db.js');
Ti.include('/includes/utils.js');
Ti.include('/includes/lib/json.i18n.js');
Ti.include('/includes/network.js');

var win = Ti.UI.currentWindow;
var loadingWin = createLoadingWindow();
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
	tableView.setData(getSkins());
	updateSkinCount();
	loadingWin.close();
});

var b_settings = Ti.UI.createButton({
	image: '/img/gear.png'
});

b_settings.addEventListener('click', function() {
	var win_settings = Ti.UI.createWindow({
		title: I('settings.title'),
		backgroundImage: getBGImage(),
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
		backgroundImage: getBGImage(),
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
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_IN
	});
});

win.setRightNavButton(b_edit);

tableView.addEventListener('delete', function(e) {
	var db = Ti.Database.open('skins');
	db.execute('DELETE FROM skins WHERE id=?', e.rowData.skinData.id);
	db.close();

	Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinData.id).deleteDirectory(true);
	//Ti.API.debug(Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinData.id + '/').getExists());
	//Ti.API.debug('deleting skin id ' + e.rowData.skinData.id);

	updateSkinCount();

	if(tableView.data[0] == null) {
		win.fireEvent('focus', null);
	}
});

tableView.addEventListener('click', function(e) {
	if(!e.rowData.isPlaceholder && e.index != null) {
		displaySkinInfo(e.rowData.skinData);
	} else if(e.rowData.isPlaceholder) {
		b_add.fireEvent('click', null);
	}
});

function updateSkinCount() {
	var lbl_footer = Ti.UI.createLabel({
		text: I('main.skins', String(getSkinCount())),
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

function displaySkinInfo(skinData) {
	var skinInfos = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL
	});

	var lbl_skin_time_title = Ti.UI.createLabel({
		text: I('main.skinDetails.creation'),
		top: 20,
		left: '5%',
		color: 'darkGray',
		font: {
			fontWeight: 'bold',
			fontSize: 17
		},
		height: 20,
		width: 150
	});

	skinInfos.add(lbl_skin_time_title);

	var creationDate = new Date(skinData.time);

	var lbl_skin_time = Ti.UI.createLabel({
		text: creationDate.toLocaleDateString(),
		color: 'darkGray',
		top: 40,
		left: '5%',
		font: {
			fontSize: 16
		},
		height: 'auto',
		width: 150
	});

	skinInfos.add(lbl_skin_time);

	var lbl_skin_desc_title = Ti.UI.createLabel({
		text: I('main.skinDetails.description'),
		top: 65,
		left: '5%',
		color: 'darkGray',
		font: {
			fontWeight: 'bold',
			fontSize: 17
		},
		height: 20,
		width: 150
	});

	skinInfos.add(lbl_skin_desc_title);

	var lbl_skin_desc = Ti.UI.createLabel({
		text: skinData.desc,
		color: 'darkGray',
		width: '50%',
		height: Ti.UI.SIZE,
		top: 85,
		left: '5%',
		font: {
			fontSize: 16
		}
	});

	skinInfos.add(lbl_skin_desc);

	var view_skin = Ti.UI.createImageView({
		height: 300,
		width: Ti.UI.SIZE,
		right: '5%',
		top: 25
	});

	skinInfos.add(view_skin);

	var img_skin_front = Ti.UI.createImageView({
		defaultImage: '/img/char_front.png',
		image: Ti.Filesystem.getFile(getSkinsDir() + skinData.id + '/front.png').getNativePath(),
		height: 300,
		width: 150,
		top: 0
	});

	view_skin.add(img_skin_front);

	var img_skin_back = Ti.UI.createImageView({
		defaultImage: '/img/char_back.png',
		image: Ti.Filesystem.getFile(getSkinsDir() + skinData.id + '/back.png').getNativePath(),
		height: 300,
		width: 150,
		top: 0
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

	var b_wear = Ti.UI.createButton({
		title: I('main.skinDetails.wear'),
		font: {
			fontSize: 23
		},
		backgroundImage: '/img/button.png',
		width: Ti.UI.FILL,
		top: 50,
		left: '8%',
		right: '8%',
		height: 50
	});

	b_wear.addEventListener('click', function() {
		uploadSkin(skinData.id, skinData.name);
	});

	var b_close = Ti.UI.createButton({
		title: I('main.skinDetails.close'),
		font: {
			fontSize: 23
		},
		backgroundImage: '/img/button.png',
		width: Ti.UI.FILL,
		top: 10,
		left: '8%',
		right: '8%',
		height: 50
	});

	b_close.addEventListener('click', function() {
		win.detailWin.remove(win.detailContent);
		win.detailContent = win.initialInfoView;
		win.detailContent.setOpacity(0);

		win.detailWin.add(win.detailContent);
		win.detailContent.animate({
			opacity: 1,
			duration: 300,
			curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_IN
		});
	});

	win.detailWin.remove(win.detailContent);
	win.detailContent = Ti.UI.createView({
		layout: 'vertical',
		opacity: 0,
		height: Ti.UI.SIZE,
		top: '10%'
	});

	win.detailContent.add(skinInfos);
	win.detailContent.add(b_wear);
	win.detailContent.add(b_close);

	win.detailWin.add(win.detailContent);
	win.detailContent.animate({
		opacity: 1,
		duration: 300,
		curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_IN
	});
}