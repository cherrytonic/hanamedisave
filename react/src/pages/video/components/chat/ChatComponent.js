import React, { Component } from 'react';
import './ChatComponent.css';

export default class ChatComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            message: '',
        };
        this.chatScroll = React.createRef();
        let hospitalName = this.props.hospitalName ? this.props.hospitalName : 'Unknown Hospital';
        this.handleChange = this.handleChange.bind(this);
        this.handlePressKey = this.handlePressKey.bind(this);
        this.close = this.close.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        this.props.user.getStreamManager().stream.session.on('signal:chat', (event) => {
            const data = JSON.parse(event.data);
            let messageList = this.state.messageList;
            messageList.push({ connectionId: event.from.connectionId, nickname: data.nickname, message: data.message });
            const document = window.document;
            setTimeout(() => {
                const userImg = document.getElementById('userImg-' + (this.state.messageList.length - 1));
                const video = document.getElementById('video-' + data.streamId);
                const avatar = userImg.getContext('2d');
                avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
                this.props.messageReceived();
            }, 50);
            this.setState({ messageList: messageList });
            this.scrollToBottom();
        });
    }

    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    handlePressKey(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    sendMessage() {
        if (this.props.user && this.state.message) {
            let message = this.state.message.replace(/ +(?= )/g, '');
            if (message !== '' && message !== ' ') {
                const data = { message: message, nickname: this.props.user.getNickname(), streamId: this.props.user.getStreamManager().stream.streamId };
                this.props.user.getStreamManager().stream.session.signal({
                    data: JSON.stringify(data),
                    type: 'chat',
                });
            }
        }
        this.setState({ message: '' });
    }

    scrollToBottom() {
        setTimeout(() => {
            try {
                this.chatScroll.current.scrollTop = this.chatScroll.current.scrollHeight;
            } catch (err) {}
        }, 20);
    }

    close() {
        this.props.close(undefined);
    }

    render() {
        const styleChat = { display: this.props.chatDisplay };
        return (
            <div id="chatContainer">
                <div id="chatComponent" style={styleChat}>
                    <div id="chatToolbar">
                        <span>{this.props.hospitalName}</span>
                        {/* Replacing Material-UI IconButton with a plain button */}
                        <button id="closeButton" onClick={this.close} className="icon-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                        </button>
                    </div>
                    <div className="message-wrap" ref={this.chatScroll}>
                        {this.state.messageList.map((data, i) => (
                            <div
                                key={i}
                                id="remoteUsers"
                                className={
                                    'message' + (data.connectionId !== this.props.user.getConnectionId() ? ' left' : ' right')
                                }
                            >
                                <canvas id={'userImg-' + i} width="60" height="60" className="user-img" />
                                <div className="msg-detail">
                                    <div className="msg-info">
                                        <p> {data.nickname}</p>
                                    </div>
                                    <div className="msg-content">
                                        <span className="triangle" />
                                        <p className="text">{data.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div id="messageInput">
                        <input
                            placeholder="Send a message"
                            id="chatInput"
                            value={this.state.message}
                            onChange={this.handleChange}
                            onKeyPress={this.handlePressKey}
                            className="input-field"
                        />
                        {/* Replacing Material-UI Fab and Tooltip with a simple button */}
                        <button id="sendButton" onClick={this.sendMessage} className="send-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="white" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}
