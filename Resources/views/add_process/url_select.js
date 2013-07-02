Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var Utils = require('/includes/utils');

var view = Ti.UI.createView({
	height: Ti.UI.SIZE
});

win.add(view);

var lbl_url = Ti.UI.createLabel({
	left: 20,
	width: 280,
	color: 'white',
	shadowColor: 'darkGray',
	shadowOffset: {
		x: 1,
		y: 1
	},
	font: {
		fontSize: 18
	}
});

if(win.from == 'url') {
	lbl_url.setText(I('addProcess.urlSelect.urlTitle'));
} else if(win.from == 'pseudo') {
	lbl_url.setText(I('addProcess.urlSelect.pseudoTitle'));
}

view.add(lbl_url);

var txtfield_url = Ti.UI.createTextField({
	height: 35,
	top: 10,
	left: 20,
	width: 280,
	autocorrect: false,
	keyboardType: Ti.UI.KEYBOARD_URL,
	returnKeyType: Ti.UI.RETURNKEY_DONE,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
});

if(win.from == 'url') {
	txtfield_url.setValue('http://');
} else if(win.from == 'pseudo') {
	txtfield_url.setHintText('Notch');
}

view.add(txtfield_url);

var b_next = Ti.UI.createButton({
	title: I('addProcess.next')
});

b_next.addEventListener('click', function(e) {
	var url = txtfield_url.getValue();

	if(url == '' || url == 'http://') {
		alert(I('addProcess.urlSelect.blankField'));
	} else {
		if(win.from == 'url') {
			if(url.substring(0, 7) != 'http://') {
				url = 'http://' + url;
			}
		} else if(win.from == 'pseudo') {
			url = 'http://s3.amazonaws.com/MinecraftSkins/' + url + '.png';
		}

		if(url != null && url.split('.').pop().toLowerCase() == 'png') {
			var win_process = Ti.UI.createWindow({
				title: I('addProcess.process.title'),
				url: 'processing.js',
				backgroundImage: Utils.getBGImage(),
				barColor: Utils.getNavColor(),
				backgroundRepeat: true,

				skinUrl: url,
				skinName: win.skinName,
				skinDesc: win.skinDesc,
				from: win.from
			});
			if(Utils.isiPad()) {
				win_process.masterGroup = win.masterGroup;
				win_process.prevWins = [win.prevWins[0], win];
				win.masterGroup.open(win_process);
			} else {
				win_process.container = win.container;
				win.navGroup.open(win_process);
			}
		} else {
			alert(I('addProcess.urlSelect.invalidUrl'));
		}
	}
});

win.setRightNavButton(b_next);
txtfield_url.focus();