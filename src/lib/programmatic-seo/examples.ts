export interface ProgrammaticExampleGroupDefinition<RecordType> {
  id: string;
  title: string;
  description: string;
  matches: (record: RecordType) => boolean;
}

export function createProgrammaticExampleGroups<RecordType>(
  records: RecordType[],
  definitions: ProgrammaticExampleGroupDefinition<RecordType>[],
  compare?: (a: RecordType, b: RecordType) => number,
) {
  return definitions.map((definition) => {
    const matchingRecords = records.filter(definition.matches);

    return {
      ...definition,
      records: compare ? matchingRecords.sort(compare) : matchingRecords,
    };
  });
}
