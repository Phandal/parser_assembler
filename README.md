# Inbound Parsing Engine

There should be two sections. A `Parser` and an `Assembler`. Each section will be explained below.
The main goal of the engine is to take in some sort of structured input
(json, csv, fixed-wdith, etc...) and convert it into the standard format needed by the upload
service. The engine does **NOT** need to support every output type. It just needs to fit the
standard format.

## Parser
The parser is responsible for parsing the incoming data into an array of objects. These objects
represent a record in the data. The parser does not need to know about how the data is
merged/transformed, as this happens in the assembler. There can be parsers for different filetypes.
For example, the csv parser uses papaparse to get an array of records. Each parser is responsible
for pulling out fields that should be available for further processing in the assembler. The
values in the fields array of the parser, can be thought of as names of properties on the parsed
record. The parsed record should have every property with blanks, as the empty string "".

## Assember
The assember is responsible for merging and mapping data to the standard format. It
does this with a set of rules that transforms how the data is manipulated. The rules should be
somewhat user-friendly, as they should be able to be built into a ui.

### Rules
1. Take
This rule allows you to `take` the sequence from the grouped records and `set` its value in the
member record output via the `mergeInto.output` field.

2. When
This rule allows you to `push` or `set` values in the member record output via the
`mergeInto.output` field when a conditions is met. The condition is in the `when` section
of the rule. If the `mergeInto.operation` is set, then the `last` value from the grouped
records is set.

## Standard Format
```json
{
	"ssn": "XXX-XX-XXXX",
	"effectiveDate": "MM/DD/YYYY",
	"demographics": {
		"addr1": "XXXXXXXXXX",
		"addr2": "XXXXXXXXXX",
		"city": "XXXXXXX",
		"state": "XXXX",
		"zip": 00000,
		"country": "XX"
	},
	"deductions": [
		{ "type": "401K", "amount": 0, "percent": 0 }
		{ "type": "ROTH", "amount": 0, "percent": 0 }
		{ "type": "LOAN", "amount": 0, "percent": 0 }
	]
}
```
