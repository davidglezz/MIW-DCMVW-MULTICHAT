import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Command } from './models/Command';

@Injectable({
  providedIn: 'root'
})
export class WebrtcCallService implements OnDestroy {
  remoteUser: String
  localPeerConnection: RTCPeerConnection
  remotePeerConnection: RTCPeerConnection
  remoteaudio: HTMLAudioElement
  stream: MediaStream | void
  
  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.connect()

    if (typeof RTCPeerConnection === "undefined")
      RTCPeerConnection = webkitRTCPeerConnection;
      
    this.listdevices()
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

  ngOnDestroy() {
    
  }
}
