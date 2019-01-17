import 'package:flutter/material.dart';
import '../imgurIcons.dart';
import '../imgurImageManager.dart';
import '../imgurCard.dart';

class ViewAlbumPage extends StatefulWidget {
	ImgurImageManager imgur;

	ViewAlbumPage(this.imgur);

	@override
	createState() => new ViewAlbumPageState(imgur);
}

class ViewAlbumPageState extends State<ViewAlbumPage> {
	ImgurImageManager albumImgur;
	ImgurImageManager selectedImgur;

	ViewAlbumPageState(this.albumImgur);

	@override
	void initState() {
		super.initState();

		if (this.albumImgur.data['images'] != null)
			this.selectedImgur = new ImgurImageManager(this.albumImgur.data['images'][0]);
		else
			this.selectedImgur = this.albumImgur;
	}

	Widget horizontalList() {
		List<Widget> list = new List<Widget>();

		if (this.albumImgur.data['images'] != null) {
			var index = 0;
			this.albumImgur.data['images'].map((data) {
				print('data: $data');
			});
			for (var i in this.albumImgur.data['images']) {
				ImgurImageManager inside = new ImgurImageManager(i);

				list.add(
					SizedBox(
						width: MediaQuery.of(context).size.width * 0.5,
						child: GestureDetector(
							child: Card(
								shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
								child: inside.getCoverWidget()
							),
							onTap: () {
								var index = 0;
								for (var j in this.albumImgur.data['images']) {
									if (j['id'] == inside.data['id'])
										setState(() {
											print('new index: $index');
											this.selectedImgur = new ImgurImageManager(this.albumImgur.data['images'][index]);
										});
									index++;
								}
							},
						)
					)
				);
				index++;
			}
		} else {
			list.add(
				SizedBox(
					width: MediaQuery.of(context).size.width * 1.0,
					child: Card(
						color: Colors.white,
						shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
						child: this.albumImgur.getCoverWidget()
					)
				)
			);
		}
		return Container(
			height: 100.0,
			width: MediaQuery.of(context).size.width,
			color: Colors.white,
			child: ListView(
				scrollDirection: Axis.horizontal,
				children: list
			)
		);
	}

	Widget albumPage() {
		return Column(
			mainAxisAlignment: MainAxisAlignment.start,
			children: <Widget>[
				Container(
					//height: 100.0,
					child: this.horizontalList()
				),
				Container(
					width: MediaQuery.of(context).size.width,
					child: Card(
						color: Colors.orange,
						shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
						child: ImgurCard(this.selectedImgur, showVideo: true, showDesc: true, clickableCover: false)
					)
				)
			]
		);
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: Text('${this.albumImgur.title}'),
				backgroundColor: Colors.orange,
			),
			body: this.albumPage()
		);
	}
}