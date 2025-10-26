import wrapAnsi from "wrap-ansi";

export class WrappedLine {
  text: string;
  startOffset: number;
  isPrecededByNewline: boolean;
  endsWithNewline: boolean;
  constructor(
    text: string,
    startOffset: number,
    isPrecededByNewline: boolean,
    endsWithNewline: boolean
  ) {
    this.text = text;
    this.startOffset = startOffset;
    this.isPrecededByNewline = isPrecededByNewline;
    this.endsWithNewline = endsWithNewline;
  }
}

export class MeasuredText {
  wrappedLines: WrappedLine[];
  text: string;
  columns: number;
  constructor(text: string, columns: number) {
    this.text = text;
    this.columns = columns;
    this.wrappedLines = this.measureWrappedText();
  }

  measureWrappedText() {
    const wrappedText = wrapAnsi(this.text, this.columns, {
      hard: true,
      trim: false,
    });

    const wrappedLines: WrappedLine[] = [];
    let searchOffset = 0;
    let lastNewLinePos = -1;

    const lines = wrappedText.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i]!;
      const isPrecededByNewline = (startOffset: number) =>
        i === 0 || (startOffset > 0 && this.text[startOffset - 1] === "\n");

      if (text.length === 0) {
        lastNewLinePos = this.text.indexOf("\n", lastNewLinePos + 1);

        if (lastNewLinePos !== -1) {
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
        } else {
          const startOffset = this.text.length;
          wrappedLines.push(
            new WrappedLine(
              text,
              startOffset,
              isPrecededByNewline(startOffset),
              false
            )
          );
        }
      } else {
        // For non-blank lines
        const startOffset = this.text.indexOf(text, searchOffset);
        if (startOffset === -1) {
          console.log("Debug: Failed to find wrapped line in original text");
          console.log("Debug: Current text:", text);
          console.log("Debug: Full original text:", this.text);
          console.log("Debug: Search offset:", searchOffset);
          console.log("Debug: Wrapped text:", wrappedText);
          throw new Error("Failed to find wrapped line in original text");
        }

        searchOffset = startOffset + text.length;

        // Check if this line ends with a newline in the original text
        const potentialNewlinePos = startOffset + text.length;
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
}

export class Cursor {
  offset: number;
  selection: number;
  measuredText: MeasuredText;
  constructor(
    measuredText: MeasuredText,
    offset: number = 0,
    selection: number = 0
  ) {
    this.offset = offset;
    this.selection = selection;
    this.measuredText = measuredText;
  }

  public get text(): string {
    return this.measuredText.text;
  }

  private get columns(): number {
    return this.measuredText.columns + 1;
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

  insert(insertString: string) {
    const newCursor = this.modifyText(this, insertString);
    return newCursor;
  }

  static fromText(
    text: string,
    columns: number,
    offset: number = 0,
    selection: number = 0
  ) {
    return new Cursor(
      new MeasuredText(text.replace(/\t/g, " "), columns - 1),
      offset,
      selection
    );
  }
}
