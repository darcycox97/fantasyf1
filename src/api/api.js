const ERGAST_BASE = "https://ergast.com/api/f1";

const TEAMS = [
  {
    name: "Bob",
    drivers: ["perez", "kevin_magnussen"],
  },
  {
    name: "D",
    drivers: ["vettel", "gasly"],
  },
  {
    name: "Ella",
    drivers: ["norris", "albon"],
  },
  {
    name: "Haym",
    drivers: ["alonso", "bottas"],
  },
  {
    name: "Hend",
    drivers: ["russell", "ocon"],
  },
  {
    name: "Jack",
    drivers: ["sainz", "latifi"],
  },
  {
    name: "Len",
    drivers: ["hamilton", "tsunoda"],
  },
  {
    name: "Lis",
    drivers: ["leclerc", "mick_schumacher"],
  },
  {
    name: "Louie",
    drivers: ["max_verstappen", "stroll"],
  },
  {
    name: "Mitt",
    drivers: ["ricciardo", "zhou"],
  },
];

// round number -> [[old driver, new driver]]
const SUBSTITUTIONS = {
  1: [["vettel", "hulkenberg"]],
  2: [["vettel", "hulkenberg"]],
};

function calculatePointsForRace(race) {
  let results = race.Results;
  results.sort((a, b) => a.position - b.position);

  let driverPoints = {};
  let points = 1;
  let index = 0;
  while (
    results[index].status.toLowerCase() === "finished" ||
    results[index].status.toLowerCase().includes("lap")
  ) {
    let driverRes = results[index];
    driverPoints[driverRes.Driver.driverId] = points;
    points++;
    index++;
  }

  for (; index < results.length; ++index) {
    let driverRes = results[index];
    driverPoints[driverRes.Driver.driverId] = points;
  }

  return driverPoints;
}

async function getResults() {
  // todo: fetch teams from api
  //   const teams = await (await fetch(`${API_BASE}/teams`)).json();
  //   console.log(teams);

  let totalTeamPoints = {};
  TEAMS.forEach((t) => {
    totalTeamPoints[t.name] = { points: 0, pointsOverTime: [] };
  });

  // TODO: make paginated calls
  const jsonRes = await (
    await fetch(`${ERGAST_BASE}/2022/results.json?limit=10000`)
  ).json();
  const raceResults = jsonRes.MRData.RaceTable.Races;

  console.log("raw results:");
  console.log(raceResults);

  raceResults.forEach((raceElem) => {
    console.log(`processing race ${raceElem.round}: ${raceElem.raceName}`);
    let driverPoints = calculatePointsForRace(raceElem);
    let raceTeamPoints = new Map();
    console.log(driverPoints);
    TEAMS.forEach((t) => {
      raceTeamPoints.set(t.name, 0);
      t.drivers.forEach((d) => {
        let driverId = d;
        let currPoints = raceTeamPoints.get(t.name);
        const subDrivers = SUBSTITUTIONS[raceElem.round] || [];
        const sub = subDrivers.find((e) => e[0] === d);
        if (sub) {
          driverId = sub[1];
        }

        if (!(driverId in driverPoints)) {
          console.warn(`found no results for ${d} and no viable substitutes`);
        }
        raceTeamPoints.set(t.name, currPoints + driverPoints[driverId]);
      });
    });

    const sortedTeams = [...raceTeamPoints.entries()].sort((a, b) => {
      if (isNaN(a[1])) {
        return 1;
      } else if (isNaN(b[1])) {
        return -1;
      } else {
        return a[1] - b[1];
      }
    });

    // winning team (lowest score) of each race gets 10 points
    // losing team (highest score) of each race gets 1 point
    // in case of a tie, teams will get the same points determined by the place they share.
    // but teams scoring below the tied teams are not impacted by this.
    // i.e. tied first = 10 points each. next team down gets 8 points as they're in third place (2 teams ahead of them)
    let ranking = 10;
    let tied_teams = 1;
    for (let i = 0; i < sortedTeams.length; ++i) {
      let tName = sortedTeams[i][0];
      let currPoints = totalTeamPoints[tName].points;
      totalTeamPoints[tName].points = currPoints + ranking;
      totalTeamPoints[tName].pointsOverTime.push({
        points: ranking,
        raceScore: sortedTeams[i][1],
      });

      if (
        i !== sortedTeams.length - 1 &&
        sortedTeams[i + 1][1] !== sortedTeams[i][1]
      ) {
        // the next team in the list does not have the same score so should have a different ranking
        ranking -= tied_teams;
        tied_teams = 1;
      } else {
        tied_teams++;
      }
    }
  });

  console.log("Overall results:");
  console.log(totalTeamPoints);
  return totalTeamPoints;
}

export { getResults };
