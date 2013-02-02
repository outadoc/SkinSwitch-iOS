(function() {
	
	Ti.include('/includes/lib/json.i18n.js');
	
	exports.getEmptyRow = function() {
		var row = Ti.UI.createTableViewRow({
			editable: false,
			isPlaceholder: true,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY
		});
		
		var lbl_title = Ti.UI.createLabel({
			text: I('main.noContent.title'),
			font: {
				fontWeight: 'bold',
				fontSize: 17
			},
			top: 7,
			left: 10,
			right: 10,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		});
		
		row.add(lbl_title);
		
		var lbl_help = Ti.UI.createLabel({
			text: I('main.noContent.help'),
			top: 35,
			bottom: 10,
			left: 10,
			right: 10,
			font: {
				fontSize: 15
			},
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL
		});
		
		row.add(lbl_help);
		return row;
	}
	
	exports.getiPhoneSkinInfoPanel = function(id, description, timestamp, updateSkinsList) {
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
			text: description + '\n ',
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

		var creationDate = new Date(timestamp);

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
		
		var b_edit = Ti.UI.createButton({
			top: 20,
			right: 15,
			width: Ti.UI.SIZE,
			height: 20,
			title: '[' + I('editSkin.short') + ']',
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: '#cbcbcb',
			selectedColor: 'gray',
			font: {
				fontSize: 15,
				fontStyle: 'italic'
			}
		});
		
		b_edit.addEventListener('click', function(e) {
			var edit_win = Ti.UI.createWindow({
				url: '/views_common/info.js',
				skinIDToEdit: id,
				title: I('editSkin.title'),
				backgroundImage: Utils.getBGImage(),
				barColor: Utils.getNavColor()
			});

			edit_win.addEventListener('close', updateSkinsList);
			edit_win.open({
				modal: true
			});
		});
		
		panelView.add(b_edit);

		var view_skin = Ti.UI.createImageView({
			height: 170,
			width: 85,
			top: 15,
			left: 20
		});

		panelView.add(view_skin);

		var img_skin_front = Ti.UI.createImageView({
			defaultImage: '/img/char_front.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + id + '/front.png').getNativePath(),
			height: 170,
			width: 85,
			top: 0,
			left: 0
		});

		view_skin.add(img_skin_front);

		var img_skin_back = Ti.UI.createImageView({
			defaultImage: '/img/char_back.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + id + '/back.png').getNativePath(),
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
		
		return infoPanel;
	}
	
	exports.getiPadSkinInfoPanel = function(skinData, win) {
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
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinData.id + '/front.png').getNativePath(),
			height: 300,
			width: 150,
			top: 0
		});
	
		view_skin.add(img_skin_front);
	
		var img_skin_back = Ti.UI.createImageView({
			defaultImage: '/img/char_back.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinData.id + '/back.png').getNativePath(),
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
			Network.uploadSkin(skinData.id, skinData.name);
		});
		
		var b_edit = Ti.UI.createButton({
			title: I('editSkin.short')
		});
	
		b_edit.addEventListener('click', function() {
			var info_win = Ti.UI.createWindow({
				url: '/views_common/info.js',
				title: I('editSkin.title'),
				backgroundImage: Utils.getBGImage(),
				backgroundRepeat: true,
				masterGroup: win.masterGroup,
				skinIDToEdit: skinData.id
			});
		
			win.masterGroup.open(info_win);
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
			win.detailWin.setRightNavButton(null);
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
		
		win.detailWin.setRightNavButton(b_edit);
		
		win.detailWin.add(win.detailContent);
		win.detailContent.animate({
			opacity: 1,
			duration: 300,
			curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_IN
		});
	}
	
})();
