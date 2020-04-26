import { parse as parseSQL, PGNode } from "pg-query-native-latest";
import { Parser, Plugin, Printer } from "prettier";
import { inspect } from "util";

import embed from "./embed";
import print from "./print";

const LOG_DOCUMENT = false;

const parse: Parser["parse"] = (text, _parsers, _options) => {
  const { query, error, stderr } = parseSQL(text);
  if (error) {
    throw error;
  }
  if (stderr.length) {
    throw new Error("Error occurred: " + stderr);
  }
  if (LOG_DOCUMENT) {
    console.log(inspect(query, { depth: 12 }));
  }
  return query;
};

const parser: Parser = {
  parse,
  // preprocess
  astFormat: "postgresql-ast",

  //TODO
  locStart: (_node: PGNode) => 0,
  locEnd: (_node: PGNode) => 0,
};

const printer: Printer = {
  print,
  embed,
};

const plugin: Plugin = {
  languages: [
    {
      name: "postgresql",
      parsers: ["postgresql"],
    },
  ],
  parsers: {
    postgresql: parser,
  },
  printers: {
    "postgresql-ast": printer,
  },
};
const { languages, parsers, printers } = plugin;

export { languages, parsers, printers };