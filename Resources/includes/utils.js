(function() {

	exports.getRandomID = function() {
		return String(Math.floor(Math.random() * 98765862));
	}

	exports.getSkinsDir = function() {
		Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
		return Ti.Filesystem.getApplicationDataDirectory() + 'skins/';
	}

	exports.getModalBackgroundImage = function() {
		if(exports.isiPad()) {
			return '/img/bg_ipad_modal.png';
		} else {
			return '/img/bg.png';
		}
	}
	
	exports.getListBackgroundImage = function() {
		if(exports.isiPad()) {
			return '/img/bg_ipad_tall.png';
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
	
	exports.getMajorOsVersion = function() {
		var version = Titanium.Platform.version.split(".");
		return parseInt(version[0]);
	}
	
	exports.getHtmlForPreview = function(base64, side) {
		var zoom;
		
		if(Titanium.Platform.displayCaps.platformHeight > 480) {
			zoom = 6;
		} else {
			zoom = 5;
		}

		return '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="margin: 0;" onload="getPreviewFromSkin(\'data:image/png;base64,' + base64 + '\', \'' + side + '\', ' + zoom + ');" style="margin: 0;"><canvas id="skinpreview" height="192" width="96"></canvas><script type="text/javascript" src="includes/lib/skinpreview.js"></script></body></html>';
	}

	exports.getTextFieldRow = function(text, hint, isPassword) {
		var row = Ti.UI.createTableViewRow({
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
			layout: 'horizontal',
			height: 35,
			width: 320
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
			color: (exports.getMajorOsVersion() < 7) ? '#336699' : '#8f8f8f',
			right: (exports.isiPad()) ? 20 : 10,
			left: 10,
			top: 5,
			bottom: 5,
			height: 30,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			passwordMask: isPassword,
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
		});
		
		row.add(rowText);
		
		if(!exports.isiPad()) {
			rowText.addEventListener('postlayout', function() {
				if(rowText.rect.width >= 140) {
					rowText.width = 140;
				}
				
				textfield.width = 270 - rowText.rect.width;
			});
		}
		
		row.add(textfield);
		return row;
	}
	
	exports.getTextAreaRow = function(text) {
		var row = Ti.UI.createTableViewRow({
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
			layout: 'horizontal',
			height: 100
		}),
		
		rowText = Ti.UI.createLabel({
			text: text,
			left: 10,
			width: Ti.UI.SIZE,
			top: 5,
			bottom: 5,
			font: {
				fontWeight: 'bold',
				fontSize: 17
			}
		}),
		
		textarea = Ti.UI.createTextArea({
			color: (exports.getMajorOsVersion() < 7) ? '#336699' : '#8f8f8f',
			right: (exports.isiPad()) ? 15 : 10,
			left: (exports.isiPad()) ? 50 : 10,
			top: 5,
			bottom: 5,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			font: {
				fontSize: 16
			}
		});
		
		rowText.addEventListener('postlayout', function() {
			if(rowText.rect.width >= 140) {
				rowText.width = 140;
			}
		});
		
		rowText.addEventListener('click', function() {
			textarea.focus();
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
