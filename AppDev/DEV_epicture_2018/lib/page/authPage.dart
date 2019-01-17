import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'dart:convert';
import 'dart:async';
import 'dart:core';
import 'dart:io' as io;
import 'package:path/path.dart' as path;

import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';

import 'viewMyPhotosPage.dart';
import 'manageMyFavoritesPage.dart';
import '../user.dart';

class AuthPage extends StatefulWidget {
	@override
	AuthPageState createState() => new AuthPageState();
}

Future<dynamic> post(String url, var body) async {
	return await http.post(Uri.encodeFull(url), body: body, headers: {"Accept":"application/json"})
		.then((http.Response response) {
			final int statusCode = response.statusCode;
			if (statusCode < 200 || statusCode >= 400) {
				throw new Exception(response.reasonPhrase);
			}
			return json.decode(response.body);
		});
}

class AuthPageState extends State<AuthPage> {
	final _authUrl = 'https://api.imgur.com/oauth2/authorize?client_id=d099d7222acbc08&response_type=pin';
	final _scaffoldKey = GlobalKey<ScaffoldState>();
	bool isAuthenticating = false;
	bool isAuth = user.isAuth();
	bool authError = false;

	FlutterWebviewPlugin flutterWebviewPlugin = new FlutterWebviewPlugin();
	StreamSubscription<String> _onUrlChanged;
	StreamSubscription<WebViewStateChanged> _onStateChanged;

	io.File _image;

	void _authenticate(String pinCode) {
		var body = {
			'client_id': 'd099d7222acbc08',
			'client_secret': '408850fb562e5cb9abe9c8c174f7709616b7d277',
			'grant_type': 'pin',
			'pin': pinCode
		};
		post('https://api.imgur.com/oauth2/token', body).then((res) {
			user.accountId = res['account_id'].toString();
			user.username = res['account_username'];
			user.accessToken = res['access_token'];
			user.refreshToken = res['refresh_token'];

			setState(() {
				_onUrlChanged.cancel();
				_onStateChanged.cancel();
				flutterWebviewPlugin.close();
				//flutterWebviewPlugin.dispose();
				isAuth = true;
			});
		}).catchError((error) {
			setState(() {
				_onUrlChanged.cancel();
				_onStateChanged.cancel();
				flutterWebviewPlugin.close();
				//flutterWebviewPlugin.dispose();
				user.reset();
				isAuth = false;
				isAuthenticating = false;
				authError = true;
			});
			new Timer(const Duration(milliseconds: 100), () {
				print(_scaffoldKey.currentState);
				_scaffoldKey.currentState.showSnackBar(
					SnackBar(
						content: new Text('Failed to connect: $error'),
						duration: new Duration(seconds: 10),
					)
				);
			});
			print('catched error : $error');
		});
	}

	Future _pickImage() async {
		var image = await ImagePicker.pickImage(source: ImageSource.gallery);

		setState(() {
			this._image = image;
		});

		Dio dio = new Dio();

		FormData formdata = new FormData();

		formdata.add('image', new UploadFileInfo(this._image, path.basename(this._image.path)));

		Map<String, dynamic> headers = new Map<String, dynamic>();

		headers['Authorization'] =

		dio.post('https://api.imgur.com/3/image', data: formdata, options: Options(
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ${user.accessToken}'
			},
			contentType: io.ContentType.parse('multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gw'),
			responseType: ResponseType.JSON
		))
		.then((response) {
			print(response);
			Scaffold.of(context).showSnackBar(
				SnackBar(
					content: new Text('Uploaded image'),
					duration: new Duration(seconds: 10),
				)
			);

		}).catchError((error) {
			Scaffold.of(context).showSnackBar(
				SnackBar(
					content: new Text('Failed to upload image'),
					duration: new Duration(seconds: 10),
				)
			);
			print(error);
		});
	}
	void _upload() {
		this._pickImage();
	}
	void _viewMyPhotos() {
		Navigator.push(context, MaterialPageRoute(builder: (context) => ViewMyPhotosPage()));
	}
	void _manageMyFavorites() {
		Navigator.push(context, MaterialPageRoute(builder: (context) => ManageMyFavoritesPage()));
	}
	void _logout() {
		user.reset();
		setState(() {
			this.isAuthenticating = false;
			this.isAuth = false;
		});
	}
	Widget isAuthPage() {
		return SafeArea(
			child: Center(
				child: Column(
					mainAxisAlignment: MainAxisAlignment.center,
					children: <Widget>[
						Padding(
							padding: const EdgeInsets.only(bottom: 40.0),
							child: Text(
								'Welcome\n${user.username}',
								textAlign: TextAlign.center,
								style: TextStyle(fontFamily: 'Myriad', height: 0.8, fontSize: 46.0, fontWeight: FontWeight.w100, color: Colors.black87)
							)
						),
						RaisedButton(
							padding: const EdgeInsets.all(8.0),
							textColor: Colors.white,
							color: Colors.orange,
							onPressed: this._viewMyPhotos,
							child: Text('View my photos')
						),
						RaisedButton(
							padding: const EdgeInsets.all(8.0),
							textColor: Colors.white,
							color: Colors.orange,
							onPressed: this._manageMyFavorites,
							child: Text('Manage my favorites')
						),
						RaisedButton(
							padding: const EdgeInsets.all(8.0),
							textColor: Colors.white,
							color: Colors.orange,
							onPressed: this._upload,
							child: Text('Upload an image')
						),
						RaisedButton(
							padding: const EdgeInsets.all(8.0),
							textColor: Colors.white,
							color: Colors.orange,
							onPressed: this._logout,
							child: Text('Log out')
						)
					]
				)
			)
		);
	}

	Widget authenticatingPage() {
		_onUrlChanged = flutterWebviewPlugin.onUrlChanged.listen((String url) {
			if (mounted) {
				var urlData = url.split('?');

				var href = urlData[0];
				var query = urlData[1];

				if (href == 'https://api.imgur.com/oauth2/pin' && query.contains('pin=')) {
					var args = query.split('&');

					for (String arg in args) {
						if (arg.substring(0, 4) == 'pin=') {
							String pinCode = arg.split('=')[1];
							if (pinCode.isNotEmpty)
								this._authenticate(pinCode);
						}
					}
				}
			}
		});
		_onStateChanged = flutterWebviewPlugin.onStateChanged.listen((WebViewStateChanged state) {
				if (mounted) {
					if (state.type == WebViewState.finishLoad) {
						var baseUrl = state.url.split('?')[0];
						if (baseUrl == 'https://api.imgur.com/oauth2/authorize')
							flutterWebviewPlugin.show();
					} else if (state.type == WebViewState.startLoad) {
						var baseUrl = state.url.split('?')[0];
						if (baseUrl == 'https://api.imgur.com/oauth2/pin')
							flutterWebviewPlugin.hide();
					}
				}
		});
		flutterWebviewPlugin.launch(
			_authUrl,
			//comment for production
			//clearCache: true,
			//clearCookies: true,
			hidden: true,
			rect: new Rect.fromLTWH(0.0, 0.0, MediaQuery.of(context).size.width, MediaQuery.of(context).size.height)
		);
		return SafeArea(child:Center(child: CircularProgressIndicator()));
	}

	void _submit() {
		setState(() {
			isAuthenticating = true;
		});
	}
	Widget notAuthPage() {
		return Scaffold(
			backgroundColor: Colors.grey[50],
			resizeToAvoidBottomPadding: false,
			key: _scaffoldKey,
			body: SafeArea(
				child:Center(
					child: Column(
						mainAxisAlignment: MainAxisAlignment.center,
						children: <Widget>[
							Padding(
								padding: const EdgeInsets.only(left: 30.0, right: 30.0, bottom: 10.0),
								child: Text('To get access to more features of this app, you should authenticate yourself', textAlign: TextAlign.center)
							),
							RaisedButton(
								padding: const EdgeInsets.all(8.0),
								textColor: Colors.white,
								color: Colors.orange,
								splashColor: Colors.red,
								onPressed: this._submit,
								child: Text('Auth with imgur')
							)
						]
					)
				)
			)
		);
	}

	@override
	Widget build(BuildContext context) {
		if (user.isAuth())
			return isAuthPage();
		if (isAuthenticating)
			return this.authenticatingPage();
		return notAuthPage();
	}
}