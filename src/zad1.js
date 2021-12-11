import { waterfall } from "async";

function printAsync(str, callback) {
  const delay = Math.floor(Math.random() * 1000 + 500);
  setTimeout(() => {
    console.log(str);
    if (callback) callback();
  }, delay);
}

async function task(n) {
  return new Promise(resolve => {
    printAsync(n, () => resolve(n));
  });
}

const tasks = async () => {
  return task(1)
    .then(n => {
      console.log("task", n, "done");
      return task(2);
    })
    .then(n => {
      console.log("task", n, "done");
      return task(3);
    })
    .then(n => {
      console.log("task", n, "done");
      console.log("done");
    });
};

// zad 1a
async function loop(m) {
  let taskArg = 0;
  for (let i = 0; i < m; i++) {
    taskArg = await task(taskArg + 1);
    console.log(`Task ${taskArg} done.`);
  }
  console.log("done");
}

// zad 1b
async function waterfallLoop(m) {
  const func = async i => {
    const res = await task(i);
    console.log(`Task ${res} done.`);
    return res + 1;
  };

  const initialFunc = async () => {
    return func(1);
  };

  const arr = [initialFunc];
  for (let i = 0; i < m - 1; i++) {
    arr.push(func);
  }
  return new Promise(resolve => waterfall(arr, resolve));
}

async function run() {
  await tasks();
  console.log("Tasks() done.");
  await loop(4);
  console.log("loop() done.");
  await waterfallLoop(4);
  console.log("waterfallLoop() done.");
}

run();
