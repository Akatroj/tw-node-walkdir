import fs from 'fs';
import walk from 'walkdir';

const rootDirectory = 'PAM08';

async function countLines(file) {
  return new Promise((resolve, reject) => {
    const regex = /\r\n|[\n\r\u0085\u2028\u2029]/g;
    const stream = fs.createReadStream(file);
    let lines = 0;
    stream
      .on('data', chunk => {
        lines += chunk.toString('utf8').split(regex).length - 1;
      })
      .on('end', () => {
        // console.log(file, lines);
        resolve(lines);
      })
      .on('error', reject);
  });
}

async function getPaths() {
  return new Promise((resolve, reject) => {
    const paths = [];
    walk(rootDirectory)
      .on('file', path => paths.push(path))
      .on('end', () => resolve(paths))
      .on('error', reject);
  });
}

async function countLinesForPathsSeq(paths) {
  console.log('Sequential');
  const results = [];
  console.time('sync');

  for (const path of paths) {
    const res = await countLines(path);
    results.push(res);
  }

  const sum = results.reduce((sum, curr) => sum + curr);
  console.log(`${sum} total lines.`);

  console.timeEnd('sync');
}

async function countLinesForPathsParallel(paths) {
  console.log('Parallel');
  console.time('async');

  const promiseArr = paths.map(async path => countLines(path));
  const results = await Promise.all(promiseArr);
  const sum = results.reduce((sum, curr) => sum + curr);
  console.log(`${sum} total lines.`);

  console.timeEnd('async');
}

async function run() {
  try {
    const paths = await getPaths();
    await countLinesForPathsParallel(paths);
    await countLinesForPathsSeq(paths);
  } catch (err) {
    console.error(err);
  }
}

run();
