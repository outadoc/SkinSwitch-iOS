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
	
	exports.getSkinInfoPanel = function(id, description, timestamp) {
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
	
})();
