function uploadSkin(id, name) {
	Ti.API.debug('clicked wear button for id ' + id);

	var dialog_wear = Ti.UI.createAlertDialog({
		title: 'Replace skin ?',
		message: 'Do you really want to replace your skin with "' + name + '" ?',
		buttonNames: ['Cancel', 'Okay'],
		cancel: 1
	});

	dialog_wear.show();

	dialog_wear.addEventListener('click', function(e) {
		if(e.index == 1) {
			var prog_upload = Ti.UI.createProgressBar({
				min: 0,
				max: 100,
				value: 0,
				color: 'white',
				width: 150,
				font: {
					fontSize: 14
				},
				style: Titanium.UI.iPhone.ProgressBarStyle.BAR
			});

			prog_upload.show();
			win.setTitleControl(prog_upload);

			var xhr_login = Ti.Network.createHTTPClient({
				onload: function() {
					Ti.API.debug('login succeeded, status code ' + this.getStatus());
					Ti.API.debug('page tried to redirect to ' + this.getResponseHeader('Location'));

					var xhr_skin = Ti.Network.createHTTPClient({
						onload: function() {
							Ti.API.debug('uploaded skin, status code ' + this.getStatus());
							Ti.API.debug('page tried to redirect to ' + this.getResponseHeader('Location'));

							prog_upload.setMessage(I('main.progressBar.success'));
							prog_upload.setValue(100);

							setTimeout(function() {
								win.setTitleControl(null);
							}, 1000);
						},
						onerror: function() {
							Ti.API.debug('failed to upload skin, error ' + this.getStatus());

							prog_upload.setMessage(I('main.progressBar.uploadFail'));
							prog_upload.setValue(0);

							setTimeout(function() {
								win.setTitleControl(null);
							}, 1000);
						},
						autoRedirect: false
					});

					prog_upload.setMessage(I('main.progressBar.upload'));
					prog_upload.setValue(30);

					xhr_skin.open('POST', 'http://www.minecraft.net/profile/skin');
					xhr_skin.setRequestHeader('enctype', 'multipart/form-data');
					xhr_skin.setRequestHeader('Content-Type', 'image/png');

					xhr_skin.send({
						skin: Ti.Filesystem.getFile(getSkinsDir() + id + '/skin.png').read()
					});
				},
				onerror: function() {
					Ti.API.debug('login failed, error ' + this.getStatus());

					prog_upload.setMessage(I('main.progressBar.loginFail'));
					prog_upload.setValue(0);

					setTimeout(function() {
						win.setTitleControl(null);
					}, 1000);
				},
				autoRedirect: false,
				validatesSecureCertificate: false
			});

			prog_upload.setMessage(I('main.progressBar.login'));
			prog_upload.setValue(3);

			xhr_login.open('POST', 'https://www.minecraft.net/login');
			xhr_login.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			var keychain = require('clearlyinnovative.keychain');

			keychain.getForKey({
				key: 'username',
				serviceName: Ti.App.getId()
			}, function(data) {
				var username = data.value;
				keychain.getForKey({
					key: 'password',
					serviceName: Ti.App.getId()
				}, function(data) {
					var password = data.value;
					xhr_login.send({
						username: username,
						password: password,
						remember: 'true'
					});
				});
			});
		}
	});
}
