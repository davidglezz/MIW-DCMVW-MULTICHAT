import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';
import { QueueingSubject } from 'queueing-subject'
import websocketConnect from 'rxjs-websockets'

import { Command } from './models/Command';

@Injectable()
export class WebSocketService {
  private outgoing: QueueingSubject<string>
  private incoming: Subscription
  public connectionStatus: Observable<number>
  private pingTimer: number
  // Clasifico los mensajes entrantes en múltiples Observables
  private topics: { [key: string]: Subject<Command> } = {}

  private static readonly URL = "ws://127.0.0.1/" //window.location.host;

  constructor() {
    this.getTopic('none').subscribe(message => {
      console.log('Mensaje de texto recibido:', message.fn)
    })
    this.getTopic('notfound').subscribe(message => {
      console.log('No existe un manejador para el mensaje:', message)
    })

    this.connect();
  }

  public connect() {
    if (this.incoming)
      return

    this.outgoing = new QueueingSubject<string>() // Cola de salida de mensajes
    const { connectionStatus, messages } = websocketConnect(WebSocketService.URL, this.outgoing)
    this.connectionStatus = connectionStatus
    this.incoming = messages
      .retryWhen(errors => errors.delay(10000))
      .map(message => {
        if (message[0] === '{') { // or message !== 'pong
          try {
            return JSON.parse(message)
          } catch (err) {
            console.error('No es json:', message)
          }
        }
        return { topic: 'none', fn: message };
      })
      .subscribe((message: Command) => {
        let topic: string
        if (message && message.topic) {
          topic = this.topics[message.topic] ? message.topic : 'notfound'
        } else {
          topic = 'none'
        }
        this.topics[topic].next(message)
      })

    this.pingTimer = window.setInterval(() => this.outgoing.next('ping'), 25000);
  }

  public getTopic(topic: string): Subject<Command> {
    if (!this.topics[topic]) {
      this.topics[topic] = new Subject()
    }
    return this.topics[topic]
  }

  public send(obj: Command): void {
    this.outgoing.next(JSON.stringify(obj))
  }
}
