import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../imgurImageManager.dart';
import '../imgurCard.dart';

Future<dynamic> fetchPost(search) async {
	var url = "https://api.imgur.com/3/gallery/t/" + search;
	final response =
	await http.get(url, headers: {HttpHeaders.authorizationHeader: "Client-ID 947e3dc8d3c3779"},);

	if (response.statusCode == 200) {
		final responseJson = json.decode(response.body);
		return await responseJson;
	}
	else {
		throw Exception('Failed to load post');
	}
}

class SecondTagPage extends StatefulWidget {
	final String search;// = '';
	SecondTagPage(this.search);

	@override
	SecondTagPageState createState() => new SecondTagPageState(this.search);
}

class SecondTagPageState extends State<SecondTagPage> {
	String search = '';
	SecondTagPageState(this.search);

	Widget _tagPageBuilder() {
		return FutureBuilder<dynamic>(
			future: fetchPost(this.search),
			builder: (context, snapshot) {
				if (snapshot.hasData) {
					var url = "https://imgur.com/";
					return ListView.builder(
						itemCount: snapshot.data['data']['items'].length,
						itemBuilder: (context, index) {
							ImgurImageManager imgur = new ImgurImageManager(snapshot.data['data']['items'][index]);

							return Card(
								color: Colors.orange,
								shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
								child: ImgurCard(imgur, showVideo: false, showDesc: false, clickableCover: true)
							);
						},
					);
				}
				else if (snapshot.hasError)
					return Text('${snapshot.error}');
				return CircularProgressIndicator();
			},
		);
	}

	@override
	Widget build(BuildContext context) {
		return Container(
			child: Scaffold(
				appBar: AppBar(
					title: Text('Tag: $search'),
					backgroundColor: Colors.orange
				),
				body: Center(
					child: _tagPageBuilder()
				),
			),
		);
	}
}