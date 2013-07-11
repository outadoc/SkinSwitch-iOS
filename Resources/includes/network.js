(function() {
	
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

	exports.uploadSkin = function(skinData, ipad_win) {
		var dialog_wear = Ti.UI.createAlertDialog({
			title: I('main.skinUpload.confirm.title'),
			message: I('main.skinUpload.confirm.message', skinData.name),
			buttonNames: [I('main.skinUpload.confirm.cancel'), I('main.skinUpload.confirm.okay')],
			cancel: 0
		});

		dialog_wear.show();

		dialog_wear.addEventListener('click', function(e) {
			if(e.index == 1) {
				prog_upload.show();
				win.setTitleControl(prog_upload);

				var xhr_login = Ti.Network.createHTTPClient({
					onload: function() {
						//when login xhr loaded
						if(this.getResponseHeader('Location').indexOf('minecraft.net/login') != -1) {
							exports.triggerError('login', this);
						} else {
							var xhr_skin = Ti.Network.createHTTPClient({
								onload: function() {
									//when skin upload xhr loaded
									if(this.getResponseHeader('Location').indexOf('minecraft.net/login') != -1) {
										//login error
										exports.triggerError('login', this);
									} else if(this.getResponseHeader('Location').indexOf('minecraft.net/challenge') != -1) {
										//identity check
										var xhr_challenge = Ti.Network.createHTTPClient({
											onload: function(e) {
												try {
													var question = this.getResponseText().match(/<label for="answer">(.*)<\/label>/)[1],
														questionID = this.getResponseText().match(/<input type="hidden" name="questionId" value="([0-9]+)" \/>/)[1];
													
													var win_answer = Ti.UI.createWindow({
														url: '/views/identity_confirm.js',
														question: question,
														questionID: questionID,
														triggerError: exports.triggerError,
														title: I('addProcess.process.challenge.title'),
														backgroundImage: Utils.getModalBackgroundImage(),
														backgroundRepeat: true,
														barColor: Utils.getNavColor()
													});
													
													win.setTitleControl(null);
													
													win_answer.addEventListener('close', function() {
														//freeing the memory
														win_answer = null;
													});
													
													win_answer.open({
														modal: true,
														modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
													});
												} catch(e) {
													exports.triggerError('challenge');
												}
											},
											onerror: function(e) {
												exports.triggerError('challenge');
											},
											autoRedirect: false
										});
										
										xhr_challenge.open('GET', 'http://minecraft.net/challenge');
										xhr_challenge.send(null);
									} else {
										//no problem, conclude
										prog_upload.setMessage(I('main.progressBar.success'));
										prog_upload.setValue(100);

										setTimeout(function() {
											win.setTitleControl(null);
										}, 1000);
									}
								},
								onerror: function() {
									exports.triggerError('upload', this);
								},
								autoRedirect: false
							});

							prog_upload.setMessage(I('main.progressBar.upload'));
							prog_upload.setValue(30);

							xhr_skin.open('POST', 'http://minecraft.net/profile/skin');
							xhr_skin.setRequestHeader('enctype', 'multipart/form-data');
							xhr_skin.setRequestHeader('Content-Type', 'image/png');

							xhr_skin.send({
								skin: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinData.id + '/skin.png').read()
							});
						}
					},
					onerror: function(e) {
						exports.triggerError('server', this);
						Ti.API.info(e);
					},
					autoRedirect: false,
					validatesSecureCertificate: false
				});

				prog_upload.setMessage(I('main.progressBar.login'));
				prog_upload.setValue(3);

				xhr_login.open('POST', 'https://minecraft.net/login');
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
							remember: 'false'
						});
					});
				});
			}
		});
	}
	
	exports.triggerError = function(type, xhr) {
		var alert_error = Ti.UI.createAlertDialog({
			title: I('main.skinUpload.error.title'),
			message: I('main.skinUpload.error.' + type)
		});

		alert_error.show();

		prog_upload.setMessage(I('main.progressBar.' + type + 'Fail'));
		prog_upload.setValue(0);

		setTimeout(function() {
			win.setTitleControl(null);
		}, 1000);
	}

})(); 