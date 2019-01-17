import 'package:flutter/material.dart';
import 'page/authPage.dart';
import 'page/searchPage.dart';
import 'page/tagPage.dart';

class Home extends StatefulWidget {
	@override
	State<StatefulWidget> createState() {
		return _HomeState();
	}
}

class _HomeState extends State<Home> {
	int _currentIndex = 0;
	final List<Widget> _children = [
		AuthPage(),
		SearchPage(),
		TagPage()
	];

	void onTabTapped(int index) {
		setState(() {
			_currentIndex = index;
		});
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			body: _children[_currentIndex],
			bottomNavigationBar: Theme(
				data: Theme.of(context).copyWith(
					canvasColor: Colors.grey[50],
					primaryColor: Colors.black87,
					splashColor: Colors.red,
					textTheme: Theme.of(context).textTheme.copyWith(caption: new TextStyle(color: Colors.black38))
				),
				child: BottomNavigationBar(
					currentIndex: _currentIndex,
					onTap: onTabTapped, // new
					items: [
						BottomNavigationBarItem(
							icon: new Icon(Icons.home),
							title: new Text('Home'),
						),
						BottomNavigationBarItem(
							icon: new Icon(Icons.search),
							title: new Text('Search'),
						),
						BottomNavigationBarItem(
						    	icon: Icon(Icons.person),
						    	title: Text('Tags'),
						)
					],
				)
			)
		);
	}
}