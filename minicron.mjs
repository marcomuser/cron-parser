const [argHour, argMinute] = process.argv.at(2).split(":");

async function read(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const input = await read(process.stdin);

const lines = input.split("\n");

const arr = [];
for (const line of lines) {
  const [minute, hour, task] = line.split(" ");
  if (hour === "*" && minute === "*") {
    arr.push(`${argHour}:${argMinute} today - ${task}`);
  } else if (hour === "*" && argMinute > minute) {
    arr.push(`${Number(argHour) + 1}:${minute} today - ${task}`);
  }
}

console.log(arr);
