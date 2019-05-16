import {Meteor} from "meteor/meteor";
import React from "react";
import {Button, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";
import {ChevronRight} from "mdi-material-ui";
// import {join} from "path";
// import {existsSync} from "fs";
import url from "url";
import SseBranding from "../common/SseBranding";
import AccountsUIWrapper from "../common/AccountsUIWrapper";
import SseNavigatorMenu from "./SseNavigatorMenu";
// import configurationFile from "./config";

export default class SseNavigatorToolbar extends React.Component {

    constructor() {
        super();
        this.state = {breadcrumb: []}
    }

    componentDidMount() {
        this.updateBreadCrumb();
        
    }

    updateBreadCrumb()
    {
        var basepath = "/browse/0/20/"
        if(Meteor.userId()) // && existsSync(join(configurationFile.imagesFolder, Meteor.userId())))
        {
            Meteor.call("isAutorized", params.path, fi, ti, (err, res) => 
            {
                if (res)
                {
                    if(res.autorstate)
                    {
                        basepath += '%2F' + Meteor.userId()
                    }
                    else
                    {
                        basepath += '%2Fnotautorized'
                    }
                }
                else
                {
                    basepath += '%2Fnotautorized'
                }
            });
           
        }
        else
        {
            basepath += '%2Fnotautorized'
        }

        const du = url.parse(document.URL);

        {
            let bd = du.pathname.replace(/\/browse\/.*\/.*\//, "").split("%2F");

            let res = [{name: "Home", browseUrl: basepath}];
            let data;

            bd.forEach(itm => {
                    if (itm != "") {
                        data = {name: itm, browseUrl: ""};
                        for (let i = 0; i < bd.length; i++) {

                            data.browseUrl += (i > 0 ? "/" : "") + bd[i];
                            if (bd[i] == itm) {
                                break;
                            }
                        }
                        data.browseUrl = encodeURIComponent(data.browseUrl);
                        res.push(data)
                    }
                }
            );
            this.setState({breadcrumb: res});
        }
    }

    componentWillReceiveProps() {
        this.updateBreadCrumb();
    }

    render() {
        let baseUrl = "";
        if (document.URL.includes("/browse/"))
            baseUrl = document.URL.match(/(\/browse\/[0-9]+\/[0-9]+\/)/)[1].replace(/browse\/[0-9]+/, "browse/0");
        return (
            <Toolbar className="sse-toolbar no-shrink hflex">
                <SseBranding/>
                <AccountsUIWrapper />
                <div className="hflex  grow">
                    {this.state.breadcrumb.map((bi, idx) => (
                        <div key={bi.browseUrl + idx} className="hflex flex-align-items-center">
                            {idx > 0 ? <ChevronRight/> : null}
                            <Link className="breadcrumb"
                                  to={idx > 0 ? baseUrl + bi.browseUrl : bi.browseUrl}>
                                <Button>{bi.name}</Button>
                            </Link>
                        </div>
                    ))}
                </div>
                
                <SseNavigatorMenu history={this.props.history}/>
            </Toolbar>
        );
    }
}

