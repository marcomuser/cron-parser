const readLinesFromStdin = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").split("\n");
};
const readTimeFromArgv = (argv) => argv.at(2).split(":");
const logLine = (hours, minutes, day, task) =>
  console.log(`${hours}:${minutes} ${day} - ${task}`);

const lines = await readLinesFromStdin(process.stdin);
const [argHours, argMinutes] = readTimeFromArgv(process.argv);

for (const line of lines) {
  const [minutes, hours, task] = line.split(" ");

  if (![minutes, hours].includes("*")) {
    const lineTime = new Date(2022, 1, 1, hours, minutes);
    const argTime = new Date(2022, 1, 1, argHours, argMinutes);

    if (lineTime.getTime() >= argTime.getTime()) {
      logLine(hours, minutes, "today", task);
    } else {
      logLine(hours, minutes, "tomorrow", task);
    }
  } else if (hours === "*" && minutes !== "*") {
    const lineTime = new Date(2022, 1, 1, 1, minutes);
    const argTime = new Date(2022, 1, 1, 1, argMinutes);

    if (lineTime.getTime() >= argTime.getTime()) {
      logLine(argHours, minutes, "today", task);
    } else {
      logLine(Number(argHours) + 1, minutes, "tomorrow", task);
    }
  } else if (hours !== "*" && minutes === "*") {
    const lineTime = new Date(2022, 1, 1, hours, 1);
    const argTime = new Date(2022, 1, 1, argHours, 1);

    if (lineTime.getTime() >= argTime.getTime()) {
      logLine(hours, argMinutes, "today", task);
    } else {
      logLine(Number(argHours) + 1, argMinutes, "today", task);
    }
  } else {
    logLine(argHours, argMinutes, "today", task);
  }
}
