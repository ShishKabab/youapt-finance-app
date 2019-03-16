export function trimIndentationSpaces(source : string) {
    const sourceLines = source.split('\n')
    const secondExpectLine = sourceLines[1]
    const leadingSpaces = /^\s+/.exec(secondExpectLine)[0]
    const sourceWithoutLeadingSpaces = sourceLines.slice(1, -1).map(line => line.slice(leadingSpaces.length)).join('\n')
    return sourceWithoutLeadingSpaces
}