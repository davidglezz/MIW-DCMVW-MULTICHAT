export class Command {
  constructor(
    public topic:string, 
    public fn: string, 
    public args: Array<any>
  ) { }
}