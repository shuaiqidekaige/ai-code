import { MeasuredText } from "./MeasuredText";

class Cursor {
  constructor(public measuredText: MeasuredText, public offset: number = 0) {}
  public get text(): string {
    return this.measuredText.text;
  }
  public get columns(): number {
    return this.measuredText.columns + 1;
  }
  public getPosition() {
    return this.measuredText.getPositionFromOffset(this.offset);
  }

  static fromText(text: string, columns: number, offset: number) {
    return new Cursor(new MeasuredText(text, columns - 1), offset);
  }

  modifyText(end: Cursor, insertString: string = "") {
    const startOffset = this.offset;
    const endOffset = end.offset;
    const newText =
      this.text.slice(0, startOffset) +
      insertString +
      this.text.slice(endOffset);

    return Cursor.fromText(
      newText,
      this.columns,
      startOffset + insertString.length
    );
  }

  insert(str: string) {
    const newCursor = this.modifyText(this, str);
    return newCursor;
  }

  render() {
    const { line, column } = this.getPosition();
    return this.measuredText.getWrappedText().map((text, currentLine, allLines) => {
      let displayText = text;
      if (line !== currentLine) return displayText.trimEnd();
      return displayText.slice(0, column) +  displayText.trimEnd().slice(column + 1)
    }).join('\n')
  }

  equals(other: Cursor): boolean {
    return (
      this.offset === other.offset && this.measuredText === other.measuredText
    );
  }
}

export default Cursor