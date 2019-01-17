import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

import 'user.dart';
import 'page/viewAlbumPage.dart';
import 'imgurImageManager.dart';
import 'imgurIcons.dart';

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

class ImgurCard extends StatefulWidget {
	ImgurImageManager selectedImgur;
	bool showVideo;
	bool showDesc;
	bool clickableCover;

	ImgurCard(this.selectedImgur, {this.showVideo, this.showDesc, this.clickableCover});

	@override
	createState() => new ImgurCardState();
}

class ImgurCardState extends State<ImgurCard> {

	bool upVoted = false;
	bool downVoted = false;
	bool faved = false;

	void toggleButton(String direction, ImgurImageManager imgur) {
		if (direction == 'up') {
			if (imgur.vote == 'up') {
				imgur.setvote = '';
				if (imgur.ups.contains('K') == false)
					imgur.setups = (int.parse(imgur.ups) - 1).toString();
			} else {
				if (imgur.ups.contains('K') == false)
					imgur.setups = (int.parse(imgur.ups) + 1).toString();
				if (imgur.vote == 'down') {
					if (imgur.downs.contains('K') == false && int.parse(imgur.downs) > 0)
						imgur.setdowns = (int.parse(imgur.downs) - 1).toString();
				}
				imgur.setvote = 'up';

			}
			setState(() {
				upVoted = !upVoted;
				downVoted = false;
			});
		} else if (direction == 'down') {
			if (imgur.vote == 'down') {
				imgur.setvote = '';
				if (imgur.downs.contains('K') == false)
					imgur.setdowns = (int.parse(imgur.downs) - 1).toString();
			} else {
				if (imgur.downs.contains('K') == false)
					imgur.setdowns = (int.parse(imgur.downs) + 1).toString();
				if (imgur.vote == 'up') {
					if (imgur.ups.contains('K') == false && int.parse(imgur.ups) > 0)
						imgur.setups = (int.parse(imgur.ups) - 1).toString();
				}
				imgur.setvote = 'down';
			}
			setState(() {
				downVoted = !downVoted;
				upVoted = false;
			});
		}
	}

	Widget cardTitle(imgur) {
		return Padding(
			child: Text(imgur.title, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
			padding: const EdgeInsets.all(15.0),
		);
	}

	Widget cardCover(context, imgur) {
		if (widget.clickableCover == true) {
			return Padding(
				padding: const EdgeInsets.symmetric(horizontal: 3.0),
				child: SizedBox(
					height: MediaQuery.of(context).size.height * 0.3,
					width: MediaQuery.of(context).size.width,
					child: GestureDetector(
						child: imgur.getCoverWidget(),
						onTap: () {
							Navigator.push(context, MaterialPageRoute(builder: (context) => ViewAlbumPage(imgur)));
						}),
				)
			);
		}
		return Padding(
			padding: const EdgeInsets.symmetric(horizontal: 3.0),
			child: SizedBox(
				height: MediaQuery.of(context).size.height * 0.3,
				width: MediaQuery.of(context).size.width,
				child: widget.showVideo ? imgur.getWidget() : imgur.getCoverWidget()
			),
		);
	}

	void thumbs(ImgurImageManager imgur, direction) {
		String vote = direction;
		bool changeVote = false;

		if (direction == 'up' && imgur.vote == 'up')
			vote = 'veto';
		else if (direction == 'down' && imgur.vote == 'down')
			vote = 'veto';
		else if ((direction == 'up' && imgur.vote == 'down') ||
			(direction == 'down' && imgur.vote == 'up')) {
			vote = 'veto';
			changeVote = true;
		}
		post('https://api.imgur.com/3/gallery/${imgur.data['id']}/vote/$vote', {}, {HttpHeaders.authorizationHeader: 'Bearer ${user.accessToken}'
		}).then((response) {
			if (changeVote == true) {
				post('https://api.imgur.com/3/gallery/${imgur.data['id']}/vote/$direction', {}, {HttpHeaders.authorizationHeader: 'Bearer ${user.accessToken}'})
					.then((response) {
						this.toggleButton(direction, imgur);
				}).catchError((error) {
					print('error: $error');
				});
			} else {
				this.toggleButton(direction, imgur);
			}
		}).catchError((error) {
			print('error: $error');
			Scaffold.of(context).showSnackBar(SnackBar(
				content: new Text('You must be connected to vote'),
				duration: new Duration(seconds: 10),
			));
		});
	}

	void toggleFav(ImgurImageManager imgur) {
		String type = imgur.isAlbum ? 'album' : 'image';
		post('https://api.imgur.com/3/$type/${imgur.data['id']}/favorite', {}, {
			HttpHeaders.authorizationHeader: 'Bearer ${user.accessToken}'
		}).then((response) {
			//print(response);
			setState(() {
				faved = !faved;
				String msg = '';
				if (faved == true)
					msg = 'Image added to favorite';
				else
					msg = 'Image removed from favorite';
				imgur.setfav = faved;
				Scaffold.of(context).showSnackBar(SnackBar(
					content: new Text(msg),
					duration: new Duration(seconds: 10),
				));
			});
		}).catchError((error) {
			print('error: $error');
			Scaffold.of(context).showSnackBar(SnackBar(
				content: new Text('You must be connected to fav'),
				duration: new Duration(seconds: 10),
			));
		});
	}

	List<Widget> showButtons(ImgurImageManager imgur) {
		List<Widget> list = new List<Widget>();

		if (imgur.data['in_gallery'] == true) {
			list.add(Row(
				children: [
					Text(imgur.ups),
					IconButton(
						icon: Icon(ImgurIcons.thumbs_up_alt),
						color: imgur.vote == 'up' ? Colors.green : Colors.white,
						onPressed: () => thumbs(imgur, 'up'),
						tooltip: 'Vote up',
					)
				]
			));
			list.add(Row(
				children: [
					Text(imgur.downs),
					IconButton(
						icon: Icon(ImgurIcons.thumbs_down_alt),
						color: imgur.vote == 'down' ? Colors.red : Colors.white,
						onPressed: () => thumbs(imgur, 'down'),
						tooltip: 'Vote down',
					)
				]
			));
		}
		list.add(
			Row(children: [
				Text(imgur.views),
				IconButton(
					icon: Icon(ImgurIcons.eye),
					color: Colors.white,
					onPressed: () => () {},
					tooltip: 'Number of views',
				)
			]),
		);
		list.add(
			IconButton(
				icon: imgur.fav == true ? Icon(ImgurIcons.heart_broken) : Icon(ImgurIcons.heart),
				color: imgur.fav == true ? Colors.red : Colors.white,
				onPressed: () => this.toggleFav(imgur),
				tooltip: imgur.fav == true ? 'Unfav' : 'Fav',
			)
		);
		return list;
	}

	Widget cardButtons(ImgurImageManager imgur) {
		return Padding(
			padding: const EdgeInsets.symmetric(vertical: 10.0),
			child: Row(
				mainAxisAlignment: MainAxisAlignment.spaceEvenly,
				children: this.showButtons(imgur)
			)
		);
	}

	Widget cardDesc(imgur) {
		if (widget.showDesc == true && imgur.data['description'] != null) {
			return Padding(
				child: Text(imgur.data['description'], style: TextStyle(fontWeight: FontWeight.normal, color: Colors.white)),
				padding: const EdgeInsets.only(left: 15.0, right: 15.0, top: 15.0),
			);
		} else
			return Container();
	}

	@override
	Widget build(BuildContext context) {
		return Column(
			children: <Widget>[
				this.cardTitle(widget.selectedImgur),
				this.cardCover(context, widget.selectedImgur),
				this.cardDesc(widget.selectedImgur),
				this.cardButtons(widget.selectedImgur)
			],
		);
	}
}