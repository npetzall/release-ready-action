
const parse = (commitHeaders, headerPattern, headerFields) => {
  const mapper = parserFunc(headerPattern, headerFields);
  return commitHeaders.map(headerLine => mapper(headerLine));
}

const parserFunc = (headerPattern, headerFields) => {
  const pattern = new RegExp(headerPattern);
  return (headerLine) => {
    const matcher = headerLine.match(pattern);
    let header = {}
    if (matcher) {
      headerFields.forEach((field, index) => {
        header[field] = matcher[index + 1] ||null
      })
    } else {
      header["type"] = "invalid";
      header["message"] = headerLine;
    }
    return header;
  }
}

module.exports = {parse, parserFunc}