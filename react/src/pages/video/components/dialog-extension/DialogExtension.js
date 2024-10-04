import React, { Component } from 'react';
import './DialogExtension.css';

export default class DialogExtensionComponent extends Component {
    constructor(props) {
        super(props);
        this.openviduExtensionUrl =
            'https://chrome.google.com/webstore/detail/openvidu-screensharing/lfcgfepafnobdloecchnfaclibenjold';

        this.state = {
            isInstalled: false,
        };

        this.goToChromePage = this.goToChromePage.bind(this);
        this.onNoClick = this.onNoClick.bind(this);
        this.refreshBrowser = this.refreshBrowser.bind(this);
    }

    onNoClick() {
        this.props.cancelClicked();
    }

    goToChromePage() {
        window.open(this.openviduExtensionUrl);
        this.setState({ isInstalled: true });
    }

    refreshBrowser() {
        window.location.reload();
    }

    render() {
        return (
            <div>
                {this.props && this.props.showDialog ? (
                    <div id="dialogExtension">
                        <div className="card">
                            <div className="card-content">
                                <p className="text-secondary">Hello</p>
                                <p className="text-secondary">
                                    You need to install this Chrome extension and refresh the browser to share your screen.
                                </p>
                            </div>
                            <div className="card-actions">
                                <button className="action-button" onClick={this.onNoClick}>
                                    Cancel
                                </button>
                                <button className="action-button" onClick={this.goToChromePage}>
                                    Install
                                </button>
                                {this.state.isInstalled ? (
                                    <button className="action-button" onClick={this.refreshBrowser}>
                                        Refresh
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
