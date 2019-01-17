var Index = React.createClass({
    chooseService: function() {
        $('.choose-service input[type="checkbox"]').each(function() {
            if ($(this).is(':checked'))
                $(".service#" + $(this).attr('value')).show("slide");
            else
                $(".service#" + $(this).attr('value')).hide("slide");
        })
    },
    componentDidMount: function() {

    },
    render: function() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="center col-12 offset-md-4 col-md-4">
                        <div className="au-card choose-service">
                            <p className="m-b-10">Veuillez choisir vos services : </p>
                            <input type="checkbox" className="m-r-5" name="Twitter" value="twitter"/>Twitter<br/>
                            <input type="checkbox" className="m-r-5" name="Youtube" value="youtube"/>Youtube<br/>
                            <input type="checkbox" className="m-r-5" name="Weather" value="weather"/>Weather<br/>
                            <input type="checkbox" className="m-r-5" name="Hogwarts" value="hogwarts"/>Hogwarts<br/>
                            <div className="text-center">
                                <button type="button" className="btn btn-primary m-t-35" onClick={this.chooseService}>Valider</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="copyright">
                            <p>Copyright © 2018 Colorlib. All rights reserved. Template by <a href="https://colorlib.com">Colorlib</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});