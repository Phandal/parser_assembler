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
for pulling out fields that should be available for further transformation in the assembler. The
values in the fields array of the parser, can be thought of as names of properties on the parsed
record. The parsed record should have every property with blanks, as the empty string "".

## Assember
The assember is responsible for transforming, merging, and mapping data to the standard format. It
does this with a set of rules that transforms how the data is manipulated. The rules should be
somewhat user-friendly, as they should be able to be built into a ui.

### Rules
1. Take
This rule allows you to `take` the sequence from the grouped records and `set` its value in the
member record output via the `mergeInto.output` field.

2. When
This rule allows you to `push` or `set` values in the member record output via the
`mergeInto.output` field when a conditions is met. The condition is in the `when` section
of the rule. If the `mergeInto.operation` is set, then the last value from the grouped
records is set.

## TODO
1. Add tests for `HardCoded`
2. Add `and` in when expression
2. Finish example configs

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

## Example
Input:
```
RecordType,PlanId,EmployeeName,EmployeeSSN,EffectiveDate,EndAllDeferrals,ContributionCode,DeferralPercent,DeferralAmt,PlanEntryDate,LoanNumber,LoanPaymentAmount,LoanGoal
D,QK63283-00039,TEST PARTICIPANT1,111111111,10022025,,401K,4.00,,,,,
D,QK63283-00039,TEST PARTICIPANT1,111111111,10022025,,4ROTH,0.00,,,,,
D,QK63283-00039,TEST PARTICIPANT1,111111111,10022025,,4ROTH,,20.00,,,,
D,QK63283-00039,TEST PARTICIPANT2,222222222,10022025,,401K,0.00,,,,,
D,QK63283-00039,TEST PARTICIPANT3,333333333,10022025,,4ROTH,5.00,,,,,
D,QK63283-00039,TEST PARTICIPANT4,444444444,10022025,,401K,,0.00,,,,
D,QK63283-00039,TEST PARTICIPANT4,444444444,10022025,,401K,10.00,,,,,
L,QK63283-00039,TEST PARTICIPANT5,555555555,10102025,,401L,,,,20250307923HFT,00000000040.17,00000000763.28
L,QK63283-00039,TEST PARTICIPANT6,666666666,10102025,,401L,,,,20250405923RMG,00000000000.00,00000000000.00

```
Config:
```json
{
	"parser": {
		"kind": "csv",
		"skipRows": 1,
		"delimiter": ",",
		"fields": [
			{ "name": "recordType", "index": 0 },
			{ "name": "planid", "index": 1 },
			{ "name": "employeeName", "index": 2 },
			{ "name": "employeeSSN", "index": 3 },
			{ "name": "effectiveDate", "index": 4 },
			{ "name": "endAllDeferrals", "index": 5 },
			{ "name": "contributionCode", "index": 6 },
			{ "name": "deferralPercent", "index": 7 },
			{ "name": "deferralAmt", "index": 8 },
			{ "name": "planEntryDate", "index": 9 },
			{ "name": "loanNumber", "index": 10 },
			{ "name": "loanPaymentAmount", "index": 11},
			{ "name": "loanGoal", "index": 12 },
		]
	},
	"assembler": {
		"groupBy": "employeeSSN",
		"rules": [
			{
				"take": { "field": "ssn", "sequence": "last" },
				"mergeInto": { "path": "ssn", "operation": "set" }
			},
			{
				"take": { "field": "effectiveDate", "sequence": "last" },
				"mergeInto": { "path": "effectiveDate", "operation": "set"}
			},
			{
				"when": { "field": "contributionCode", "equals": "401K" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "401K" }, "amount": "contributionAmt", "percent": "contributionPercent" } }
			},
			{
				"when": { "field": "contributionCode", "equals": "4ROTH" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "ROTH" }, "amount": "contributionAmt", "percent": "contributionPercent" } }
			},
			{
				"when": { "field": "contributionCode", "equals": "401L" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "LOAN" }, "amount": "loanPaymentAmount" } }
			},
		]
	}
}
```

Input:
```
﻿XTA,000-00-0000,,0,100,, , , , , , , , , , , , , , , , , , , ,09/15/2025
XTA,000-00-0000,,0,,200, , , , , , , , , , , , , , , , , , , ,09/15/2025
XTA,000-00-0000,,0, , , , , , , , , , , , , , , , ,49 Test Rd, , , , ,09/15/2025
XTA,000-00-0000,,0, , , , , , , , , , , , , , , , , ,, , , ,09/15/2025
XTA,000-00-0000,,0, , , , , , , , , , , , , , , , , , ,Pasadena, , ,09/15/2025
XTA,000-00-0000,,0, , , , , , , , , , , , , , , , , , , ,CA, ,09/15/2025
XTA,000-00-0000,,0, , , , , , , , , , , , , , , , , , , , ,91105,09/15/2025
```
Config:
```json
{
	"parser": {
		"kind": "csv",
		"skipRows": 0,
		"delimiter": ",",
		"fields": [
			{ "name": "planid", "index": 0 },
			{ "name": "ssn", "index": 1 },
			{ "name": "401kAmount", "index": 4 },
			{ "name": "rothAmount", "index": 5 },
			{ "name": "addr1", "index": 20 },
			{ "name": "addr2", "index": 21 },
			{ "name": "city", "index": 22 },
			{ "name": "state", "index": 23 },
			{ "name": "zip", "index": 24 },
			{ "name": "effectiveDate", "index": 25 },
		]
	},
	"assembler": {
		"groupBy": "ssn",
		"rules": [
			{
				"take": { "field": "ssn", "sequence": "last" },
				"mergeInto": { "path": "ssn", "operation": "set" }
			},
			{
				"take": { "field": "effectiveDate", "sequence": "last" },
				"mergeInto": { "path": "effectiveDate", "operation": "set"}
			},
			{
				"when": { "field": "401kAmount", "notequals": "" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "401K" }, "amount": "401kAmount" } }
			},
			{
				"when": { "field": "rothAmount", "notequals": "" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "ROTH" }, "amount": "rothAmount" } }
			}
			{
				"take": { "field": "addr1", "sequence": "last" },
				"mergeInto": { "path": "demographics.addr1", "operation": "set"}
			},
			{
				"take": { "field": "addr2", "sequence": "last" },
				"mergeInto": { "path": "demographics.addr2", "operation": "set"}
			},
			{
				"take": { "field": "city", "sequence": "last" },
				"mergeInto": { "path": "demographics.city", "operation": "set"}
			},
			{
				"take": { "field": "state", "sequence": "last" },
				"mergeInto": { "path": "demographics.state", "operation": "set"}
			},
			{
				"take": { "field": "zip", "sequence": "last" },
				"mergeInto": { "path": "demographics.zip", "operation": "set"}
			}
		]
	}
}
```

Input:
```
SSN,type,change,effectiveDate
000-00-0000,1,400,10242025
111-11-1111,2,200,10242025
000-00-0000,3,500,10242025
000-00-0000,6,Pasenda,10242025
```
Config:
```json
{
	"parser": {
		"kind": "csv",
		"skipRows": 1,
		"delimiter": ",",
		"fields": [
			{ "name": "ssn", "index": 0 },
			{ "name": "type", "index": 1 },
			{ "name": "change", "index": 2 },
			{ "name": "effectiveDate", "index": 3 }
		]
	},
	"assembler": {
		"groupBy": "employeeSSN",
		"rules": [
			{
				"take": { "field": "ssn", "sequence": "last" },
				"mergeInto": { "path": "ssn", "operation": "set" }
			},
			{
				"take": { "field": "effectiveDate", "sequence": "last" },
				"mergeInto": { "path": "effectiveDate", "operation": "set"}
			},
			{
				"when": { "field": "type", "equals": "1" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "401K" }, "amount": "change" } }
			},
			{
				"when": { "field": "type", "equals": "2" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "ROTH" }, "amount": "change" } }
			}
			{
				"when": { "field": "type", "equals": "3" },
				"mergeInto": { "path": "deferral", operation: "push", output: { "type": { "value": "LOAN" }, "amount": "change" } }
			}
			{
				"when": { "field": "type", "equals": "6" },
				"mergeInto": { "path": "demographics.city", "operation": "set"}
			}
		]
	}
}
```
