
export class Base64 {
  private static readonly digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:;'

  public static fromNumber(num: number): string {
    if (isNaN(Number(num)) || num === null || num === Number.POSITIVE_INFINITY)
      throw "The input is not valid";
    if (num < 0)
      throw "Can't represent negative numbers now";

    let residual = Math.floor(num);
    let result = '';
    while (residual !== 0) {
      result = this.digits.charAt(residual % 64) + result;
      residual = Math.floor(residual / 64);
    }

    return result;
  }

  public static toNumber(str: string) : number {
    let result = 0;
    let digits = str.split('');
    for (var e = 0; e < digits.length; e++)
      result = (result * 64) + this.digits.indexOf(digits[e]);
    return result;
  }
}
