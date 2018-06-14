import { Injectable } from '@angular/core';

@Injectable()
export class WebRtcService {

  configuration: RTCConfiguration = { "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }] }

  constructor() { }

}
