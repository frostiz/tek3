var NavMenu = React.createClass({
    componentDidMount: function() {
        let _this = this;
        $('.services li').on('click', function() {
            let value = $(this).data('component-name');
            $('.services li').removeClass("active");
            $(this).addClass("active");
            _this.props.updateState({component: value});//setState({component: value});
        });
    },
    render: function() {
        return (
            <aside className="menu-sidebar d-none d-md-block">
                <div className="logo">
                    <a href="#">
                        <img src="/home/images/icon/logo.png" alt="Cool Admin" />
                    </a>
                </div>
                <div className="menu-sidebar__content js-scrollbar1">
                    <nav className="navbar-sidebar">
                        <ul className="list-unstyled navbar__list services">
                            <li className="active has-sub" data-component-name="index">
                                <a className="js-arrow" href="#"><i className="fas fa-tachometer-alt"></i>Dashboard</a>
                            </li>
                            <li className="service" id="twitter" data-component-name="twitter">
                                <a href="#"><i className="fas fa-table"></i>Twitter</a>
                            </li>
                            <li className="service" id="youtube" data-component-name="youtube">
                                <a href="#"><i className="fas fa-calculator"></i>Youtube</a>
                            </li>
                            <li className="service" id="weather" data-component-name="weather">
                                <a href="#"><i className="fas fa-copy"></i>Weather</a>
                            </li>
                            <li className="service" id="hogwarts" data-component-name="hogwarts">
                                <a href="#"><i className="fas fa-copy"></i>Hogwarts</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        );
    }
});

var Header = React.createClass({

    getInitialState: function() {
        return { username: "" };
    },

    componentDidMount: function() {
        this.loadUsername();
    },


    loadUsername: function () {
        $.ajax({
            url: this.props.baseUrl + "/auth/user",
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            success: function(obj) {
                let username = "";
                if (obj.user.facebook) {
                    username = obj.user.facebook.name;
                } else if (obj.user.google) {
                    username = obj.user.google.name;
                } else if (obj.user.local) {
                    username = obj.user.local.username;
                } else if (obj.user.twitter) {
                    username = obj.user.twitter.displayName;
                }
                this.setState({ username: username });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.baseUrl + "/auth/user", status, err.toString());
            }.bind(this)
        });
    },
    addWidgetForm: function () {
        if ($("#addWidgetForm").is(':visible')) {
            $("#addWidgetForm").css('display', 'none');
        } else if ($("#addWidgetForm").html() !== "") {
            $("#addWidgetForm").css('display', 'flex');
        }
    },
    logout: function() {
        window.location = '/logout';
    },
    render: function() {
        return (
            <header className="header-desktop">
                <div className="section__content section__content--p30">
                    <div className="container-fluid">
                        <div className="header-wrap">
                            <div>
                                <button type="button" className="btn btn-primary" onClick={this.addWidgetForm}>Ajouter un widget</button>
                                <button type="button" className="btn btn-primary m-l-20" onClick={this.logout}>Logout</button>
                            </div>
                            <div className="header-button">
                                <div className="account-wrap">
                                    <div className="account-item clearfix">
                                        <div className="image">
                                            <img src="/home/images/icon/avatar-01.jpg" alt="John Doe"/>
                                        </div>
                                        <div className="content">
                                            <a className="" href="#">{this.state.username}</a>
                                        </div>
                                        <div className="account-dropdown">
                                            <div className="info clearfix">
                                                <div className="image">
                                                    <a href="#">
                                                        <img src="/home/images/icon/avatar-01.jpg" alt="John Doe"/>
                                                    </a>
                                                </div>
                                                <div className="content">
                                                    <h5 className="name">
                                                        <a href="#">{this.state.username}</a>
                                                    </h5>
                                                    <span className="email">johndoe@example.com</span>
                                                </div>
                                            </div>
                                            <div className="account-dropdown__body">
                                                <div className="account-dropdown__item">
                                                    <a href="#"><i className="zmdi zmdi-account"></i>Account</a>
                                                </div>
                                                <div className="account-dropdown__item">
                                                    <a href="#"><i className="zmdi zmdi-settings"></i>Setting</a>
                                                </div>
                                            </div>
                                            <div className="account-dropdown__footer">
                                                <a href="/logout"><i className="zmdi zmdi-power"></i>Logout</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
});

var Dashboard = React.createClass({
    componentDidMount: function() {
    },
    updateWeatherState: function(obj) {
        this.childWeather.setState({data: this.childWeather.getData().concat([obj.data])});
        this.childWeather.setWidgets(this.childWeather.getData().slice(-1));
    },
    updateHogwartsState: function(obj) {
        this.childHogwarts.setState({data: this.childHogwarts.getData().concat([obj.data])});
        this.childHogwarts.setWidgets(this.childHogwarts.getData().slice(-1));
    },
    updateYoutubeState: function(obj) {
        this.childYoutube.setState({data: this.childYoutube.getData().concat([obj.data])});
        this.childYoutube.setWidgets(this.childYoutube.getData().slice(-1));
    },
    updateTwitterState: function(obj) {
        this.childTwitter.setState({data: this.childTwitter.getData().concat([obj.data])});
        this.childTwitter.setWidgets(this.childTwitter.getData().slice(-1));
    },
    loadComponent: function() {
        let array = [
            ["index",       <Index/>                                ],
            ["twitter",     <Twitter ref={instance => {this.childTwitter = instance}} baseUrl={this.props.baseUrl} loadWidgets={this.loadWidgets}/> ],
            ["youtube",     <Youtube ref={instance => {this.childYoutube = instance}} baseUrl={this.props.baseUrl} loadWidgets={this.loadWidgets}/> ],
            ["weather",     <Weather ref={instance => {this.childWeather = instance}} baseUrl={this.props.baseUrl} loadWidgets={this.loadWidgets}/> ],
            ["hogwarts",     <Hogwarts ref={instance => {this.childHogwarts = instance}} baseUrl={this.props.baseUrl} loadWidgets={this.loadWidgets}/> ]
        ];
        for (var i in array) {
            if (array[i][0] === this.props.component)
                return array[i][1];
        }
        return ("");
    },
    loadWidgets: function(service, endUrl, callback) {
        let _this = this;

        $.ajax({
            url: _this.props.baseUrl + endUrl,
            dataType: 'json',
            data: JSON.stringify({
                service: service
            }),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            cache: false,
            success: function (obj) {
                callback(obj);
            }.bind(_this),
            error: function (xhr, status, err) {
                console.error(_this.props.baseUrl + "/loadWidgets", status, err.toString());
            }.bind(_this)
        });
    },
    render: function() {
        return (
            <div className="main-content">
                <div className="section__content section__content--p30">
                    {this.loadComponent()}
                </div>
            </div>
        );
    }
});

var Page = React.createClass({
    getInitialState: function() {
        return {component: "index"};
    },
    componentDidMount: function() {
    },
    updateState: function(value) {
        this.setState(value);
    },
    hideWidgetForm: function() {
        if ($("#addWidgetForm").is(':visible')) {
            $("#addWidgetForm").css('display', 'none');
        }
    },
    reloadWidgets: function(service, endUrl, callback) {
        this.childDashboard.loadWidgets(service, endUrl, callback);
    },
    updateWeatherState: function(obj) {
        this.childDashboard.updateWeatherState(obj);
    },
    updateHogwartsState: function(obj) {
        this.childDashboard.updateHogwartsState(obj);
    },
    updateYoutubeState: function(obj) {
        this.childDashboard.updateYoutubeState(obj);
    },
    updateTwitterState: function(obj) {
        this.childDashboard.updateTwitterState(obj);
    },
    loadWidgetForm: function() {
        let array = [
            ["twitter",     <TwitterForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateTwitterState={this.updateTwitterState}/> ],
            ["youtube",     <YoutubeForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateYoutubeState={this.updateYoutubeState}/> ],
            ["weather",     <WeatherForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateWeatherState={this.updateWeatherState}/> ],
            ["hogwarts",     <HogwartsForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateHogwartsState={this.updateHogwartsState}/> ]
        ];
        for (var i in array) {
            if (array[i][0] === this.state.component)
                return (
                    <div className="">
                        <form className="addWidgetForm">
                            <div className="row">
                                <div className="col-12">
                                    <div className="au-card position-relative p-b-10">
                                        <div className="btnCloseContainer">
                                            <button type="button" className="close" onClick={this.hideWidgetForm}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <p>Select a widget :</p>
                                        {array[i][1]}
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                );
        }
        return ("");
    },
    loadModifyWidgetForm: function() {
        /*let array = [
            ["twitter",     <TwitterForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateTwitterState={this.updateTwitterState}/> ],
            ["youtube",     <YoutubeForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateYoutubeState={this.updateYoutubeState}/> ],
            ["weather",     <WeatherForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateWeatherState={this.updateWeatherState}/> ],
            ["hogwarts",     <HogwartsForm baseUrl={this.props.baseUrl} component={this.state.component} hideWidgetForm={this.hideWidgetForm} reloadWidgets={this.reloadWidgets} updateHogwartsState={this.updateHogwartsState}/> ]
        ];
        for (var i in array) {
            if (array[i][0] === this.state.component)
                return (
                    <div className="">
                        <form className="modifyWidgetForm">
                            <div className="row">
                                <div className="col-12">
                                    <div className="au-card position-relative p-b-10">
                                        <div className="btnCloseContainer">
                                            <button type="button" className="close" onClick={this.hideWidgetForm}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <p>Modify this widget :</p>
                                        {array[i][1]}
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                );
        }*/
        return ("");
    },
    render: function() {
        return (
            <div>
                <NavMenu updateState={this.updateState}></NavMenu>
                <div className="page-container">
                    <Header component={this.state.component} baseUrl={this.props.baseUrl}></Header>
                    <Dashboard ref={instance => {this.childDashboard = instance}} component={this.state.component} baseUrl={this.props.baseUrl}></Dashboard>
                </div>
                <div id="addWidgetForm">
                    {this.loadWidgetForm()}
                </div>
                <div id="modifyWidgetForm">
                    {this.loadModifyWidgetForm()}
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Page baseUrl="http://localhost:8080"/>,
    document.getElementById('reactContainer')
);