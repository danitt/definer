# Definer
Simple backend to query Oxford dictionary api

## Installation
`$ yarn`

## Basic Usage
1. `$ yarn start`
2. select 'single query'

## Batch Define
1. create a 'words.csv' file in the root of the project, one word per line
2. `$ yarn start`
3. select 'batch define'
_Note: batch querying is throttled to 1/sec to meet free plan constraints_