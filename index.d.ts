export interface IOxfordResponse {
  metadata: {
    provider: string; //  eg "Oxford University Press"
  };
  results: {
    id: string;
    language: string;
    lexicalEntries: {
      entries: {
        etymologies: string[];
        grammaticalFeatures: {
          text: string; // eg "Singular"
          type: string; // eg "Number"
        }[];
        homographNumber: string; // eg "000"
        senses: {
          definitions: string[];
          domains: string[];
          examples: {
            text: string;
          }[];
          id: string;
          short_definitions: string[];
        }[];
      }[];
      language: string; // eg "en"
      lexicalCategory: string; // eg "Noun"
      pronunciations: {
        audioFile?: string; //  eg"http://audio.oxforddictionaries.com/en/mp3/example.mp3"
        dialects: string[]; // eg "British English"
        phoneticNotation: string; // eg "IPA"
        phoneticSpelling: string;
      }[];
      text: string;
    }[];
    type: string;
    word: string;
  }[];
}