(function() {

	exports.getRandomID = function() {
		return String(Math.floor(Math.random() * 98765862));
	}

	exports.getSkinsDir = function() {
		Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
		return Titanium.Filesystem.getApplicationDataDirectory() + 'skins/';
	}

	exports.getBGImage = function() {
		if(exports.isiPhone()) {
			return '/img/bg.png';
		} else if(exports.isiPad()) {
			return '/img/block_stonebrick.png';
		}
	}

	exports.getNavColor = function() {
		return '#888888';
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
			height: 480
		});

		var view = Ti.UI.createView({
			height: 60,
			width: 60,
			borderRadius: 10,
			backgroundColor: 'black',
			opacity: 0.6
		});

		win.add(view);

		var spinWheel = Ti.UI.createActivityIndicator({
			style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
		});

		view.add(spinWheel);
		spinWheel.show();

		return win;
	}

	exports.getTextFieldRow = function(text, hint) {
		var row = Ti.UI.createTableViewRow({
			title: text,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});

		var textfield = Ti.UI.createTextField({
			hintText: hint,
			color: '#336699',
			height: 30,
			right: 5,
			width: I('addProcess.skinInfo.fieldWidth'),
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
		});
		
		row.add(textfield);
		return row;
	}
	
	exports.getTextAreaRow = function(text) {
		var row = Ti.UI.createTableViewRow({
			title: text,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
			height: 100
		});

		var textarea = Ti.UI.createTextArea({
			color: '#336699',
			height: Ti.UI.FILL,
			right: 10,
			width: I('addProcess.skinInfo.fieldWidth'),
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
			font: {
				fontSize: 15
			}
		});

		row.add(textarea);
		return row;
	}
	
})();
