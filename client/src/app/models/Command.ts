export interface Command {
  topic:string
  fn: string
  args: Array<any>
}