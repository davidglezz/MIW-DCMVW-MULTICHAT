import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketService } from '../websocket.service';
import { Command } from '../models/Command';
import { UserService } from '../user.service';
import { ChatMessage } from '../models/ChatMessage';


/**
 * Debido a que la API RTCDataChannel (https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel)
 * todavía es poco soportada por los navegadores, los mensajes de texto serán enviados mediante websokets.
 */
@Component({
  selector: 'app-p2p-chat',
  templateUrl: './p2p-chat.component.html',
  styleUrls: ['./p2p-chat.component.css']
})
export class P2pChatComponent implements OnInit {
  private userSubscription: Subscription;
  private p2pchatSubscription: Subscription;
  messages: ChatMessage[] = []
  remoteUser: String

  // WebRTC
  localPeerConnection: RTCPeerConnection
  remotePeerConnection: RTCPeerConnection
  remoteaudio: HTMLAudioElement
  stream: MediaStream | void

  constructor(private webSocketService: WebSocketService, private userService: UserService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.remoteUser = params['user']

    }).unsubscribe()

    this.webSocketService.connect()
    this.userSubscription = this.webSocketService.getTopic('user').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
    this.p2pchatSubscription = this.webSocketService.getTopic('p2pchat').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })

    // WebRTC
    if (typeof RTCPeerConnection === "undefined")
      RTCPeerConnection = webkitRTCPeerConnection;
  }
  
  message(name, text) {
    console.log(name, text)
    if (name === this.remoteUser)
      this.messages.push({type: 'text', name, text})
  }

  notify(name, text) {
    if (name === this.remoteUser)
      this.messages.push({type: 'notify', text})
  }

  sendMessage(text) {
    if (text) {
      this.message(this.userService.currentUser.name, text);
      this.webSocketService.send({
        topic: 'p2pchat',
        fn: 'message',
        args: [this.remoteUser, text]
      })
    }
  }

  private requestAuth(id: string, name: string) {
    this.messages = [];
  }

  private userConnect(id: string, name: string) {
    if (name === this.remoteUser)
      this.notify(name, name + ' se ha conectado.');
  }

  private userDisconnect(id: string, name: string) {
    if (name === this.remoteUser)
      this.notify(name, name + ' se ha desconectado.');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
    this.p2pchatSubscription.unsubscribe()
    console.log('Salió del chat con ' + this.remoteUser)
  }

  // WebRTC
  async ngOnInit() {
    this.listdevices()
  }

  call() {
    console.info("Call..")
  }

  async listdevices() {
    // List cameras and microphones.
    const devices = await navigator.mediaDevices.enumerateDevices().catch(console.error)
    if (devices) {
      devices.forEach(device => console.log(device.kind + ": " + device.label + " id = " + device.deviceId));
    }
  }

  async start() {
    console.log("Requesting stream");
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false }).catch(console.error)
    console.log(this.stream)
    // video.src = window.URL.createObjectURL(stream);
    // video.play();
  }

  public startingCallCommunication() {
    if (!this.stream)
      return

    const configuration: RTCConfiguration = { "iceServers": [{ "urls": "stun:stun.phoneserve.com" }] } // antes era "url"
    this.localPeerConnection = new RTCPeerConnection(configuration);
    console.log("Created local peer connection object");
    this.localPeerConnection.addStream(this.stream);
    console.log("Added localStream to localPeerConnection");
    //Add a handler associated with ICE protocol events
    this.localPeerConnection.onicecandidate = this.gotLocalIceCandidate.bind(this);
    //...and a second handler to be activated as soon as the remote stream becomes available
    this.localPeerConnection.onaddstream = this.gotRemoteStream.bind(this);
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  call2() {
    if (!this.stream)
      return
    //This is an optional configuration string, associated with NAT traversal setup
    const configuration = null;
    this.localPeerConnection = new RTCPeerConnection(configuration);
    this.localPeerConnection.onicecandidate = this.gotLocalIceCandidate.bind(this);

    this.remotePeerConnection.onaddstream = this.gotRemoteStream.bind(this);
    console.log("Created local and remote peer connection objects");
    this.localPeerConnection.addStream(this.stream);
    console.log("Added localStream to localPeerConnection");
    //this.localPeerConnection.createOffer(this.gotLocalDescription.bind(this), this.onSignalingError.bind(this));
  }

  public hangup() {
    console.log("Ending call");
    this.localPeerConnection.close();
    this.localPeerConnection = null;
    this.webSocketService.send(new Command('p2pchat', 'leave', []))
  }

  /****** Server messages hendlers ******/

  private onOffer(offer, source) {
    this.startingCallCommunication();
    //this.remoteUsername = source;
    this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    /*this.localPeerConnection.createAnswer(answer => {
      this.localPeerConnection.setLocalDescription(answer);
      this.webSocketService.send(new Command('p2pchat', 'answer', [answer]))
    }, console.error);*/
  }

  private onAnswer(answer) {
    this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  private onCandidate(candidate) {
    this.localPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };


  /****** Events hendlers ******/

  //Handler to be called as soon as the remote stream becomes available
  private gotRemoteStream(event) {
    this.remoteaudio.src = window.URL.createObjectURL(event.stream);
    this.remoteaudio.play();
  }

  private gotLocalDescription(description) {
    this.webSocketService.send(new Command('p2pchat', 'offer', [description]))
    this.localPeerConnection.setLocalDescription(description);
  }

  private gotLocalIceCandidate(event) {
    if (event.candidate) {
      this.webSocketService.send(new Command('p2pchat', 'candidate', [event.candidate]))
    }
  }

  private onSignalingError(error) {
    console.log('Failed to create signaling message : ' + error.name);
  }

}
