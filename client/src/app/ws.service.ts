import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, tap, retryWhen, delayWhen } from 'rxjs/operators';
import { QueueingSubject } from 'queueing-subject'
import websocketConnect from 'rxjs-websockets'

@Injectable()
export class WsService {
  private inputStream: QueueingSubject<string>
  public messages: Observable<object>
  public connectionStatus: Observable<number>

  private static readonly URL = "ws://127.0.0.1/" //window.location.host;

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.messages)
      return

    this.inputStream = new QueueingSubject<string>()
    const { connectionStatus, messages } = websocketConnect(WsService.URL, this.inputStream)
    this.connectionStatus = connectionStatus
    this.messages = messages.retryWhen(errors => errors.delay(1000))
        .map(message => message === 'pong' ? message : JSON.parse(message))
        .share();

    setInterval(() => this.inputStream.next('ping'), 30000);//this.socketService.send('ping');
  }

  public send(obj: object):void {
    this.inputStream.next(JSON.stringify(obj))
  }
}
