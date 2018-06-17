import { Injectable } from '@angular/core';
import { User } from './models/User';

@Injectable()
export class AppStorageService {
  public users: Map<string, User> = new Map<string, User>()
  constructor() { }
}
