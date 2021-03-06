(function() {
	
	var Database = require('/includes/db');

	exports.getRandomID = function() {
		return String(Math.floor(Math.random() * 98765862));
	};

	exports.getSkinsDir = function() {
		Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
		return Ti.Filesystem.getApplicationDataDirectory() + 'skins/';
	};

	exports.getModalBackgroundImage = function() {
		if(exports.isiPad()) {
			return '/img/bg_ipad_modal.png';
		} else {
			return '/img/bg.png';
		}
	};
	
	exports.getListBackgroundImage = function() {
		if(exports.isiPad()) {
			return '/img/bg_ipad_tall.png';
		} else {
			return '/img/bg.png';
		}
	};

	exports.getNavColor = function() {
		if(exports.getMajorOsVersion() < 7) {
			return '#6d482b';
		} else {
			return '#916032';
		}
	};
	
	exports.getBarTintColor = function() {
		return '#e9d5c2';
	};
	
	exports.isiPhone = function() {
		return (Ti.Platform.getOsname() === 'iphone');
	};
	
	exports.isiPad = function() {
		return (Ti.Platform.getOsname() === 'ipad');
	};
	
	exports.getMajorOsVersion = function() {
		var version = Titanium.Platform.version.split(".");
		return parseInt(version[0]);
	};
	
	exports.getHtmlForPreview = function(path, side, zoom) {
		var zoom;
		
		if(zoom == null) {
			if(Ti.Platform.displayCaps.platformHeight > 480) {
				zoom = 6;
			} else {
				zoom = 5;
			}
		}

		return '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body style="margin: 0;" onload="getPreviewFromSkin(\'' + path + '\', \'' + side + '\', ' + zoom + ');" style="margin: 0;"><canvas id="skinpreview" height="192" width="96"></canvas><script type="text/javascript" src="includes/lib/skinpreview.js"></script></body></html>';
	};
	
	exports.getSkinPreview = function(path, side, callback) {		
		function onLoad(e) {
			Ti.App.removeEventListener('skinPreviewLoaded', onLoad);
			Ti.App.removeEventListener('skinPreviewFailed', onError);
			
			win.remove(web_preview);
			web_preview = null;
			
			callback(true, Ti.Utils.base64decode(e.base64));
		}
		
		function onError(e) {
			Ti.App.removeEventListener('skinPreviewLoaded', onLoad);
			Ti.App.removeEventListener('skinPreviewFailed', onError);
			
			win.remove(web_preview);
			web_preview = null;
			
			callback(false);
		}
		
		Ti.App.addEventListener('skinPreviewLoaded', onLoad);
		Ti.App.addEventListener('skinPreviewFailed', onError);
		
		var web_preview = Ti.UI.createWebView({
			html: exports.getHtmlForPreview(path, side, 6),
			visible: false
		});
		
		win.add(web_preview);
	};

	exports.getTextFieldRow = function(text, hint, isPassword, isEmail) {
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
			color: (exports.getMajorOsVersion() < 7) ? '#336699' : '#000000',
			right: (exports.isiPad()) ? 20 : 10,
			left: 10,
			top: 5,
			bottom: 5,
			height: 30,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			passwordMask: isPassword,
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			autocorrect: (!isEmail),
			autocapitalization: (isEmail) ? Ti.UI.TEXT_AUTOCAPITALIZATION_NONE : undefined,
			keyboardType: (isEmail) ? Ti.UI.KEYBOARD_EMAIL : undefined
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
	};
	
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
			color: (exports.getMajorOsVersion() < 7) ? '#336699' : '#000000',
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
	};
	
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
	};
	
	exports.getParameterByName = function(params, name) {
	    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(params);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	
	exports.addSkinFromParams = function(params) {
		if(params != null && params.url != null) {
			var skinName = exports.getParameterByName(params.url, 'name'),
				skinDesc = exports.getParameterByName(params.url, 'desc'),
				skinUrl = exports.getParameterByName(params.url, 'url');
				
			if(skinUrl != null && skinUrl.match(/https?:\/\/(.)+.png/) != null) {
				var win_info = Ti.UI.createWindow({
					title: I('addProcess.skinInfo.title'),
					url: '/views/add_process/info.js',
					backgroundImage: exports.getModalBackgroundImage(),
					barColor: exports.getNavColor(),
					translucent: false,
					forceShowCancelButton: true,
					defaultSkinName: skinName,
					defaultSkinDesc: skinDesc,
					skinUrl: skinUrl
				});
				
				navGroup = Ti.UI.iOS.createNavigationWindow({
					window: win_info,
					tintColor: Utils.getBarTintColor()
				});
				
				navGroup.addEventListener('close', function() {			
					navGroup = null;
					win_info = null;
					
					Ti.App.fireEvent('reloadSkins', {});
				});
				
				win_info.navGroup = navGroup;
				
				navGroup.open({
					modal: true,
					modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
				});
			} else {
				alert(I('addProcess.urlSelect.invalidUrl'));
			}
		}
	};
	
})();
