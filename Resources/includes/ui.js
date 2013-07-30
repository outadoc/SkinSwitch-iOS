(function() {
		
	exports.createSkinFrame = function(skinData, ipad_win) {
		var view = Ti.UI.createView({
			top: 10,
			width: 98,
			height: 100,
			skinData: skinData,
			layout: 'vertical'
		}),
		
		backgroundFrame = Ti.UI.createImageView({
			image: '/img/itemframe.png',
			width: 72,
			height: 72
		}),
		
		headPreview = Ti.UI.createImageView({
			image: (skinData == null) ? '/img/plus_sign.png' : exports.getHeadFromSkinID(skinData.id),
			top: 15,
			left: 15,
			right: 15,
			bottom: 15
		}),
		
		title = Ti.UI.createLabel({
			text: (skinData == null) ? I('main.addSkin') : skinData.name,
			top: 3,
			width: 75,
			height: 20,
			font: {
				fontSize: (skinData == null) ? 10 : 12,
				fontFamily: 'Minecraftia'
			},
			color: 'white',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		
		backgroundFrame.add(headPreview);
		view.add(backgroundFrame);
		view.add(title);
		
		if(skinData != null) {
			var startTimestamp = 0,
				wasCanceled = false,
			
			anim_normal = Ti.UI.createAnimation({
				transform: Ti.UI.create2DMatrix({
					rotate: 0,
					scale: 1
				}),
				duration: 300
			}),
			
			anim_maxout = Ti.UI.createAnimation({
				transform: Ti.UI.create2DMatrix({
					rotate: 180,
					scale: 1.5
				}),
				curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
				duration: 1000
			}); 
			
			anim_maxout.addEventListener('complete', function(e) {
				startTimestamp = 0;
				headPreview.animate(anim_normal);
				
				if(!wasCanceled) {
					Network.uploadSkin(skinData, ipad_win);
				}
				
				wasCanceled = false;
			});

			backgroundFrame.addEventListener('touchstart', function(e) {	
				wasCanceled = false;			
				startTimestamp = (new Date).getTime();
				headPreview.animate(anim_maxout);
			});
			
			backgroundFrame.addEventListener('touchend', function(e) {
				headPreview.animate(anim_normal);
				
				if((new Date).getTime() - startTimestamp < 300) {
					if(Utils.isiPad()) {
						exports.displayiPadSkinDetails(skinData, ipad_win);
					} else {
						var win = exports.createiPhoneDetailWindow(skinData),
		
						anim = Ti.UI.createAnimation({
							transform: Ti.UI.create2DMatrix({
								scale: 1.1
							}),
							duration: 200
						});
			
						anim.addEventListener('complete', function() {
							win.animate({
								transform: Ti.UI.create2DMatrix({
									scale: 1.0
								}),
								duration: 200
							});
						});
			
						win.open(anim);
					}
				}
				
				wasCanceled = true;
				startTimestamp = 0;
			});
			
			backgroundFrame.addEventListener('touchcancel', function(e) {
				headPreview.animate(anim_normal);
				wasCanceled = true;
				startTimestamp = 0;
			});
		} else {
			backgroundFrame.addEventListener('click', function(e) {
				Database.beginSkinAdditionProcess();
			});
		}
		
		return view;
	}
	
	exports.getHeadFromSkinID = function(skinID) {
		var croppedHead;
		
		try {
			croppedHead = Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/front.png').read().imageAsCropped({
				height: 42,
				width: 42,
				x: 21,
				y: 0
			});
		} catch(e) {
			croppedHead = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + '/img/char_front.png').read().imageAsCropped({
				height: 42,
				width: 42,
				x: 21,
				y: 0
			});
		}
		
		return croppedHead;
	}
	
	exports.createSkinsShowcaseView = function(skins, ipad_win) {
		var container = Ti.UI.createView({
			layout: 'horizontal',
		  	left: 13,
		  	top: 13,
		  	bottom: 13,
		  	right: 13,
		  	height: Ti.UI.FILL
		}), i;
		
		if(skins.length > 0 && !Ti.App.Properties.getBool('hasShownWearTip', false)) {
			var view_longpress_tip = Ti.UI.createView({
				height: Ti.UI.SIZE,
				width: Ti.UI.FILL,
				top: 0,
				bottom: 10,
				left: 10,
				right: 10
			}),
			
			lbl_tip_text = Ti.UI.createLabel({
				text: '\u21B3' + I('main.tips.wear'),
				color: 'white',
				font: {
					fontSize: 16,
					fontFamily: 'Helvetica Neue'
				},
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE
			});
			
			view_longpress_tip.add(lbl_tip_text);
			container.add(view_longpress_tip);
			
			Ti.App.Properties.setBool('hasShownWearTip', true);
		}
		
		if(Utils.isiPad()) {
			container.addEventListener('click', function(e) {
				if(e.source == container) {
					Utils.closeiPadSkinDetails(ipad_win);
				}
			});
		}
		
		if(skins == null || skins.length == 0) {
			container.add(exports.createSkinFrame(null, ipad_win));
		}
		
		for(i = 0; i < skins.length; i ++) {
			container.add(exports.createSkinFrame(skins[i], ipad_win));
		}
		
		return container;
	}
	
	exports.createiPhoneDetailWindow = function(skinData) {
		var win = Ti.UI.createWindow({
			transform: Ti.UI.create2DMatrix({
				scale: 0
			})
		});
		
		function closeDetailWin() {
			win.close({
				transform: Ti.UI.create2DMatrix({
					scale: 0
				}),
				duration: 300
			});
		}
		
		win.addEventListener('click', function(e) {
			if(e.source == win) {
				closeDetailWin();
			}
		});
		
		win.addEventListener('close', function() {
			win = null;
		});
		
		var containerView = Ti.UI.createView({
			height: (Ti.Platform.displayCaps.platformHeight >= 568) ? 400 : 355,
			width: 300,
			backgroundColor: '#f2f2f2',
			borderWidth: 2,
			borderColor: 'gray',
			borderRadius: 10,
			layout: 'vertical'
		}),
		
		skinInfoView = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			height: containerView.height - 45,
			contentWidth: Ti.UI.FILL,
		  	contentHeight: Ti.UI.SIZE,
		  	showVerticalScrollIndicator: true,
		  	layout: 'vertical'
		}),
		
		skinTitle = Ti.UI.createLabel({
			text: skinData.name,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: 21,
				fontFamily: 'HelveticaNeue-Light'
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 25
		}),
		
		skinView = exports.createSkinPreview(skinData.id),
		
		descriptionTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.description'),
			font: {
				fontSize: 17,
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		}),
		
		skinDescription = Ti.UI.createLabel({
			text: (skinData.desc != '') ? skinData.desc : '-',
			font: {
				fontSize: 15,
			},
			color: 'lightGray',
			top: 5,
			left: 20,
			right: 20
		}),
		
		timestampTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.creation'),
			font: {
				fontSize: 17,
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		}),
		
		skinTimestamp = Ti.UI.createLabel({
			text: (new Date(skinData.time)).toLocaleDateString(),
			font: {
				fontSize: 15,
			},
			color: 'lightGray',
			top: 5,
			bottom: 20,
			left: 20,
			right: 20,
			height: 20
		}),
		
		actionView = Ti.UI.createView({
			bottom: 0,
			top: 0,
			height: 44,
			width: Ti.UI.FILL,
			layout: 'horizontal',
			borderColor: 'lightGray',
			borderWidth: 1,
		}),
		
		b_delete = Ti.UI.createButton({
			image : '/img/delete_grey.png',
			width: 44,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		}),
		
		b_edit = Ti.UI.createButton({
			image : '/img/edit_grey.png',
			width: 44,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		}),
		
		b_wear = Ti.UI.createButton({
			title: I('main.skinDetails.wear'),
			width: 120,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		}),
		
		b_close = Ti.UI.createButton({
			title: I('buttons.close'),
			width: 89,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		});
		
		b_close.addEventListener('click', function(e) {
			closeDetailWin();
		});
		
		b_edit.addEventListener('click', function(e) {
			var edit_win = Ti.UI.createWindow({
				url: '/views/add_process/info.js',
				skinIDToEdit: skinData.id,
				title: I('editSkin.title'),
				backgroundImage: Utils.getModalBackgroundImage(),
				barColor: Utils.getNavColor()
			});

			edit_win.addEventListener('close', updateSkinsList);
			
			edit_win.open({
				modal: true
			});
			
			closeDetailWin();
		});
		
		b_delete.addEventListener('click', function(e) {
			closeDetailWin();
			Database.deleteSkin(skinData);
		});
		
		b_wear.addEventListener('click', function(e) {
			closeDetailWin();
			Network.uploadSkin(skinData);
		});
		
		win.add(containerView);
		containerView.add(skinInfoView);
		
		skinInfoView.add(skinTitle);
		skinInfoView.add(exports.createHorizontalSeparator('lightGray'));
		skinInfoView.add(skinView);
		
		skinInfoView.add(descriptionTitle);
		skinInfoView.add(skinDescription);
		
		skinInfoView.add(timestampTitle);
		skinInfoView.add(skinTimestamp);
		
		containerView.add(actionView);
		
		actionView.add(b_delete);
		actionView.add(exports.createVerticalSeparator('lightGray'));
		actionView.add(b_edit);
		actionView.add(exports.createVerticalSeparator('lightGray'));
		actionView.add(b_wear);
		actionView.add(exports.createVerticalSeparator('lightGray'));
		actionView.add(b_close);

		return win;
	}
	
	exports.displayiPadSkinDetails = function(skinData, win) {
		var skinInfoView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical'
		}),

		skinTitle = Ti.UI.createLabel({
			text: skinData.name,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: 28,
				fontFamily: 'HelveticaNeue-Light'
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 25
		}),
		
		skinView = exports.createSkinPreview(skinData.id),
		
		descriptionTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.description'),
			font: {
				fontSize: 22,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		}),
		
		skinDescription = Ti.UI.createLabel({
			text: (skinData.desc != '') ? skinData.desc : '-',
			font: {
				fontSize: 20,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'lightGray',
			top: 5,
			left: 20,
			right: 20
		}),
		
		timestampTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.creation'),
			font: {
				fontSize: 22,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'gray',
			top: 30,
			left: 20,
			right: 20,
			height: 20
		}),
		
		skinTimestamp = Ti.UI.createLabel({
			text: (new Date(skinData.time)).toLocaleDateString(),
			font: {
				fontSize: 20,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'lightGray',
			top: 5,
			bottom: 20,
			left: 20,
			right: 20,
			height: 20
		}),
		
		b_delete = Ti.UI.createButton({
			image: '/img/delete.png'
		}),
		
		b_edit = Ti.UI.createButton({
			image: '/img/edit.png',
		}),
		
		detail = win.detailContent;
		
		skinView.top = 30;
		
		b_delete.addEventListener('click', function() {
			Utils.closeiPadSkinDetails(win);
			Database.deleteSkin(skinData);
		});

		b_edit.addEventListener('click', function() {
			var edit_win = Ti.UI.createWindow({
				url: '/views/add_process/info.js',
				skinIDToEdit: skinData.id,
				title: I('editSkin.title'),
				backgroundImage: Utils.getModalBackgroundImage(),
				barColor: Utils.getNavColor()
			});

			edit_win.addEventListener('close', updateSkinsList);
			Utils.closeiPadSkinDetails(win);
			
			edit_win.open({
				modal: true,
				modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
			});
		});
		
		skinInfoView.add(skinTitle);
		skinInfoView.add(exports.createHorizontalSeparator('lightGray'));
		skinInfoView.add(skinView);
		
		skinInfoView.add(descriptionTitle);
		skinInfoView.add(skinDescription);
		
		skinInfoView.add(timestampTitle);
		skinInfoView.add(skinTimestamp);

		win.detailWin.remove(detail);
		detail = null;
		
		win.detailContent = Ti.UI.createView({
			layout: 'vertical',
			opacity: 0,
			height: Ti.UI.SIZE,
			top: '10%'
		});

		win.detailContent.add(skinInfoView);

		win.detailWin.setLeftNavButton(b_edit, {animated: true});
		win.detailWin.setRightNavButton(b_delete, {animated: true});

		win.detailWin.add(win.detailContent);
		win.detailContent.animate({
			opacity: 1,
			duration: 300,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN
		});
	}
	
	exports.createVerticalSeparator = function(color) {
		return Ti.UI.createView({
			width: 1,
			height: Ti.UI.FILL,
			backgroundColor: color
		});
	}
	
	exports.createHorizontalSeparator = function(color) {
		return Ti.UI.createView({
			height: 1,
			width: '80%',
			top: 10,
			backgroundColor: color
		});
	}
	
	exports.createSkinPreview = function(skinID) {
		var height = (Utils.isiPad()) ? 300 : 170,
			width = (Utils.isiPad()) ? 150 : 85,
		
		view_skin = Ti.UI.createImageView({
			height: height,
			width: width,
			top: 15,
			bottom: 15
		}),

		img_skin_front = Ti.UI.createImageView({
			defaultImage: '/img/char_front.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/front.png').getNativePath(),
			height: height,
			width: width,
			top: 0,
			left: 0
		}),

		img_skin_back = Ti.UI.createImageView({
			defaultImage: '/img/char_back.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/back.png').getNativePath(),
			height: height,
			width: width,
			top: 0,
			left: 0
		});
		
		view_skin.add(img_skin_front);
		
		//fix bug where you wouldn't be able to click?
		view_skin.addEventListener('click', function(e) {});
		
		img_skin_front.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_back,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});

		img_skin_back.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_front,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});
		
		return view_skin;
	}
	
	/*
	exports.createSkinPreview = function(skinID) {
		var skinPath = Utils.getSkinsDir() + skinID + '/skin.png',
			zoom = (Utils.isiPad()) ? 9 : 5,
		
		view_skin = Ti.UI.createView({
			top: 20,
			height: (Utils.isiPad()) ? 288 : 170,
			width: (Utils.isiPad()) ? 144 : 85
		}),

		web_skin_front = Ti.UI.createWebView({
			height: view_skin.height,
			width: view_skin.width,
			backgroundColor: 'transparent',
			html: Utils.getHtmlForPreview(skinPath, 'front', zoom),
			top: 0,
			left: 0
		}),

		web_skin_back = Ti.UI.createWebView({
			height: view_skin.height,
			width: view_skin.width,
			backgroundColor: 'transparent',
			html: Utils.getHtmlForPreview(skinPath, 'back', zoom),
			top: 0,
			left: 0
		});
		
		view_skin.add(web_skin_front);
		
		//fix bug where you wouldn't be able to click?
		view_skin.addEventListener('click', function(e) {});
		
		web_skin_front.addEventListener('click', function() {
			view_skin.animate({
				view: web_skin_back,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});

		web_skin_back.addEventListener('click', function() {
			view_skin.animate({
				view: web_skin_front,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});
		
		return view_skin;
	}
	*/
	
	exports.createSingleSearchResult = function(skinData, btnCallback) {		
		var view = Ti.UI.createView({
			left: (Utils.isiPad()) ? 20 : 10,
			right: (Utils.isiPad()) ? 20 : 10,
			height: Ti.UI.SIZE,
			borderRadius: 7,
			backgroundGradient: {
				type: 'linear',
				colors: ['#eeeeee', '#e5e5e5']
			},
			skinData: skinData,
			layout: 'vertical'
		}),
		
		lbl_title = Ti.UI.createLabel({
			text: skinData.title,
			left: 10,
			right: 10,
			top: 20,
			height: 20,
			color: '#4f4f4f',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: 18
			}
		}),
		
		lbl_author = Ti.UI.createLabel({
			text: 'by ' + skinData.owner_username,
			color: '#9f9f9f',
			height: 20,
			left: 10,
			right: 10,
			font: {
				fontSize: 15
			},
			textAlign: 'center',
		}),
					
		view_skin = Ti.UI.createView({
			top: 20,
			backgroundImage: '/img/char_front.png',
			height: (Ti.Platform.displayCaps.platformHeight > 480) ? 192 : 160,
			width: (Ti.Platform.displayCaps.platformHeight > 480) ? 96 : 80
		}),
		
		b_add = Ti.UI.createButton({
			title: I('addProcess.search.select'),
			left: 30,
			right: 30,
			height: 35,
			top: 20,
			bottom: 20,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			backgroundColor: '#bfbfbf',
			borderRadius: 8,
			color: '#ffffff',
			selectedColor: '#555555'
		});
		
		//fix bug where you wouldn't be able to click?
		view_skin.addEventListener('click', function(e) {});
				
		view.view_skin = view_skin;
		
		b_add.addEventListener('click', function() {
			btnCallback(skinData);
		});
		
		view.add(lbl_title);
		view.add(lbl_author);
		view.add(view_skin);
		view.add(b_add);
		
		return view;
	}
	
	exports.createLoadingWindow = function() {
		var win = Ti.UI.createWindow({
			width: Ti.UI.FILL,
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
	
})();
