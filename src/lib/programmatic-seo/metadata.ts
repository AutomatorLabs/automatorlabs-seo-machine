export interface ProgrammaticMetadataInput {
  title: string;
  description: string;
  siteName?: string;
}

export interface ProgrammaticMetadata {
  seoTitle: string;
  metaDescription: string;
}

export function createProgrammaticMetadata({
  title,
  description,
  siteName = 'AutomatorLabs',
}: ProgrammaticMetadataInput): ProgrammaticMetadata {
  return {
    seoTitle: `${title} | ${siteName}`,
    metaDescription: description,
  };
}
