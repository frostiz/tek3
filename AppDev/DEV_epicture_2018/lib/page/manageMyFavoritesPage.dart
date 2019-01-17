import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

import '../imgurImageManager.dart';
import '../mixins/keepAliveFutureBuilder.dart';
import '../user.dart';
import '../imgurCard.dart';

class ManageMyFavoritesPage extends StatefulWidget {
	@override
	createState() => new ManageMyFavoritesPageState();
}

Future<dynamic> get(String url, var body, var accessToken) async {
	final response = await http.get(Uri.encodeFull(url), headers: {"Accept":"application/json", "Authorization":"Bearer $accessToken"});

	final int statusCode = response.statusCode;
	if (statusCode < 200 || statusCode >= 400) {
		throw new Exception(response.reasonPhrase);
	}
	final responseJson = json.decode(response.body);
	return await responseJson;
}

class ManageMyFavoritesPageState extends State<ManageMyFavoritesPage> {

	List _data = new List();

	void getFavoritesPage() {
		get('https://api.imgur.com/3/account/${user.username}/favorites/', {}, user.accessToken).then((response) {
			setState(() {
				List tmp = new List();
				for (var i in response['data']) {
					tmp.add(i);
				}
				this._data = tmp;
			});
		}).catchError((error) {
			print('error: $error');
		});
	}

	@override
	void initState() {
		super.initState();
		this.getFavoritesPage();
	}

	_addEntry(pageSize, pageNumber) async {
		return List.generate(pageSize, (index) {
			if (index + (pageSize * pageNumber) < _data.length){
				return _data[index + (pageSize * pageNumber)];
			}
			return null;
		});
	}

	Widget _buildPage(List pageData) {
		return ListView(
			shrinkWrap: true,
			primary: false,
			children: pageData.map((data) {
				if (data == null)
					return Container();

				ImgurImageManager imgur = new ImgurImageManager(data);

				return Card(
					color: Colors.orange,
					shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
					child: ImgurCard(imgur, showVideo: false, showDesc: false, clickableCover: true)
				);
			}).toList(),
		);
	}

	Widget favoritesPage() {
		var pageSize = 5;
		return ListView.builder(
			padding: const EdgeInsets.only(top: 5.0),
			itemCount: (_data.length / pageSize).ceil() ,
			itemBuilder: (context, pageNumber) {
				return KeepAliveFutureBuilder(
					future: this._addEntry(pageSize, pageNumber),
					builder: (context, snapshot) {
						switch (snapshot.connectionState) {
							case ConnectionState.none:
							case ConnectionState.waiting:
								return SizedBox(
									height: MediaQuery.of(context).size.height,
									child: Padding(
										padding: EdgeInsets.only(top: 10.0),
										child: Align(
											alignment: Alignment.topCenter,
											child: CircularProgressIndicator()
										)
									)
								);
							case ConnectionState.done:
								if (snapshot.hasError) {
									return Text('Error: ${snapshot.error}');
								} else {
									if (snapshot.hasData) {
										var pageData = snapshot.data;

										return this._buildPage(pageData);
									}
								}
								break;
							default:
								break;
						}
					},
				);
			});
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: Text('Manage my favorites'),
				backgroundColor: Colors.orange,
			),
			body: favoritesPage()
		);
	}
}