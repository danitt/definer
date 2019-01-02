// Environment Vars
import * as dotenv from 'dotenv';
dotenv.config();

// CLI Tools
import * as inquirer from 'inquirer';
import * as Ora from 'ora';

// Batch import CSV dependencies
import * as fs from 'fs';
import * as parse from 'csv-parse/lib/sync';

// Dictionary Util
import { getDefinitions, parseResultDefinitions, parseResultExamples } from './dictionary';

// Variable Configuration
const spinner = Ora();

// IIFE to launch CLI options, and enable async/await
(async () => {
  // User Input
  spinner.info('Dictionary definer 📖\n');
  const answers = await inquirer
    .prompt([
      {
        choices: [
          { name: 'Single', value: 'single' },
          { name: 'Batch (see README for details)', value: 'batch' },
        ],
        message: `Single word query, or batch query?`,
        name: 'queryType',
        type: 'list',
      },
    ]);
  
  // Querying single term only
  if (answers.queryType === 'single') {
    const singleAnswer = await inquirer
      .prompt([
        {
          message: 'Enter a word to define',
          name: 'word',
          type: 'input',
          validate: input => !!input,
        },
      ]);
    await queryExtractDisplayTerm(singleAnswer.word);
    process.exit();
  }

  // Batch querying terms
  if (answers.queryType === 'batch') {
    try {
      // Extract words array from file
      const wordsRaw = fs.readFileSync('./words.csv').toString();
      const wordsParsed = parse(wordsRaw, { skip_empty_lines: true });
      const words = wordsParsed.map(x => x.reduce(y => y));
      // Iterate words array and synchronously display definitions/examples
      for (const word of words) {
        await queryExtractDisplayTerm(word);
        // Throttle each additional query by 1 sec (free dictionary API is rate-limited)
        const isLastWord = words[words.length-1] === word;
        if (!isLastWord) {
          await new Promise(res => setTimeout(() => res(), 1000));
        }
      }
      spinner.succeed('All words defined!');
      process.exit();
    } catch(e) {
      console.error(e);
      spinner.fail('Error processing batch');
      process.exit();
    }
  }

  process.exit();
})();

async function queryExtractDisplayTerm(word: string) {
  let definitions: string[] = [];
  let examples: string[] = [];
  try {
    spinner.info(`Fetching definition for "${word}"..`);
    const response = await getDefinitions(word);
    definitions = parseResultDefinitions(response);
    examples = parseResultExamples(response);
  } catch (e) {
    console.error(e);
    spinner.fail(`Error getting definition for given word: ${word}`);
    process.exit();
  }

  displaySimpleResult(word, definitions, examples);
}

function displaySimpleResult(word: string, definitions: string[], examples: string[]) {
  spinner.succeed(`
    # Term: ${word}
    • Definitions:
      \t${definitions.join('.\n\t')}
    • Examples:
      \t${examples.join('.\n\t')}
  `);
}
