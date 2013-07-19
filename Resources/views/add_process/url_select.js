Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils'),

view = Ti.UI.createView({
	height: Ti.UI.SIZE,
	top: (Utils.isiPad()) ? '20%' : 50,
	layout: 'vertical'
}),

lbl_url = Ti.UI.createLabel({
	width: '90%',
	color: 'white',
	shadowColor: 'darkGray',
	shadowOffset: {
		x: 1,
		y: 1
	},
	font: {
		fontSize: 18
	}
}),

txtfield_url = Ti.UI.createTextField({
	height: 35,
	top: 15,
	width: '90%',
	autocorrect: false,
	keyboardType: Ti.UI.KEYBOARD_URL,
	returnKeyType: Ti.UI.RETURNKEY_DONE,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS
}),

b_next = Ti.UI.createButton({
	title: I('addProcess.next'),
	enabled: false,
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

var b_close = Ti.UI.createButton({
	title: I('buttons.close')
});

b_close.addEventListener('click', function(e) {
	if(win.container != null) {
		win.container.close();
	} else {
		win.close();
	}
});

win.setLeftNavButton(b_close);

if(win.from == 'url') {
	lbl_url.setText(I('addProcess.urlSelect.urlTitle'));
	txtfield_url.setValue('http://');
} else if(win.from == 'username') {
	lbl_url.setText(I('addProcess.urlSelect.pseudoTitle'));
	txtfield_url.setHintText('Notch');
}

txtfield_url.addEventListener('change', function(e) {
	if(e.value == '' || e.value == 'http://') {
		b_next.setEnabled(false);
	} else {
		b_next.setEnabled(true);
	}
});

b_next.addEventListener('click', function(e) {
	var url;

	if(win.from == 'url') {
		if(txtfield_url.getValue().substring(0, 7) != 'http://' && txtfield_url.getValue().substring(0, 7) != 'https://') {
			url = 'http://' + txtfield_url.getValue();
		} else {
			url = txtfield_url.getValue();
		}
	} else if(win.from == 'username') {
		url = 'http://s3.amazonaws.com/MinecraftSkins/' + txtfield_url.getValue() + '.png';
	}
	
	if(url != null && url.match(/https?:\/\/(.)+.png/) != null) {
		var win_info = Ti.UI.createWindow({
			title: I('addProcess.skinInfo.title'),
			url: 'info.js',
			backgroundImage: Utils.getModalBackgroundImage(),
			barColor: Utils.getNavColor(),
			defaultSkinName: (win.from == 'username') ? txtfield_url.getValue() : undefined,
			skinUrl: url
		});
		
		win_info.container = win.container;
		win_info.navGroup = win.navGroup;
		win.navGroup.open(win_info);
	} else {
		alert(I('addProcess.urlSelect.invalidUrl'));
	}
});

win.add(view);
view.add(lbl_url);
view.add(txtfield_url);

win.setRightNavButton(b_next);
txtfield_url.focus();