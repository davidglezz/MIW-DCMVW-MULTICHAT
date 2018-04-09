import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-p2p-chat',
  templateUrl: './p2p-chat.component.html',
  styleUrls: ['./p2p-chat.component.css']
})
export class P2pChatComponent implements OnInit {
  localPeerConnection: RTCPeerConnection
  remotePeerConnection: RTCPeerConnection
  remoteaudio: HTMLAudioElement
  stream: MediaStream | void
  remoteUsername: String

  constructor() { }

  async ngOnInit() {
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

  call() {
    if (typeof RTCPeerConnection == "undefined")
      RTCPeerConnection = webkitRTCPeerConnection;

    //This is an optional configuration string, associated with NAT traversal setup
    const configuration = null;
    this.localPeerConnection = new RTCPeerConnection(configuration);
    this.localPeerConnection.onicecandidate = this.gotLocalIceCandidate.bind(this);
    this.remotePeerConnection = new RTCPeerConnection(configuration);
    this.remotePeerConnection.onicecandidate = this.gotRemoteIceCandidate.bind(this);
    this.remotePeerConnection.onaddstream = this.gotRemoteStream.bind(this);
    console.log("Created local and remote peer connection objects");
    this.localPeerConnection.addStream(theStream);
    console.log("Added localStream to localPeerConnection");
    this.localPeerConnection.createOffer(this.gotLocalDescription.bind(this), this.onSignalingError.bind(this));
  }

  public hangup() {
    console.log("Ending call");
    //hangupButton.disabled = true;
    //callButton.disabled = false;

    //Close PeerConnection(s)
    this.localPeerConnection.close();
    this.remotePeerConnection.close();
    //Reset local variables
    this.localPeerConnection = null;
    this.remotePeerConnection = null;
  }


  /****** Events hendlers ******/

  //Handler to be called as soon as the remote stream becomes available
  private gotRemoteStream(event) {
    this.remoteaudio.src = window.URL.createObjectURL(event.stream);
    this.remoteaudio.play();
  }

  private gotLocalDescription(description) {
    this.localPeerConnection.setLocalDescription(description);
    this.remotePeerConnection.setRemoteDescription(description);
    //Create the Answer to the received Offer based on the 'local' description
    this.remotePeerConnection.createAnswer(this.gotRemoteDescription.bind(this), this.onSignalingError.bind(this));
  }
/*
  private gotRemoteDescription(description) {
    this.remotePeerConnection.setLocalDescription(description);
    this.localPeerConnection.setRemoteDescription(description);
  }
*/
  private gotLocalIceCandidate(event) {
    if (event.candidate) {
      this.remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
  }
/*
  private gotRemoteIceCandidate(event) {
    if (event.candidate) {
      this.localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
  }
*/
  private onSignalingError(error) {
    console.log('Failed to create signaling message : ' + error.name);
  }

}
