// Environment Vars
import * as dotenv from 'dotenv';
dotenv.config();

// CLI Tools
import * as inquirer from 'inquirer';
import * as Ora from 'ora';

// Dictionary Wrapper
import * as Dictionary from 'oxford-dictionary';

// Types
import { IOxfordResponse } from './index.d';

// Variable Configuration
const spinner = Ora();
const dict = new Dictionary({
  app_id: process.env.OXFORD_APP_ID,
  app_key: process.env.OXFORD_APP_KEY,
  source_lang: 'en',
});

// IIFE to launch CLI options, and enable async/await
(async () => {
  spinner.info('Dictionary definer 📖\n');
  const answers = await inquirer
    .prompt([
      {
        message: 'Enter a word to define',
        name: 'word',
        type: 'input',
        validate: input => !!input,
      },
    ]);
  const word = answers.word;
  const definitions: string[] = [];
  const examples: string[] = [];
  try {
    // Perform Query
    const response: IOxfordResponse = await dict.find(word);
    // Validate Result
    if (response.results.length === 0) {
      spinner.fail('No results for given word');
      process.exit();
    }
    if (response.results.length > 1) {
      spinner.info('Multiple results available for this word, choosing first result');
    }
    // Iterate definitions and examples from results
    response.results[0].lexicalEntries.forEach(lex => {
      lex.entries.forEach(entry => {
        entry.senses.forEach(sense => {
          definitions.push(...sense.definitions);
          examples.push(...sense.examples.map(x => x.text));
        })
      });
    });
  } catch (e) {
    console.error('Error querying or parsing dictionary result');
    spinner.fail(`Error getting definition for given word: ${word}`);
    process.exit();
  }

  // Display Result
  spinner.succeed(`
    # Term: ${word}
    • Definitions:
      \t${definitions.join('.\n\t')}
    • Examples:
      \t${examples.join('.\n\t')}
  `);

  process.exit();
})();
