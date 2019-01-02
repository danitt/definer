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
 * @returns { IOxfordResponse | null }
 */
export async function getDefinitions(term: string): Promise<IOxfordResponse | null> {
  let response: IOxfordResponse | null = null;
  try {
    // Query API
    response = await dict.find(term);
    // Validate Result
    if (response.results.length === 0) {
      throw Error('No results for given word');
    }
    if (response.results.length > 1) {
      throw Error('Multiple results available for this word, choosing first result');
    }
  } catch (e) {
    // Display error and exit
    console.error(`Error querying or parsing dictionary result for term: ${term}`);
    process.exit();
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
  oxfordResponse.results[0].lexicalEntries.forEach(lex => {
    lex.entries.forEach(entry => {
      entry.senses.forEach(sense => {
        definitions.push(...sense.definitions);
      })
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
  oxfordResponse.results[0].lexicalEntries.forEach(lex => {
    lex.entries.forEach(entry => {
      entry.senses.forEach(sense => {
        examples.push(...sense.examples.map(x => x.text));
      })
    });
  });
  return examples;
}
