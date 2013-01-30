Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow;
var Utils = require('/includes/utils');

var skinID = Utils.getRandomID();

var progBar = Ti.UI.createProgressBar({
	min: 0,
	max: 100,
	value: 0,
	width: 240,
	message: I('addProcess.process.progress.initial'),
	style: Ti.UI.iPhone.ProgressBarStyle.BAR,
	color: 'white'
});

progBar.show();
win.add(progBar);

var b_done = Ti.UI.createButton({
	title: I('buttons.done'),
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

b_done.addEventListener('click', function(e) {
	win.masterGroup.close(win, {
		animated: false
	});
	win.masterGroup.close(win.prevWins[1], {
		animated: false
	});
	win.masterGroup.close(win.prevWins[0], {
		animated: false
	});
});

Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID).createDirectory();
downloadSkin(win.skinUrl, skinID);

function downloadSkin(url) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			progBar.setValue(30);
			downloadPreview('front');
		},
		onerror: function(e) {
			Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID).deleteDirectory(true);
			alert(I('addProcess.process.error.skin'));
			progBar.setValue(0);
			progBar.setMessage(I('addProcess.process.progress.fail'));
			win.setRightNavButton(b_done);
		}
	});

	xhr.open('GET', url);
	xhr.setFile(Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/skin.png'));

	progBar.setMessage(I('addProcess.process.progress.skin'));
	progBar.setValue(10);
	xhr.send();
}

function downloadPreview(side) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			if (side == 'front') {
				progBar.setValue(60);
				downloadPreview('back');
			} else {
				progBar.setValue(90);
				registerSkinToDatabase();
			}
		},
		onerror: function() {
			var dialog_continue = Ti.UI.createAlertDialog({
				title: I('addProcess.process.error.preview.title'),
				message: I('addProcess.process.error.preview.message'),
				buttonNames: [I('addProcess.process.error.preview.cancel'), I('addProcess.process.error.preview.ok')],
				cancel: 0
			});

			dialog_continue.addEventListener('click', function(e) {
				if (e.index == 1) {
					registerSkinToDatabase();
				} else {
					progBar.setValue(0);
					progBar.setMessage(I('addProcess.process.progress.fail'));
					Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID).deleteDirectory(true);
					win.setRightNavButton(b_done);
				}
			});

			dialog_continue.show();
		},
		ondatastream: function(e) {
			progBar.setMessage(I('addProcess.process.progress.preview'));
		}
	});

	var output = Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/' + side + '.png');
	xhr.open('GET', 'http://apps.outadoc.fr/skinswitch/skinpreview.php?side=' + side + '&url=' + win.skinUrl);
	xhr.setFile(output);
	xhr.send();
	progBar.setMessage(I('addProcess.process.progress.preview'));
}

function registerSkinToDatabase() {
	progBar.setMessage(I('addProcess.process.progress.database'));
	progBar.setValue(90);

	var db = Ti.Database.open('skins');

	db.execute('INSERT INTO skins (id, name, description, timestamp) VALUES (?, ?, ?, ?)', skinID, win.skinName, win.skinDesc, String(new Date().getTime()));
	db.close();

	progBar.setMessage(I('addProcess.process.progress.success'));
	progBar.setValue(100);
	win.setRightNavButton(b_done);
}