import { AbstractJavaScriptIndexCreationTask, IndexingGroupResults } from "ravendb";
import type { PlayerDoc } from "../../scripts/ingest-mlb.ts";

export interface BatterStats {
  // Numeric fields
  age: number;
  gamesPlayed: number;
  groundOuts: number;
  airOuts: number;
  runs: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  strikeOuts: number;
  baseOnBalls: number;
  intentionalWalks: number;
  hits: number;
  hitByPitch: number;
  atBats: number;
  caughtStealing: number;
  stolenBases: number;
  groundIntoDoublePlay: number;
  numberOfPitches: number;
  plateAppearances: number;
  totalBases: number;
  rbi: number;
  leftOnBase: number;
  sacBunts: number;
  sacFlies: number;
  catchersInterference: number;

  // String (averagable) fields
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  stolenBasePercentage: string;
  caughtStealingPercentage: string;
  babip: string;
  groundOutsToAirouts: string;
  atBatsPerHomeRun: string;
}

export interface PitcherStats {
  // Numeric fields
  age: number;
  gamesPlayed: number;
  gamesStarted: number;
  groundOuts: number;
  airOuts: number;
  runs: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  strikeOuts: number;
  baseOnBalls: number;
  intentionalWalks: number;
  hits: number;
  hitByPitch: number;
  atBats: number;
  caughtStealing: number;
  stolenBases: number;
  groundIntoDoublePlay: number;
  numberOfPitches: number;
  wins: number;
  losses: number;
  saves: number;
  saveOpportunities: number;
  holds: number;
  blownSaves: number;
  earnedRuns: number;
  battersFaced: number;
  outs: number;
  gamesPitched: number;
  completeGames: number;
  shutouts: number;
  strikes: number;
  hitBatsmen: number;
  balks: number;
  wildPitches: number;
  pickoffs: number;
  totalBases: number;
  inheritedRunners: number;
  inheritedRunnersScored: number;
  catchersInterference: number;
  sacBunts: number;
  sacFlies: number;
  gamesFinished: number;

  // String (averagable) fields
  avg: string;
  obp: string;
  slg: string;
  ops: string;
  stolenBasePercentage: string;
  caughtStealingPercentage: string;
  era: string;
  inningsPitched: string;
  whip: string;
  groundOutsToAirouts: string;
  winPercentage: string;
  pitchesPerInning: string;
  strikeoutWalkRatio: string;
  strikeoutsPer9Inn: string;
  walksPer9Inn: string;
  hitsPer9Inn: string;
  runsScoredPer9: string;
  homeRunsPer9: string;
  strikePercentage: string;
}

type MapResult = {
  team: string;
  year: string;
  playerType: string;
  totalCount: number;

  // Batting Totals (numeric)
  totalAge?: number;
  totalGamesPlayed?: number;
  totalGroundOuts?: number;
  totalAirOuts?: number;
  totalRuns?: number;
  totalDoubles?: number;
  totalTriples?: number;
  totalHomeRuns?: number;
  totalStrikeOuts?: number;
  totalBaseOnBalls?: number;
  totalIntentionalWalks?: number;
  totalHits?: number;
  totalHitByPitch?: number;
  totalAtBats?: number;
  totalCaughtStealing?: number;
  totalStolenBases?: number;
  totalGroundIntoDoublePlay?: number;
  totalNumberOfPitches?: number;
  totalPlateAppearances?: number;
  totalTotalBases?: number;
  totalRbi?: number;
  totalLeftOnBase?: number;
  totalSacBunts?: number;
  totalSacFlies?: number;
  totalCatchersInterference?: number;

  // Batting Averages (string)
  avgAvg?: string;
  avgObp?: string;
  avgSlg?: string;
  avgOps?: string;
  avgStolenBasePercentage?: string;
  avgCaughtStealingPercentage?: string;
  avgBabip?: string;
  avgGroundOutsToAirouts?: string;
  avgAtBatsPerHomeRun?: string;

  // Pitching Totals (numeric)
  totalGamesStarted?: number;
  totalWins?: number;
  totalLosses?: number;
  totalSaves?: number;
  totalSaveOpportunities?: number;
  totalHolds?: number;
  totalBlownSaves?: number;
  totalEarnedRuns?: number;
  totalBattersFaced?: number;
  totalOuts?: number;
  totalGamesPitched?: number;
  totalCompleteGames?: number;
  totalShutouts?: number;
  totalStrikes?: number;
  totalHitBatsmen?: number;
  totalBalks?: number;
  totalWildPitches?: number;
  totalPickoffs?: number;
  totalInheritedRunners?: number;
  totalInheritedRunnersScored?: number;
  totalGamesFinished?: number;

  // Pitching Averages (string)
  avgEra?: string;
  avgInningsPitched?: string;
  avgWhip?: string;
  avgWinPercentage?: string;
  avgPitchesPerInning?: string;
  avgStrikeoutWalkRatio?: string;
  avgStrikeoutsPer9Inn?: string;
  avgWalksPer9Inn?: string;
  avgHitsPer9Inn?: string;
  avgRunsScoredPer9?: string;
  avgHomeRunsPer9?: string;
  avgStrikePercentage?: string;

  // Individual properties (optional)
  age?: number;
  gamesPlayed?: number;
  gamesStarted?: number;
  groundOuts?: number;
  airOuts?: number;
  runs?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  strikeOuts?: number;
  baseOnBalls?: number;
  intentionalWalks?: number;
  hits?: number;
  hitByPitch?: number;
  atBats?: number;
  caughtStealing?: number;
  stolenBases?: number;
  groundIntoDoublePlay?: number;
  numberOfPitches?: number;
  plateAppearances?: number;
  totalBases?: number;
  rbi?: number;
  leftOnBase?: number;
  sacBunts?: number;
  sacFlies?: number;
  catchersInterference?: number;

  wins?: number;
  losses?: number;
  saves?: number;
  saveOpportunities?: number;
  holds?: number;
  blownSaves?: number;
  earnedRuns?: number;
  battersFaced?: number;
  outs?: number;
  gamesPitched?: number;
  completeGames?: number;
  shutouts?: number;
  strikes?: number;
  hitBatsmen?: number;
  balks?: number;
  wildPitches?: number;
  pickoffs?: number;
  inheritedRunners?: number;
  inheritedRunnersScored?: number;
  gamesFinished?: number;

  avg?: string;
  obp?: string;
  slg?: string;
  ops?: string;
  stolenBasePercentage?: string;
  caughtStealingPercentage?: string;
  era?: string;
  inningsPitched?: string;
  whip?: string;
  groundOutsToAirouts?: string;
  winPercentage?: string;
  pitchesPerInning?: string;
  strikeoutWalkRatio?: string;
  strikeoutsPer9Inn?: string;
  walksPer9Inn?: string;
  hitsPer9Inn?: string;
  runsScoredPer9?: string;
  homeRunsPer9?: string;
  strikePercentage?: string;
};
export class Stats_By_Team extends AbstractJavaScriptIndexCreationTask<PlayerDoc, MapResult> {
  constructor() {
    super();

    this.map('Stats', (player) => ({
        totalCount: 1,
        team: player.team,
        year: player.year,
        playerType: player.playerType,
        age: player.stats.age ?? null,
        gamesPlayed: player.stats.gamesPlayed ?? null,
        gamesStarted: player.stats.gamesStarted ?? null,
        groundOuts: player.stats.groundOuts ?? null,
        airOuts: player.stats.airOuts ?? null,
        runs: player.stats.runs ?? null,
        doubles: player.stats.doubles ?? null,
        triples: player.stats.triples ?? null,
        homeRuns: player.stats.homeRuns ?? null,
        strikeOuts: player.stats.strikeOuts ?? null,
        baseOnBalls: player.stats.baseOnBalls ?? null,
        intentionalWalks: player.stats.intentionalWalks ?? null,
        hits: player.stats.hits ?? null,
        hitByPitch: player.stats.hitByPitch ?? null,
        atBats: player.stats.atBats ?? null,
        caughtStealing: player.stats.caughtStealing ?? null,
        stolenBases: player.stats.stolenBases ?? null,
        groundIntoDoublePlay: player.stats.groundIntoDoublePlay ?? null,
        numberOfPitches: player.stats.numberOfPitches ?? null,
        wins: player.stats.wins ?? null,
        losses: player.stats.losses ?? null,
        saves: player.stats.saves ?? null,
        saveOpportunities: player.stats.saveOpportunities ?? null,
        holds: player.stats.holds ?? null,
        blownSaves: player.stats.blownSaves ?? null,
        earnedRuns: player.stats.earnedRuns ?? null,
        battersFaced: player.stats.battersFaced ?? null,
        outs: player.stats.outs ?? null,
        gamesPitched: player.stats.gamesPitched ?? null,
        completeGames: player.stats.completeGames ?? null,
        shutouts: player.stats.shutouts ?? null,
        strikes: player.stats.strikes ?? null,
        hitBatsmen: player.stats.hitBatsmen ?? null,
        balks: player.stats.balks ?? null,
        wildPitches: player.stats.wildPitches ?? null,
        pickoffs: player.stats.pickoffs ?? null,
        totalBases: player.stats.totalBases ?? null,
        inheritedRunners: player.stats.inheritedRunners ?? null,
        inheritedRunnersScored: player.stats.inheritedRunnersScored ?? null,
        catchersInterference: player.stats.catchersInterference ?? null,
        sacBunts: player.stats.sacBunts ?? null,
        sacFlies: player.stats.sacFlies ?? null,
        gamesFinished: player.stats.gamesFinished ?? null,

        // String fields
        avg: player.stats.avg ?? null,
        obp: player.stats.obp ?? null,
        slg: player.stats.slg ?? null,
        ops: player.stats.ops ?? null,
        stolenBasePercentage: player.stats.stolenBasePercentage ?? null,
        caughtStealingPercentage: player.stats.caughtStealingPercentage ?? null,
        babip: player.stats.babip ?? null,
        groundOutsToAirouts: player.stats.groundOutsToAirouts ?? null,
        atBatsPerHomeRun: player.stats.atBatsPerHomeRun ?? null,
        era: player.stats.era ?? null,
        inningsPitched: player.stats.inningsPitched ?? null,
        whip: player.stats.whip ?? null,
        winPercentage: player.stats.winPercentage ?? null,
        pitchesPerInning: player.stats.pitchesPerInning ?? null,
        strikeoutWalkRatio: player.stats.strikeoutWalkRatio ?? null,
        strikeoutsPer9Inn: player.stats.strikeoutsPer9Inn ?? null,
        walksPer9Inn: player.stats.walksPer9Inn ?? null,
        hitsPer9Inn: player.stats.hitsPer9Inn ?? null,
        runsScoredPer9: player.stats.runsScoredPer9 ?? null,
        homeRunsPer9: player.stats.homeRunsPer9 ?? null,
        strikePercentage: player.stats.strikePercentage ?? null,
    }));

    this.reduce((results: IndexingGroupResults<MapResult>) => {
      const groupedByTeamName = results.groupBy(result => result.team);

      return groupedByTeamName.aggregate(group => {
        const team = group.key;
        const batters = group.values.filter(p => p.playerType === 'batter');
        const pitchers = group.values.filter(p => p.playerType === 'pitcher');
        const totalBatters = batters.reduce((sum, p) => sum + p.totalCount, 0);
        const totalPitchers = pitchers.reduce((sum, p) => sum + p.totalCount, 0);

        const output: Record<string, unknown> = {
          team: team,
          year: '2025',
          playerType: 'accumulated',
          totalCount: totalBatters + totalPitchers,
        };

        // // Flatten numeric totals for batters
        // for (const player of batters) {
        //   for (const [key, value] of Object.entries(JSON.parse(player.stats as string) as BatterStats)) {
        //     if (typeof value === 'number') {
        //       const statKey = `total${capitalize(key)}`;
        //       output[statKey] = (output[statKey] || 0) as number + value;
        //     }
        //   }
        // }

        // // Flatten numeric totals for pitchers
        // for (const player of pitchers) {
        //   for (const [key, value] of Object.entries(JSON.parse(player.stats as string) as PitcherStats)) {
        //     if (typeof value === 'number') {
        //       const statKey = `total${capitalize(key)}`;
        //       output[statKey] = (output[statKey] || 0) as number + value;
        //     }
        //   }
        // }

        // // Flatten average string stats for batters
        // const avgBatting: Record<string, { sum: number; count: number }> = {};
        // for (const player of batters) {
        //   for (const [key, value] of Object.entries(JSON.parse(player.stats as string) as BatterStats)) {
        //     if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        //       if (!avgBatting[key]) avgBatting[key] = { sum: 0, count: 0 };
        //       avgBatting[key].sum += parseFloat(value);
        //       avgBatting[key].count += 1;
        //     }
        //   }
        // }
        // for (const [key, { sum, count }] of Object.entries(avgBatting)) {
        //   const statKey = `avg${capitalize(key)}`;
        //   output[statKey] = (sum / count).toFixed(3); // Use toFixed to simulate standard AVG precision
        // }

        // // Flatten average string stats for pitchers
        // const avgPitching: Record<string, { sum: number; count: number }> = {};
        // for (const player of pitchers) {
        //   for (const [key, value] of Object.entries(JSON.parse(player.stats as string) as PitcherStats)) {
        //     if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        //       if (!avgPitching[key]) avgPitching[key] = { sum: 0, count: 0 };
        //       avgPitching[key].sum += parseFloat(value);
        //       avgPitching[key].count += 1;
        //     }
        //   }
        // }
        // for (const [key, { sum, count }] of Object.entries(avgPitching)) {
        //   const statKey = `avg${capitalize(key)}`;
        //   output[statKey] = (sum / count).toFixed(3);
        // }

        // Return final flattened object
        return output as MapResult;
      });
    });

    // function capitalize(str: string): string {
    //   return str.charAt(0).toUpperCase() + str.slice(1);
    // }
  }
}