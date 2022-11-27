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
const willBeTomorrow = (hours) => Number(hours) + 1 === 24;
const getArgMinutesWithResetCheck = (hours, argHours, argMinutes) =>
  hours === argHours ? argMinutes : "00";

// Constants
const today = "today";
const tomorrow = "tomorrow";

const main = async () => {
  const lines = await readLinesFromStdin(process.stdin);
  const [argHours, argMinutes] = readTimeFromArgv(process.argv);

  const casesLookup = {
    noStars: (hours, minutes, task) => {
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
    },
    hoursStar: (minutes, task) => {
      if (
        isLineTimeGreaterEqualArgTime(
          new Date(2022, 1, 1, 1, minutes),
          new Date(2022, 1, 1, 1, argMinutes)
        )
      ) {
        logLine(argHours, minutes, today, task);
      } else {
        logLine(
          willBeTomorrow(argHours) ? "0" : Number(argHours) + 1,
          minutes,
          willBeTomorrow(argHours) ? tomorrow : today,
          task
        );
      }
    },
    minutesStar: (hours, task) => {
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
    },
    allStars: (task) => {
      logLine(argHours, argMinutes, today, task);
    },
  };

  for (const line of lines) {
    const [minutes, hours, task] = line.split(" ");

    if (hours !== "*" && minutes !== "*") {
      casesLookup.noStars(hours, minutes, task);
    } else if (hours === "*" && minutes !== "*") {
      casesLookup.hoursStar(minutes, task);
    } else if (hours !== "*" && minutes === "*") {
      casesLookup.minutesStar(hours, task);
    } else {
      casesLookup.allStars(task);
    }
  }
};

await main();
