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
  const senses = parseResultSenses(oxfordResponse);
  const definitions = senses.reduce((acc, x) => x.definitions ? [...acc, ...x.definitions] : acc, []);
  return definitions;
}

/**
 * Takes an IOxfordResponse object, and parses out all examples from all results
 * @param { IOxfordResponse } oxfordResponse
 * @returns { string[] } string of examples
 */
export function parseResultExamples(oxfordResponse: IOxfordResponse): string[] {
  const senses = parseResultSenses(oxfordResponse);
  const examples = senses.reduce((acc, x) => x.examples ? [...acc, ...x.examples.map(y => y.text)] : acc, []);
  return examples;
}

function parseResultSenses(oxfordResponse: IOxfordResponse): any[] {
  const results = oxfordResponse.results || [];
  const lexicalEntries = results
    .reduce((acc, x) => x.lexicalEntries ? [...acc, ...x.lexicalEntries] : acc, []);
  const entries = lexicalEntries
    .reduce((acc, x) => x.entries ? [...acc, ...x.entries] : acc, []);
  const senses = entries
    .reduce((acc, x) => x.senses ? [...acc, ...x.senses] : acc, []);
  return senses;
}