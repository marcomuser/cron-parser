// Utility functions
const readLinesFromStdin = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").split("\n");
};

const readTimeFromArgv = (argv) => argv.at(2).split(":");

const logLine = (hours, minutes, day, task) =>
  console.log(`${hours}:${minutes} ${day} - ${task}`);

const isLineTimeGreaterEqualArgTime = (lineTime, argTime) =>
  lineTime.getTime() >= argTime.getTime();

// Edge cases
const addOneHour = (hours) => (Number(hours) === 23 ? 0 : Number(hours) + 1);
const getArgMinutesWithResetCheck = (hours, argHours, argMinutes) =>
  hours === argHours ? argMinutes : "00";

// Constants
const today = "today";
const tomorrow = "tomorrow";

const main = async () => {
  const lines = await readLinesFromStdin(process.stdin);
  const [argHours, argMinutes] = readTimeFromArgv(process.argv);

  for (const line of lines) {
    const [minutes, hours, task] = line.split(" ");

    if (![minutes, hours].includes("*")) {
      if (
        isLineTimeGreaterEqualArgTime(
          new Date(2022, 1, 1, hours, minutes),
          new Date(2022, 1, 1, argHours, argMinutes)
        )
      ) {
        logLine(hours, minutes, today, task);
      } else {
        logLine(hours, minutes, tomorrow, task);
      }
    } else if (hours === "*" && minutes !== "*") {
      if (
        isLineTimeGreaterEqualArgTime(
          new Date(2022, 1, 1, 1, minutes),
          new Date(2022, 1, 1, 1, argMinutes)
        )
      ) {
        logLine(argHours, minutes, today, task);
      } else {
        logLine(addOneHour(argHours), minutes, tomorrow, task);
      }
    } else if (hours !== "*" && minutes === "*") {
      if (
        isLineTimeGreaterEqualArgTime(
          new Date(2022, 1, 1, hours, 1),
          new Date(2022, 1, 1, argHours, 1)
        )
      ) {
        logLine(
          hours,
          getArgMinutesWithResetCheck(hours, argHours, argMinutes),
          today,
          task
        );
      } else {
        logLine(hours, "00", tomorrow, task);
      }
    } else {
      logLine(argHours, argMinutes, today, task);
    }
  }
};

await main();
