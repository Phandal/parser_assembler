# A simple demo of inbound parsing process with assembler

## Documentation
The process has 2 stages.
1. Parsing
2. Assembling

### Parsing
The parsing stage is responsible for getting the data into the system as an array of objects. An
example csv parser is provided [here](src/parsers/csvparser.ts).

### Assembling
This is where the magic happens. The Assembler stage allows for grouping, merging, and transforming data.
It groups all rows from the parsing stage by a specific key. It then attempts to merge the grouped
rows according to a `MergeStrategy`.

There are simple merge strategies:
- `last`: take the value from the last grouped record
- `first`: take the value from the first grouped record
- `list`: use an array of all the grouped recrods
- `sum`: sum all values across the grouped records

There are also slightly more complex merge strategies:
- `object-list`: converts files where there is a type column that denotes the type of change and a
value column into a list of objects for each type of change
- `column-pivot`: converts files where all changes are on 1 line into a list of objects for each
type of change

When using an `object-list` strategy, there is also the ability to map specific type codes to their
corresponding change code that the app can use.


## Examples
All examples have their input in the `inbound` directory and their config in the `config` directory
1. [column-pivot csv](inbound/09162025change.csv)
2. [column-pivot csv with tab delimiter](inbound/testchange.csv)
3. [object-list csv](inbound/typechange.csv)
4. [object-list csv with mapped type codes](inbound/mappedtypechange.csv)
