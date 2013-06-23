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
		
	}
	
})();
