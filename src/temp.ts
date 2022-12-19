import * as fs from 'fs';

//read in ./src/temp.json

const temp = fs.readFileSync('./src/temp.json', 'utf8');

//parse the json
//@ts-ignore
const parsedTemp = JSON.parse(temp);

// //stringify the json
// const stringifiedTemp = JSON.stringify(parsedTemp.data,null,4);

// //write the json to ./src/temp.ts
// fs.writeFileSync('./src/temp.json', stringifiedTemp);

console.log(parsedTemp);
