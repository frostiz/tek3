import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

import '../mixins/keepAliveFutureBuilder.dart';
import '../imgurImageManager.dart';
import '../imgurIcons.dart';
import 'viewAlbumPage.dart';
import '../user.dart';
import '../imgurCard.dart';


Future<dynamic> fetchPost(search) async {
  var url = "https://api.imgur.com/3/gallery/search?q=" + search;
  String header;
  if (user.isAuth()) {
    header = 'Bearer ${user.accessToken}';
  } else {
    header = 'Client-ID 947e3dc8d3c3779';
  }
  final response =
      await http.get(url, headers: {HttpHeaders.authorizationHeader: header});

  if (response.statusCode == 200) {
    // If the call to the server was successful, parse the JSON
    final responseJson = json.decode(response.body);
    return await responseJson;
  } else {
    // If that call was not successful, throw an error.
    throw Exception('Failed to load post');
  }
}

class SearchPage extends StatefulWidget {
  @override

  SearchPageState createState() => new SearchPageState();
}

Future<dynamic> post(String url, var body, var headers) async {
  return await http
      .post(Uri.encodeFull(url), body: body, headers: headers)
      .then((http.Response response) {
    final int statusCode = response.statusCode;
    if (statusCode < 200 || statusCode >= 400) {
      throw new Exception(response.reasonPhrase);
    }
    return json.decode(response.body);
  });
}

class SearchPageState extends State<SearchPage> {
  var search = '';
  String selectedUser;
  List<String> users = ["All", "Images", "Animated"];

  Widget _buildCard(imgur) {
    return Card(
        color: Colors.orange,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
        child: ImgurCard(imgur, showVideo: false, showDesc: false, clickableCover: true)
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        appBar: AppBar(
            centerTitle: true,
            backgroundColor: Colors.orange,
            title: new TextField(
                style: new TextStyle(
                  color: Colors.white,
                ),
                decoration: new InputDecoration(
                    prefixIcon: new Icon(Icons.search, color: Colors.white),
                    hintText: "Search...",
                    hintStyle: new TextStyle(color: Colors.white)),
                onSubmitted: (text) {
                  if (text.isEmpty)
                    return "Type your searched tag";
                  else {
                    setState(() {
                      search = text;
                    });
                  }
                }),
            actions: <Widget>[
        new DropdownButton<String>(
                hint: new Text("Add filter"),
        value: selectedUser,
        onChanged: (String newValue) {
          setState(() {
            selectedUser = newValue;
          });
        },
        items: users.map((String user) {
          return new DropdownMenuItem<String>(
            value: user,
            child: new Text(user, style: new TextStyle(color: Colors.black),
            ),
          );
        }).toList(),
      ),
           ],
        ),
        body: Center(
          child: KeepAliveFutureBuilder(
              future: fetchPost(search),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  //var url = "https://imgur.com/";
                  new Container(
                    child: new Column(
                      children: <Widget>[
                      ],
                    ),
                  );

                  return ListView.builder(
                      itemCount: snapshot.data['data'].length,
                      itemBuilder: (context, index) {
                        if (selectedUser == null) {
                                selectedUser = "All";
                        }
                        if (selectedUser == "All") {
                                ImgurImageManager imgur =
                                new ImgurImageManager(
                                        snapshot.data['data'][index]);
                                return new Padding(
                                        padding: const EdgeInsets.only(
                                                bottom: 0.0),
                                        child: this._buildCard(imgur));
                        } else if (selectedUser == "Images") {
                                ImgurImageManager imgur =
                                new ImgurImageManager(
                                        snapshot.data['data'][index]);
                                if (imgur.isAnimated == false) {
                                        return new Padding(
                                                padding: const EdgeInsets.only(
                                                        bottom: 0.0),
                                                child: this._buildCard(imgur));
                                } else {
                                        return new Container();
                                }
                        } else if (selectedUser == "Animated") {
                                ImgurImageManager imgur =
                                new ImgurImageManager(
                                        snapshot.data['data'][index]);
                                if (imgur.isAnimated == true) {
                                        return new Padding(
                                                padding: const EdgeInsets.only(
                                                        bottom: 0.0),
                                                child: this._buildCard(imgur));
                                } else {
                                        return new Container();
                                }
                        }
                      });
                } else {
                  return Container();
                }
              }),
        ),
      ),
    );
  }
}
