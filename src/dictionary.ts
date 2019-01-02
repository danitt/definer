// Environment Vars
import * as dotenv from 'dotenv';
dotenv.config();

// Dictionary Wrapper
import * as Dictionary from 'oxford-dictionary';

// Types
import { IOxfordResponse } from './dictionary.d';

// Instantiate Vars
const dict = new Dictionary({
  app_id: process.env.OXFORD_APP_ID,
  app_key: process.env.OXFORD_APP_KEY,
  source_lang: 'en',
});

/**
 * Queries the Oxford Dictionaries API, returning an IOxfordResponse object
 * @param { string } term word to query
 * @returns { IOxfordResponse }
 */
export async function getDefinitions(term: string): Promise<IOxfordResponse | null> {
  let response: IOxfordResponse | null = null;
  try {
    response = await dict.find(term);
  } catch (e) {
    // Oxford wrapper lib throws errors on null result.. it really shouldn't as the query itself was successful, and simply
    // returned no results. Errors should only be thrown if the XHR itself fails to receive a 2XX result
    // console.error(`Error querying or parsing dictionary result for term: ${term}`);
  }
  return response;
}

/**
 * Takes an IOxfordResponse object, and parses out all simple definition strings from all results
 * @param { IOxfordResponse } oxfordResponse
 * @returns { string[] } string of definitions
 */
export function parseResultDefinitions(oxfordResponse: IOxfordResponse): string[] {
  const definitions: string[] = [];

  oxfordResponse.results.forEach(result => {
    result.lexicalEntries.forEach(lex => {
      lex.entries.forEach(entry => {
        entry.senses.forEach(sense => {
          if (sense.definitions) {
            definitions.push(...sense.definitions);
          }
        })
      });
    });
  });
  return definitions;
}

/**
 * Takes an IOxfordResponse object, and parses out all examples from all results
 * @param { IOxfordResponse } oxfordResponse
 * @returns { string[] } string of examples
 */
export function parseResultExamples(oxfordResponse: IOxfordResponse): string[] {
  const examples: string[] = [];

  oxfordResponse.results.forEach(result => {
    result.lexicalEntries.forEach(lex => {
      lex.entries.forEach(entry => {
        entry.senses.forEach(sense => {
          if (sense.examples) {
            examples.push(...sense.examples.map(x => x.text));
          }
        })
      });
    });
  });
  return examples;
}
