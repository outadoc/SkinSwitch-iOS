(function() {

	exports.getRandomID = function() {
		return String(Math.floor(Math.random() * 98765862));
	}

	exports.getSkinsDir = function() {
		Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
		return Ti.Filesystem.getApplicationDataDirectory() + 'skins/';
	}

	exports.getBGImage = function() {
		if(exports.isiPad()) {
			return '/img/bg_ipad.png';
		} else {
			return '/img/bg.png';
		}
	}

	exports.getNavColor = function() {
		return '#6d482b';
	}
	
	exports.isiPhone = function() {
		return (Ti.Platform.getOsname() === 'iphone');
	}
	
	exports.isiPad = function() {
		return (Ti.Platform.getOsname() === 'ipad');
	}

	exports.createLoadingWindow = function() {
		var win = Ti.UI.createWindow({
			width: 320,
			height: Ti.UI.FILL,
			left: 0,
			top: 0
		}),
		
		view = Ti.UI.createView({
			height: 60,
			width: 60,
			borderRadius: 10,
			backgroundColor: 'black',
			opacity: 0.6
		}),
		
		spinWheel = Ti.UI.createActivityIndicator({
			style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
		});

		win.add(view);
		view.add(spinWheel);
		spinWheel.show();

		return win;
	}

	exports.getTextFieldRow = function(text, hint) {
		var row = Ti.UI.createTableViewRow({
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
			layout: 'horizontal',
			height: 35
		}),
		
		rowText = Ti.UI.createLabel({
			text: text,
			left: 10,
			width: Ti.UI.SIZE,
			top: 5,
			bottom: 5,
			height: 30,
			font: {
				fontWeight: 'bold',
				fontSize: 17
			}
		}),
		
		textfield = Ti.UI.createTextField({
			hintText: hint,
			color: '#336699',
			right: 10,
			left: 10,
			top: 5,
			bottom: 5,
			height: 30,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
		});
		
		row.add(rowText);
		
		rowText.addEventListener('postlayout', function() {
			if(rowText.rect.width >= 140) {
				rowText.width = 140;
			}
			
			textfield.width = 270 - rowText.rect.width;
		});
		
		row.add(textfield);
		return row;
	}
	
	exports.getTextAreaRow = function(text) {
		var row = Ti.UI.createTableViewRow({
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
			height: 100
		}),
		
		rowText = Ti.UI.createLabel({
			text: text,
			left: 10,
			width: 120,
			height: 20,
			font: {
				fontWeight: 'bold',
				fontSize: 17
			}
		}),
		
		textarea = Ti.UI.createTextArea({
			color: '#336699',
			height: 98,
			right: 10,
			width: 160,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
			font: {
				fontSize: 15
			}
		});
		
		row.add(rowText);
		row.add(textarea);
		return row;
	}
	
	exports.closeiPadSkinDetails = function(ipad_win) {
		var detail = ipad_win.detailContent;
		
		ipad_win.detailWin.remove(detail);
		detail = null;
		
		ipad_win.detailWin.setRightNavButton(null, {animated: true});
		ipad_win.detailWin.setLeftNavButton(null, {animated: true});
		
		ipad_win.detailContent = ipad_win.initialInfoView;
		ipad_win.detailContent.setOpacity(0);

		ipad_win.detailWin.add(ipad_win.detailContent);
		ipad_win.detailContent.animate({
			opacity: 1,
			duration: 300,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN
		});
	}
	
})();
