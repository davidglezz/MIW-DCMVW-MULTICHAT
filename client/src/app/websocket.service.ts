import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import { Observable, Subject, Subscription } from 'rxjs';
import websocketConnect from 'rxjs-websockets';
import { delay, map, retryWhen } from 'rxjs/operators';
import { Command } from './models/Command';

@Injectable()
export class WebSocketService {
  private outgoing: QueueingSubject<string>
  private incoming: Subscription
  public connectionStatus: Observable<number>
  private pingTimer: number
  // Clasifico los mensajes entrantes en múltiples Observables
  private topics: { [key: string]: Subject<Command> } = {}

  private static readonly URL = 'ws://' + window.location.host // hostname

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
      .pipe(
        retryWhen(errors => errors.pipe(delay(10000))),
        map(message => {
          if (message[0] === '{') { // or message !== 'pong
            try {
              return JSON.parse(<string>message)
            } catch (err) {
              console.error('No es json:', message)
            }
          }
          return { topic: 'none', fn: message };
        })
      )
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
    // this.connect()
    return this.topics[topic]
  }

  public subscribe(topic: string, handler: any): Subscription {
    return this.getTopic(topic).subscribe((message: Command) => {
      if (handler[message.fn]) {
        handler[message.fn].apply(handler, message.args)
      }
    })
  }

  public send(obj: Command): void {
    this.outgoing.next(JSON.stringify(obj))
  }
}
