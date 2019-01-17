import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'secondTagPage.dart';

Future<dynamic> fetchPost() async {
        var url = "https://api.imgur.com/3/tags";
        final response =
        await http.get(url, headers: {HttpHeaders.authorizationHeader: "Client-ID 947e3dc8d3c3779"},);

        if (response.statusCode == 200) {
                // If the call to the server was successful, parse the JSON
                final responseJson = json.decode(response.body);
                return await responseJson;
        } else {
                // If that call was not successful, throw an error.
                throw Exception('Failed to load post');
        }
}

class TagPage extends StatefulWidget {
        @override
        TagPageState createState() => new TagPageState();
}

class TagPageState extends State<TagPage> {
        var url = "https://imgur.com/";
        var search = "";
        @override
        Widget build(BuildContext context) {
                return Container(
                        child: Scaffold(
                                body: Center(
                                        child: FutureBuilder<dynamic>(
                                                future: fetchPost(),
                                                builder: (context, snapshot) {
                                                        if (snapshot.hasData) {
                                                                return ListView.builder(
                                                                        itemCount: snapshot.data['data']['tags'].length,
                                                                        itemBuilder: (context, index) {
                                                                                var newurl = url + snapshot.data['data']['tags'][index]['background_hash'] + ".jpg";
                                                                                return new Container(
                                                                                        height: 75.0,
                                                                                        decoration: BoxDecoration(
                                                                                                image: DecorationImage(
                                                                                                        image: CachedNetworkImageProvider(newurl),
                                                                                                        fit: BoxFit.cover,
                                                                                                ),
                                                                                                border: Border.all(
                                                                                                        color: Colors.black,
                                                                                                        width: 0.0,
                                                                                                ),
                                                                                        ),
                                                                                        child: new Column(
                                                                                                mainAxisAlignment: MainAxisAlignment.center,
                                                                                                children: <Widget>[
                                                                                                        RaisedButton(
                                                                                                                onPressed:(){
                                                                                                                        search = snapshot.data['data']['tags'][index]['name'];
                                                                                                                        print(search);
                                                                                                                        Navigator.push(
                                                                                                                                context,
                                                                                                                                MaterialPageRoute(builder: (context) => SecondTagPage(search))
                                                                                                                        );
                                                                                                                },
                                                                                                                child: Text(snapshot.data['data']['tags'][index]['name']),
                                                                                                                color: Colors.blueGrey,
                                                                                                                splashColor: Colors.red
                                                                                                        ),
                                                                                                ],
                                                                                        ),
                                                                                );
                                                                        }
                                                                );
                                                        } else if (snapshot.hasError) {
                                                                return Text("${snapshot.error}");
                                                        }
                                                        // By default, show a loading spinner
                                                        return CircularProgressIndicator();
                                                },
                                        ),
                                ),
                        ),
                );
        }
}