var Twitter = React.createClass({
    getInitialState: function() {
        return {data: []}
    },
    componentDidMount: function() {
        let _this = this;

        _this.props.loadWidgets("twitter", "/loadWidgets", function(data) {
            _this.setState({data: data});
            _this.setWidgets(_this.state.data);
        });

        $('.sortable').sortable();
        $('.sortable').disableSelection();
    },
    componentWillUnmount: function() {
        this.state.data.forEach(function(item) {
            clearInterval(item.intervalId);
        });
    },
    getData: function() {
        return this.state.data;
    },
    getRoute: function(widgetName) {
        let array = [
            ['post-message', 'twitpost'],
            ['search-tweets', 'twitsearch'],
            ['check-follower-number', 'twituser']
        ];
        for (var i in array) {
            if (array[i][0] === widgetName) {
                return array[i][1];
            }
        }
    },
    getParam: function(widgetName, params, id) {
        let array = [
            ['search-tweets', {field: params.field, number: params.number, id: id}],
            ['post-message', {field: params.message, id: id}],
            ['check-follower-number', {field: params.field, id: id}]
        ];
        for (var i in array) {
            if (array[i][0] === widgetName) {
                return array[i][1];
            }
        }
    },
    setWidgets: function(array) {
        let _this = this;
        array.forEach(function(item) {
            item.intervalId = setInterval(function() {
                axios.post(_this.props.baseUrl + '/' + _this.getRoute(item.name),
                    _this.getParam(item.name, item.param, item._id)
                ).then(function (data) {
                    var params = JSON.parse(data.config.data);

                    _this.setState((state) => {
                        let j = 0;
                        for (j in state.data) {
                            if (state.data[j]._id == params.id) {
                                state.data[j].result = data;
                                break;
                            }
                        }
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }, item.refreshTime);
        });
    },
    deleteWidget: function(e) {
        let id = e.target.getAttribute('data-widget-id');
        let _this = this;
        axios.post(this.props.baseUrl + '/deleteWidget', {
            id: id
        }).then(function(response) {
            let params = JSON.parse(response.config.data);
            _this.setState((state) => {
                for (let j in state.data) {
                    if (state.data[j]._id == params.id) {
                        clearInterval(state.data[j].intervalId);
                        state.data.splice(j, 1);
                        break;
                    }
                }
            });
        }).catch(function(error) {
            console.log(error);
        })
    },
    modifyWidgetForm: function(e) {

        console.log('Clicked on ' + e.target.getAttribute('data-widget-id'));
    },
    showWidgets: function() {
        const listItem = this.state.data.map((elem, index) => {
            if (elem.name === 'search-tweets') {
                let subList;
                if (elem.result && elem.result.data) {
                    subList = elem.result.data.data.map((subElem, index) => {
                        return (
                            <a href={subElem} key={index}>{subElem}</a>
                        );
                    });
                }
                return (
                    <div key={index} className="col-md-4 col-sm-12 m-b-15 ui-state-default">
                        <div className="au-card">
                            <div className="btnSettingsContainer">
                                <button type="button" className="btnSettings" onClick={this.modifyWidgetForm} data-widget-id={elem._id}>
                                    <i className="zmdi zmdi-settings"></i>
                                </button>
                            </div>
                            <div className="btnCloseContainer btnDeleteWidget">
                                <button type="button" className="close" onClick={this.deleteWidget} data-widget-id={elem._id}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            { !elem.result && <p>Loading...</p>}
                            { elem.result && <p>{subList}</p>}
                            <p>Widget ID: {elem._id}</p>
                            <p>Widget Name: {elem.name}</p>
                            <p>Refresh time: {elem.refreshTime}</p>
                            <p>Param: {JSON.stringify(elem.param)}</p>
                        </div>
                    </div>
                )
            } else if (elem.name === 'post-message') {
                return (
                    <div key={index} className="col-md-4 col-sm-12 m-b-15 ui-state-default">
                        <div className="au-card">
                            <div className="btnSettingsContainer">
                                <button type="button" className="btnSettings" onClick={this.modifyWidgetForm} data-widget-id={elem._id}>
                                    <i className="zmdi zmdi-settings"></i>
                                </button>
                            </div>
                            <div className="btnCloseContainer btnDeleteWidget">
                                <button type="button" className="close" onClick={this.deleteWidget} data-widget-id={elem._id}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            { !elem.result && <p>Loading...</p>}
                            { elem.result && <p>{elem.result.data.message}</p>}
                            <p>Widget ID: {elem._id}</p>
                            <p>Widget Name: {elem.name}</p>
                            <p>Refresh time: {elem.refreshTime}</p>
                            <p>Param: {JSON.stringify(elem.param)}</p>
                        </div>
                    </div>
                )
            } else if (elem.name === 'check-follower-number') {
                return (
                    <div key={index} className="col-md-4 col-sm-12 m-b-15 ui-state-default">
                        <div className="au-card">
                            <div className="btnSettingsContainer">
                                <button type="button" className="btnSettings" onClick={this.modifyWidgetForm} data-widget-id={elem._id}>
                                    <i className="zmdi zmdi-settings"></i>
                                </button>
                            </div>
                            <div className="btnCloseContainer btnDeleteWidget">
                                <button type="button" className="close" onClick={this.deleteWidget} data-widget-id={elem._id}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            { !elem.result && <p>Loading...</p>}
                            { elem.result && <p>{elem.result.data.message}</p>}
                            <p>Widget ID: {elem._id}</p>
                            <p>Widget Name: {elem.name}</p>
                            <p>Refresh time: {elem.refreshTime}</p>
                            <p>Param: {JSON.stringify(elem.param)}</p>
                        </div>
                    </div>
                )
            }
        });
        return (
            <div className="row sortable">
                {listItem}
            </div>
        );
    },
    render: function() {
        return (
            <div>
                {this.showWidgets()}
            </div>
        );
    }
});

var PostMessageFields = React.createClass({
    statics: {
        getFields: function() {
            return JSON.stringify({
                message: 'message'
            });
        }
    },
    render: function() {
        return (
            <div>
                <div>
                    <input className="au-input w-100" id="message" placeholder="Make a tweet..." type="text"/>
                </div>
            </div>
        );
    }
});

var SearchTweetsFields = React.createClass({
    statics: {
        getFields: function() {
            return JSON.stringify({
                field: 'search',
                number: 'fieldNumber'
            });
        }
    },
    render: function() {
        return (
            <div>
                <label htmlFor="fieldNumber">number of tweets:
                    <select id="fieldNumber" name="fieldNumber" className="m-l-20">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
                <div>
                    <input className="au-input w-100" id="search" placeholder="Search for tweets..." type="text"/>
                </div>
            </div>
        );
    }
});

var CheckFollowerNumberFields = React.createClass({
    statics: {
        getFields: function() {
            return JSON.stringify({
                field: 'twitterUsername'
            });
        }
    },
    render: function() {
        return (
            <div>
                <div>
                    <input className="au-input w-100" id="twitterUsername" placeholder="Enter twitter @username..." type="text"/>
                </div>
            </div>
        );
    }
});

var TwitterForm = React.createClass({
    loadFields: function() {
        let array = [
            ["post-message", <PostMessageFields />],
            ["search-tweets", <SearchTweetsFields />],
            ["check-follower-number", <CheckFollowerNumberFields />]
        ];
        let value = this.state.option;

        for (var i in array) {
            if (array[i][0] === value) {
                return array[i][1];
            }
        }
        return (<p></p>);
    },
    getInitialState: function () {
        return ({option: "post-message"})
    },
    componentDidMount: function() {

    },
    handleSelect: function(e) {
        this.setState({option: e.target.value});
    },
    addWidget: function() {
        let array = [
            ["post-message", PostMessageFields.getFields()],
            ["search-tweets", SearchTweetsFields.getFields()],
            ["check-follower-number", CheckFollowerNumberFields.getFields()]
        ];
        for (var i in array) {
            if (array[i][0] === this.state.option) {
                let obj = JSON.parse(array[i][1]);
                let param = {};
                for (var j in obj) {
                    param[j] = $('#' + obj[j]).val();
                    if (param[j] === undefined || param[j] === '')
                        return false;
                }
                let refreshTime = document.getElementById('refreshTime').value;
                if (refreshTime < 250)
                    return false;
                let data = {
                    service: this.props.component,
                    widget: this.state.option,
                    param: param,
                    refreshTime: refreshTime
                };
                let _this = this;
                axios.post(this.props.baseUrl + "/addWidget",
                    {data: data})
                    .then(function (response) {
                        _this.props.hideWidgetForm();
                        _this.props.updateTwitterState(response.data);
                    })
                    .catch(function (xhr, status) {
                        console.error(_this.props.baseUrl + "/addWidget", status, xhr);
                    });
            }
        }
    },
    render: function() {
        return (
            <div>
                <select className="selectWidget m-b-10" onChange={this.handleSelect}>
                    <option value="post-message">Make a tweet</option>
                    <option value="search-tweets">Search tweets</option>
                    <option value="check-follower-number">Get follower number</option>
                </select>
                <div className="m-b-10">
                    <input type="number" min="1000" max="60000" step="100" id="refreshTime" name="refreshTime" className="au-input w-100" placeholder="Enter refresh time (in milliseconds)"/>
                </div>
                {this.loadFields()}
                <div className="text-center p-t-20">
                    <button type="button" className="btn btn-primary" onClick={this.addWidget}>OK</button>
                </div>
            </div>
        );
    }
});