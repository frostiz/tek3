import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:chewie/chewie.dart';
import 'package:video_player/video_player.dart';

class ImgurImageManager {
	var _data;
	bool _isAlbum;
	var _imageData;
	bool _isAnimated;
	String _link;
	String _title;
	String _ups;
	String _downs;
	String _views;
	String _type;
	String _vote;
	bool _fav;

	ImgurImageManager(this._data) {
		this.__isAlbum();
		this.__getImageData();
		this.__isAnimated();
		this.__getLink();
		this.__getTitle();
		this.__getUpsAndDowns();
		this.__getViews();
		this.__getType();
		this.__getVote();
		this.__getFav();
		//print(_data);
		//print('on recoit vote = ${_data['vote']} pour ${_title} nombre de haters:$_downs, nombre de mec bien: $_ups');
		//print(_imageData);
	}

	bool __isAlbum() {
		if (_data != null && _data['is_album'] != null && _data['is_album'] == true) {
			this._isAlbum = true;
		} else {
			this._isAlbum = false;
		}
	}

	__getImageData() {
		if (this._isAlbum == true) {
			var found = false;
			for (var i in _data['images']) {
				if (i['id'] != null && _data['cover'] != null && i['id'] == _data['cover']) {
					this._imageData = i;
					found = true;
					break;
				}
			}
			if (found == false)
				this._imageData = _data['images'][0];
		} else {
			this._imageData = _data;
		}
	}

	bool __isAnimated() {
		this._isAnimated = this._imageData['animated'];
		if (this._isAnimated == null)
			this._isAnimated = false;
	}

	String __getLink() {
		if (this._isAnimated == true) {
			if (this._imageData['mp4'] != null && this._imageData['type'] != 'image/gif')
				this._link = _imageData['mp4'];
			else
				this._link = _imageData['link'];
		} else
			this._link = _imageData['link'];
	}

	Widget getWidget() {
		if (this._isAnimated && this._type != 'image/gif') {
			print('Manager: print video : ${this._link}');
			return new Chewie(
				new VideoPlayerController.network(this._link),
				aspectRatio: 3 / 2,
				autoPlay: false,
				autoInitialize: true,
				looping: true
				//placeholder: Center(child: new CircularProgressIndicator())
			);
		} else {
			return new CachedNetworkImage(
				imageUrl: this._link,
				placeholder: Center(child: new CircularProgressIndicator()),
				errorWidget: new Icon(Icons.error),
				fadeInDuration: new Duration(seconds: 1),
				fadeOutDuration: new Duration(seconds: 1),
				fit: BoxFit.fitHeight
			);
		}
	}

	Widget getCoverWidget() {
		String newLink = this._link;
		if (this._link.substring(this._link.length - 4, this._link.length) == '.mp4') {
			newLink = this._link.replaceFirst('.mp4', '.jpeg');
		}
		return new CachedNetworkImage(
			imageUrl: newLink,
			placeholder: Center(child: new CircularProgressIndicator()),
			errorWidget: new Icon(Icons.error),
			fadeInDuration: new Duration(seconds: 1),
			fadeOutDuration: new Duration(seconds: 1),
			fit: BoxFit.cover
		);
	}

	String __getTitle() {
		if (this._data['in_gallery'] == true && this._data['title'] != null)
			this._title = this._data['title'];
		else if (this._data['name'] != null)
			this._title = this._data['name'];
		else
			this._title = 'Untitled';
	}

	void __getUpsAndDowns() {
		if (this._imageData['ups'] != null && this._imageData['downs'] != null) {
			//print(this._imageData['ups']);
			//print(this._imageData['downs']);
			this._ups = (this._imageData['ups']).toString();
			this._downs = this._imageData['downs'].toString();
		} else if (this._data['ups'] != null && this._data['downs'] != null) {
			//print(this._data['ups']);
			//print(this._data['downs']);
			this._ups = (this._data['ups']).toString();
			this._downs = this._data['downs'].toString();
		} else {
			this._ups = 'NaN';
			this._downs = 'NaN';
		}
		if (this._ups != 'NaN' && int.parse(this._ups) >= 1000) {
			this._ups = (int.parse(this._ups) / 1000).toStringAsFixed(1) + 'K';
		}
		if (this._downs != 'NaN' && int.parse(this._downs) >= 1000) {
			this._downs = (int.parse(this._downs) / 1000).toStringAsFixed(1) + 'K';
		}
	}

	void __getViews() {
		if (this._data['views'] != null) {
			//print('views: ${this._data['views']}');
			this._views = this._data['views'].toString();
		} else if (this._imageData['views'] != null) {
			//print('views: ${this._imageData['views']}');
			this._views = this._imageData['views'].toString();
		} else {
			this._views = 'NaN';
		}
		if (this._views != 'NaN' && int.parse(this._views) >= 1000) {
			this._views = (int.parse(this._views) / 1000).toStringAsFixed(1) + 'K';
		}
	}

	void __getType() {
		this._type = this._imageData['type'];
	}

	void __getVote() {
		if (this._data['vote'] != null)
			this._vote = this._data['vote'];
		else
			this._vote = '';
	}

	void __getFav() {

	}

	/*bool getFav() {
		if (this._data['favorite'])
			return this._data['favorite'];
		else
			return false;
	}*/

	String get link => _link;
	bool get isAnimated => _isAnimated;
	get imageData => _imageData;
	bool get isAlbum => _isAlbum;
	String get title => _title;
	String get ups => _ups;
	String get downs => _downs;
	String get views => _views;
	get data => _data;
	String get vote => _vote;
	bool get fav => _fav;

	set setvote(String value) {_vote = value;}
	set setdowns(String value) {_downs = value;}
	set setups(String value) {_ups = value;}
	set setfav(bool value) {_fav = value;}
}