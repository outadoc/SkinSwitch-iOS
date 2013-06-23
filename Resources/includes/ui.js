(function() {
	
	Ti.include('/includes/lib/json.i18n.js');
	
	exports.getSkinFrame = function(data) {
		var view = Ti.UI.createView({
			top: 10,
			width: 98,
			height: 100,
			skinData: data,
			layout: 'vertical'
		});
		
		var backgroundFrame = Ti.UI.createImageView({
			image: '/img/itemframe.png',
			width: 72,
			height: 72,
			data: (data == null) ? { isPlaceholder: true } : data
		});
		
		var headPreview = Ti.UI.createImageView({
			image: (data == null) ? '/img/plus_sign.png' : exports.getHeadFromSkinID(data.id),
			top: 15,
			left: 15,
			right: 15,
			bottom: 15
		});
		
		backgroundFrame.add(headPreview);
		
		var title = Ti.UI.createLabel({
			text: (data == null) ? I('main.addSkin') : data.name,
			top: 3,
			width: 75,
			height: 20,
			font: {
				fontSize: (data == null) ? 13 : 15
			},
			color: 'white',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		
		view.add(backgroundFrame);
		view.add(title);
		
		backgroundFrame.addEventListener('click', function(e) {
			if(data != null) {
				var win = exports.getiPhoneDetailWindow(data);

				var anim = Ti.UI.createAnimation({
					transform: Ti.UI.create2DMatrix({
						scale: 1.1
					}),
					duration: 200
				});
	
				anim.addEventListener('complete', function() {
					win.animate({
						transform: Ti.UI.create2DMatrix({
							scale: 1.0
						}),
						duration: 200
					});
				});
	
				win.open(anim);
			}
		});
		
		return view;
	}
	
	exports.getHeadFromSkinID = function(skinID) {
		return Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/front.png').read().imageAsCropped({
			height: 42,
			width: 42,
			x: 21,
			y: 0
		});
	}
	
	exports.getSkinsShowcase = function(skins) {
		var skinsShowcase = Ti.UI.createScrollView({
			contentWidth: Ti.UI.FILL,
		  	contentHeight: Ti.UI.SIZE,
		  	showVerticalScrollIndicator: true,
		  	layout: 'horizontal',
		  	left: 13,
		  	top: 13,
		  	bottom: 13,
		  	right: 13
		});
		
		if(skins == null || skins.length == 0) {
			skinsShowcase.add(exports.getSkinFrame(null));
		}
		
		for(var i = 0; i < skins.length; i ++) {
			skinsShowcase.add(exports.getSkinFrame(skins[i]));
		}
		
		return skinsShowcase;
	}
	
	exports.getiPhoneDetailWindow = function(skinData) {
		var win = Ti.UI.createWindow({
			transform: Ti.UI.create2DMatrix({
				scale: 0
			})
		});
		
		win.addEventListener('click', function(e) {
			if(e.source == win) {
				win.close({
					transform: Ti.UI.create2DMatrix({
						scale: 0
					}),
					duration: 300
				}); 
			}
		});
		
		var containerView = Ti.UI.createView({
			height: 350,
			width: 300,
			backgroundColor: '#f2f2f2',
			borderWidth: 1,
			borderColor: 'gray',
			borderRadius: 3,
			layout: 'vertical'
		});
		
		win.add(containerView);
		
		var skinInfoView = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			height: containerView.height - 40,
			contentWidth: Ti.UI.FILL,
		  	contentHeight: Ti.UI.SIZE,
		  	showVerticalScrollIndicator: true,
		  	layout: 'vertical'
		});
		
		containerView.add(skinInfoView);
		
		var skinTitle = Ti.UI.createLabel({
			text: skinData.name,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: 21,
				fontFamily: 'HelveticaNeue-Light'
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 25
		});
		
		skinInfoView.add(skinTitle);
		
		var line = Ti.UI.createView({
			left: 10,
			right: 10,
			top: 10,
			height: 1,
			backgroundColor: 'lightGray'
		});
		
		skinInfoView.add(line);
		
		var skinView = exports.getSkinPreview(skinData.id);
		skinInfoView.add(skinView);
		
		var descriptionTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.description'),
			font: {
				fontSize: 17,
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(descriptionTitle);
		
		var skinDescription = Ti.UI.createLabel({
			text: skinData.desc,
			font: {
				fontSize: 15,
			},
			color: 'lightGray',
			top: 5,
			left: 20,
			right: 20
		});
		
		skinInfoView.add(skinDescription);
		
		var timestampTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.creation'),
			font: {
				fontSize: 17,
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(timestampTitle);
		
		var skinTimestamp = Ti.UI.createLabel({
			text: (new Date(skinData.time)).toLocaleDateString(),
			font: {
				fontSize: 15,
			},
			color: 'lightGray',
			top: 5,
			bottom: 20,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(skinTimestamp);
		
		var actionView = Ti.UI.createView({
			bottom: 0,
			top: 0,
			height: 40,
			width: Ti.UI.FILL,
			borderColor: 'lightGray',
			borderRadius: 1
		});
		
		containerView.add(actionView);

		return win;
	}
	
	exports.getSkinPreview = function(skinID) {
		var view_skin = Ti.UI.createImageView({
			height: 170,
			width: 85,
			top: 15,
			bottom: 15
		});

		var img_skin_front = Ti.UI.createImageView({
			defaultImage: '/img/char_front.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/front.png').getNativePath(),
			height: 170,
			width: 85,
			top: 0,
			left: 0
		});

		view_skin.add(img_skin_front);

		var img_skin_back = Ti.UI.createImageView({
			defaultImage: '/img/char_back.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/back.png').getNativePath(),
			height: 170,
			width: 85,
			top: 0,
			left: 0
		});

		img_skin_front.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_back,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});

		img_skin_back.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_front,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});
		
		return view_skin;
	}
	
})();
