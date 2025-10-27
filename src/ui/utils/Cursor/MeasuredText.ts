import wrapAnsi from "wrap-ansi";
import { WrappedLine } from "./WrappedText";

export class MeasuredText {
  lines: WrappedLine[] = [];
  constructor(public text: string, public columns: number) {
    this.lines = this.measureWrappedText();
    // for (let i = 0; i < this.lines.length; i++) {
    //   console.log(
    //     this.lines[i].text,
    //     this.lines[i].startOffset,
    //     this.lines[i].isPrecededByNewline,
    //     this.lines[i].endWithNewLine
    //   );
    // }
  }

  measureWrappedText() {
    // 使用ansi自动换行
    const wrappedText = wrapAnsi(this.text, this.columns, {
      hard: true,
      trim: false,
    });
    const wrappedLines: WrappedLine[] = [];
    let searchOffset = 0;
    let lastNewLinePos = -1;

    const lines = wrappedText.split("\n"); // ansi自动换行后的文本切割
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];
      // 判断是否用户输入换行, 而不是自动换行
      const isPrecededByNewline = (startOffset: number) =>
        i === 0 || (startOffset > 0 && this.text[startOffset - 1] === "\n");

      // 可能是\n\n的情况
      if (text.length === 0) {
        lastNewLinePos = this.text.indexOf("\n", lastNewLinePos + 1);
        // # h\n的情况
        if (lastNewLinePos === -1) {
          const startOffset = this.text.length;
          wrappedLines.push(
            new WrappedLine(
              text,
              startOffset,
              isPrecededByNewline(startOffset),
              false
            )
          );
        } else {
          // h\nb\n
          const startOffset = lastNewLinePos;
          const endsWithNewline = true;

          wrappedLines.push(
            new WrappedLine(
              text,
              startOffset,
              isPrecededByNewline(startOffset),
              endsWithNewline
            )
          );
        }
      } else {
        // 原文本：hello world\n abc
        // ansi: hello \nworld\n abc
        // 获取当前文本的初始位置
        const startOffset = this.text.indexOf(text, searchOffset);
        if (startOffset === -1) {
          throw new Error(`Wrapped line ${i} not found in original text`);
        }
        // 更新搜索位置，下次从这行的末尾开始搜索
        searchOffset = startOffset + text.length;

        const potentialNewlinePos = startOffset + text.length;
        // 判断原字符串中下一个字符是否是\n
        const endsWithNewline =
          potentialNewlinePos < this.text.length &&
          this.text[potentialNewlinePos] === "\n";

        if (endsWithNewline) {
          lastNewLinePos = potentialNewlinePos;
        }

        wrappedLines.push(
          new WrappedLine(
            text,
            startOffset,
            isPrecededByNewline(startOffset),
            endsWithNewline
          )
        );
      }
    }

    return wrappedLines;
  }

  getWrappedText() {
    return this.lines.map((line) =>
      line?.isPrecededByNewline ? line.text : line.text.trimStart()
    );
  }

  getPositionFromOffset(offset: number) {
    const lines = this.lines;
    for (let line = 0; line < lines.length; line++) {
      const currentLine = lines[line];
      const nextLine = lines[line + 1];
      if (
        offset >= currentLine.startOffset &&
        (!nextLine || offset < nextLine.startOffset)
      ) {
        const leadingWhitepace = currentLine.isPrecededByNewline
          ? 0
          : currentLine.text.length - currentLine.text.trimStart().length;
        const column = Math.max(
          0,
          Math.min(
            currentLine.text.length,
            offset - currentLine.startOffset - leadingWhitepace
          )
        );
        return {
          column,
          line,
        };
      }
    }

    // If we're past the last character, return the end of the last line
    const line = lines.length - 1;
    return {
      line,
      column: this.lines[line].text.length,
    };
  }
}
