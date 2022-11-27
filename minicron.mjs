const readLinesFromStdin = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").split("\n");
};
const readTimeFromArgv = (argv) => argv.at(2).split(":");

const lines = await readLinesFromStdin(process.stdin);
const [argHours, argMinutes] = readTimeFromArgv(process.argv);

for (const line of lines) {
  const [minutes, hours, task] = line.split(" ");
  const lineTime = new Date(2022, 1, 1, hours, minutes);
  const argTime = new Date(2022, 1, 1, argHours, argMinutes);

  if (![minutes, hours].includes("*")) {
    if (lineTime.getTime() >= argTime.getTime()) {
      console.log(`${hours}:${minutes} today - ${task}`);
    } else {
      console.log(`${hours}:${minutes} tomorrow - ${task}`);
    }
  } else if (hours === "*") {
  }
}
