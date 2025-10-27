export class WrappedLine {
  constructor(
    public text: string,
    public startOffset: number, // 行所在原字符串位置
    public isPrecededByNewline: boolean, // 是否用户换行
    public endWithNewLine: boolean // 是否以换行符结尾
  ) {}
}
