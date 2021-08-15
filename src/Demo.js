import React, {Component} from 'react'
import {Launcher} from 'react-chat-window'
import {io} from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload';
class Demo extends Component {
    componentDidMount(){
        
        this.setState({
            enteredid: prompt('Please enter your id')
        })
        this.setState({enteredtok: prompt('Please enter your token')})
            
        const socket = io("http://localhost:5000", {
            withCredentials: true,
            extraHeaders: {
              "my-custom-header": "abcd"
            }
          });

          socket.on("chatnew",(args)=> {
            if(args.token !== this.state.enteredtok && args.chatId === this.state.enteredid){
             if (args.messageType === "file")
             {
               console.log(args)
                this.setState({
                    messageList: [...this.state.messageList, {
                    author: 'them',
                    type: 'file',
                      data: {
                        url: args.message,
                        fileName: args.filename
                      }
                    }]
    
                   });
             }   else{

                this.setState({
                    messageList: [...this.state.messageList, {
                    author: 'them',
                    type: 'text',
                    data: {
                        text: args.message
                    } 
                      
                    }]
    
                   });
             }
            }

          
    });}

  constructor() {
    super();
    this.state = {
      messageList: [],
    };
  }

  _onMessageWasSent(message) {
    const socket = io("http://localhost:5000", {
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "abcd"
        }
      });
    let messageObject = {
        token: this.state.enteredtok,
        chatId: this.state.enteredid,
        message:message.data.text,
        messageType:'text'

    }


    socket.emit("chatnew",messageObject)
    

    this.setState({
        messageList: [...this.state.messageList, message]});
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);
    const socket = io("http://localhost:5000", {
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "abcd"
        }
      });

      let messageObject = {
          token: this.state.enteredtok,
          chatId: this.state.enteredid,
          message:fileList[0],
          messageType:'file',
          filename: fileList[0].name

      }


       // const bytes = new Uint8Array(document.getElementsByName("files[]")[0]);
        socket.emit("chatnew",messageObject)

      

      
    this.setState({
      messageList: [...this.state.messageList, {
        type: 'file', author: 'me',
        data: {
          url: objectURL,
          fileName: fileList[0].name
        }
      }]
    });
  }

  _sendMessage(text) {
    if (text.length > 0) {
        

      this.setState({
        messageList: [...this.state.messageList, {
          author: this.state.enteredtok,
          type: 'text',
          data:text,
        }]
      })
    }
  }

  render() {
    return (<div>
      <Launcher
        agentProfile={{
          teamName: 'react-chat-window',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        onFilesSelected={this._onFilesSelected.bind(this)}
        messageList={this.state.messageList}
      />
    </div>)
  }
}
export default Demo;