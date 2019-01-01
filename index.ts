import * as dotenv from 'dotenv';
dotenv.config();

import * as inquirer from 'inquirer';
import * as Ora from 'ora';

const spinner = Ora();

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
  let definition;
  try {
    definition = 'test';
  } catch (e) {
    spinner.fail('Error getting definition for given word');
  }
  spinner.succeed(`
    ${word}:
    ${definition}
  `);
  process.exit();
})();
