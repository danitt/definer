// Environment Vars
import * as dotenv from 'dotenv';
dotenv.config();

// CLI Tools
import * as inquirer from 'inquirer';
import * as Ora from 'ora';

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
        message: 'Enter a word to define',
        name: 'word',
        type: 'input',
        validate: input => !!input,
      },
    ]);

  // Query API and extract definitions + examples
  const word = answers.word;
  let definitions: string[] = [];
  let examples: string[] = [];
  try {
    const response = await getDefinitions(word);
    definitions = parseResultDefinitions(response);
    examples = parseResultExamples(response);
  } catch (e) {
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

