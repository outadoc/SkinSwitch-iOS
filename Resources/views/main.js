Ti.include('/includes/db.js');
Ti.include('/includes/utils.js');
Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var loadingWin = createLoadingWindow();
loadingWin.open();

var searchBar = Ti.UI.createSearchBar({
	hintText:I('main.searchHint'),
	barColor:'#888888'
});

searchBar.addEventListener('focus', retractAllInfoPanels);

var tableView = Ti.UI.createTableView({
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	search:searchBar,
	filterAttribute:'title',
	backgroundImage:null,
	top:0
});

win.add(tableView);

win.addEventListener('focus', function() {
	loadingWin.open();
	tableView.setData(getSkins());
	updateSkinCount();
	loadingWin.close();
});
var b_add = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.ADD
});

b_add.addEventListener('click', function(e) {
	var container = Ti.UI.createWindow({
		navBarHidden:true
	});

	var info_win = Ti.UI.createWindow({
		url:'add_process/info.js',
		title:I('addProcess.skinInfo.title'),
		backgroundImage:getBGImage(),
		container:container,
		barColor:getNavColor()
	});

	var group = Ti.UI.iPhone.createNavigationGroup({
		window:info_win
	});

	info_win.navGroup = group;
	container.add(group);
	container.open({
		modal:true
	});
});
var b_settings = Ti.UI.createButton({
	image:'/img/gear.png'
});

b_settings.addEventListener('click', function() {
	var container = Ti.UI.createWindow({
		navBarHidden:true
	});
	
	var win_settings = Ti.UI.createWindow({
		title:I('settings.title'),
		barColor:getNavColor(),
		backgroundImage:getBGImage(),
		url:'settings.js',
		container:container
	});
	
	var group = Ti.UI.iPhone.createNavigationGroup({
		window:win_settings
	});
	
	win_settings.navGroup = group;
	container.add(group);

	container.open({
		modal:true
	});
});

win.setLeftNavButton(b_settings);

var b_done = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.DONE
});

b_done.addEventListener('click', function(e) {
	tableView.setEditing(false);
	win.setRightNavButton(b_edit);
	win.setLeftNavButton(b_settings);
});
var b_edit = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.EDIT
});

b_edit.addEventListener('click', function(e) {
	retractAllInfoPanels();
	tableView.setEditing(true);
	win.setRightNavButton(b_done);
	win.setLeftNavButton(b_add);
});

win.setRightNavButton(b_edit);

tableView.addEventListener('delete', function(e) {
	var db = Ti.Database.open('skins');
	db.execute('DELETE FROM skins WHERE id=?', e.rowData.skinID);
	db.close();

	Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/skin.png').deleteFile();
	Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/front.png').deleteFile();
	Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/back.png').deleteFile();
	Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID).deleteDirectory();
	Ti.API.debug(Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/').getExists());
	Ti.API.debug('deleting skin id ' + e.rowData.skinID);

	updateSkinCount();

	if(tableView.data[0] == null) {
		win.fireEvent('focus', null);
	}
	if(e.rowData.isExpanded) {
		tableView.setData(tableView.data);
		tableView.deleteRow(e.index, {
			animationStyle:Ti.UI.iPhone.RowAnimationStyle.TOP
		});
	}
});

tableView.addEventListener('click', function(e) {
	if(e.index != null && !e.rowData.isInfoPanel && !e.rowData.isPlaceHolder) {
		if(!e.rowData.isExpanded) {
			var infoPanel = Ti.UI.createTableViewRow({
				height:200,
				isInfoPanel:true,
				editable:false,
				selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
			});

			var panelView = Ti.UI.createView({
				height:200,
				width:300,
				backgroundImage:'/img/panel_bg.png'
			});

			infoPanel.add(panelView);

			var lbl_skin_desc_title = Ti.UI.createLabel({
				text:I('main.skin.description'),
				top:20,
				left:135,
				color:'darkGray',
				font: {
					fontWeight:'bold'
				},
				height:20,
				width:150
			});

			panelView.add(lbl_skin_desc_title);

			var scrollView_desc = Ti.UI.createScrollView({
				height:75,
				width:180,
				top:45,
				left:140,
				scrollType:'vertical',
				showVerticalScrollIndicator:true,
				contentHeight:'auto'
			});

			panelView.add(scrollView_desc);

			var lbl_skin_desc = Ti.UI.createLabel({
				text:e.rowData.skinDesc,
				color:'darkGray',
				top:0,
				left:0,
				font: {
					fontSize:13
				},
				width:150,
				height:Ti.UI.SIZE
			});

			scrollView_desc.add(lbl_skin_desc);

			var lbl_skin_time_title = Ti.UI.createLabel({
				text:I('main.skin.creation'),
				top:130,
				left:135,
				color:'darkGray',
				font: {
					fontWeight:'bold'
				},
				height:20,
				width:150
			});

			panelView.add(lbl_skin_time_title);

			var creationDate = new Date(e.rowData.skinTime);

			var lbl_skin_time = Ti.UI.createLabel({
				text:creationDate.toLocaleDateString(),
				color:'darkGray',
				top:lbl_skin_time_title.getTop() + 25,
				left:140,
				font: {
					fontSize:13
				},
				height:'auto',
				width:150
			});

			panelView.add(lbl_skin_time);

			var view_skin = Ti.UI.createImageView({
				height:170,
				width:85,
				top:15,
				left:20
			});

			panelView.add(view_skin);

			var img_skin_front = Ti.UI.createImageView({
				defaultImage:'/img/char_front.png',
				image:Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/front.png').getNativePath(),
				height:170,
				width:85,
				top:0,
				left:0
			});

			view_skin.add(img_skin_front);

			var img_skin_back = Ti.UI.createImageView({
				defaultImage:'/img/char_back.png',
				image:Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/back.png').getNativePath(),
				height:170,
				width:85,
				top:0,
				left:0
			});

			img_skin_front.addEventListener('singletap', function() {
				view_skin.animate({
					view:img_skin_back,
					transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
				});
			});

			img_skin_back.addEventListener('singletap', function() {
				view_skin.animate({
					view:img_skin_front,
					transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
				});
			});

			tableView.insertRowAfter(e.index, infoPanel, {
				animated:true,
				animationStyle:Titanium.UI.iPhone.RowAnimationStyle.FADE
			});

			var b_wear = Ti.UI.createButton({
				title:I('main.wear'),
				height:27,
				width:60,
				right:10,
				borderRadius:7,
				backgroundImage:null,
				borderWidth:1,
				borderColor:'lightGray',
				color:'darkGray',
				font: {
					fontSize:15
				},
				selectedColor:'black'
			});

			e.row.setHasChild(false);
			e.row.add(b_wear);
			e.rowData.isExpanded = true;

			if(searchBar.getValue() != '') {
				tableView.scrollToIndex(e.index + 1);
			}
		} else {
			if(e.row.children != null && e.source == e.row.children[0]) {
				Ti.API.debug('clicked wear button for id ' + e.rowData.skinID);

				var prog_upload = Ti.UI.createProgressBar({
					min:0,
					max:100,
					value:0,
					color:'white',
					width:150,
					font: {
						fontSize:14
					},
					style:Titanium.UI.iPhone.ProgressBarStyle.BAR
				});

				prog_upload.show();
				win.setTitleControl(prog_upload);

				var xhr_login = Ti.Network.createHTTPClient({
					onload: function() {
						Ti.API.debug('login succeeded, status code ' + this.getStatus());
						Ti.API.debug('page tried to redirect to ' + this.getResponseHeader('Location'));

						var xhr_skin = Ti.Network.createHTTPClient({
							onload: function() {
								Ti.API.debug('uploaded skin, status code ' + this.getStatus());
								Ti.API.debug('page tried to redirect to ' + this.getResponseHeader('Location'));

								prog_upload.setMessage(I('main.progressBar.success'));
								prog_upload.setValue(100);

								setTimeout(function() {
									win.setTitleControl(null);
								}, 1000);
							},
							onerror: function() {
								Ti.API.debug('failed to upload skin, error ' + this.getStatus());

								prog_upload.setMessage(I('main.progressBar.uploadFail'));
								prog_upload.setValue(0);

								setTimeout(function() {
									win.setTitleControl(null);
								}, 1000);
							},
							autoRedirect:false
						});

						prog_upload.setMessage(I('main.progressBar.upload'));
						prog_upload.setValue(30);

						xhr_skin.open('POST', 'http://www.minecraft.net/profile/skin');
						xhr_skin.setRequestHeader('enctype', 'multipart/form-data');
						xhr_skin.setRequestHeader('Content-Type', 'image/png');

						xhr_skin.send({
							skin:Ti.Filesystem.getFile(getSkinsDir() + e.rowData.skinID + '/skin.png').read()
						});
					},
					onerror: function() {
						Ti.API.debug('login failed, error ' + this.getStatus());

						prog_upload.setMessage(I('main.progressBar.loginFail'));
						prog_upload.setValue(0);

						setTimeout(function() {
							win.setTitleControl(null);
						}, 1000);
					},
					autoRedirect:false,
					validatesSecureCertificate:false
				});

				prog_upload.setMessage(I('main.progressBar.login'));
				prog_upload.setValue(3);

				xhr_login.open('POST', 'https://www.minecraft.net/login');
				xhr_login.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

				var keychain = require('clearlyinnovative.keychain');

				keychain.getForKey({
					key:'username',
					serviceName:Ti.App.getId()
				}, function(data) {
					var username = data.value;
					keychain.getForKey({
						key:'password',
						serviceName:Ti.App.getId()
					}, function(data) {
						var password = data.value;
						xhr_login.send({
							username:username,
							password:password,
							remember:'true'
						});
					});
				});
			} else {
				tableView.deleteRow(e.index + 1, {
					animated:true,
					animationStyle:Titanium.UI.iPhone.RowAnimationStyle.FADE
				});
				e.row.removePanel();
			}
		}
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
	var lbl_footer = Ti.UI.createLabel({
		text:I('main.skins', String(getSkinCount())),
		color:'#F8F8F8',
		font: {
			fontSize:15,
			fontWeight:'bold'
		},
		shadowColor:'black',
		shadowOffset: {
			x:0,
			y:1
		},
		top:0,
		left:15,
		height:16
	});

	tableView.setFooterView(lbl_footer);
}