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
    stats: BatterStats | PitcherStats | null;
    year: string;
    playerType: string;
    totalCount: number;
}

export class Stats_By_Team extends AbstractJavaScriptIndexCreationTask<PlayerDoc, MapResult> {
    constructor() {
        super();

        this.map('Stats', (player) => {
            return{
                totalCount: 1,
                team: player.team,
                year: player.year,
                stats: player.stats,
                playerType: player.playerType
            }
        })
        this.reduce((results: IndexingGroupResults<MapResult>) => {
            const groupedByTeamName = results.groupBy((result) => result.team);

            return groupedByTeamName.aggregate((group) => {
                const team = group.key;
                const totalBatters = group.values.filter( player => player.playerType === 'batter').reduce((sum, player) => sum + player.totalCount, 0);
                const totalPitchers =  group.values.filter( player => player.playerType === 'pitcher').reduce((sum, player) => sum + player.totalCount, 0);
                const totalHittingStats = group.values.filter(player => player.playerType === 'batter').reduce((acc, player) => {
                    for (const [key, value] of Object.entries(player.stats as BatterStats)) {
                        if(typeof value === 'number') {
                            acc[key] = (acc[key] || 0) + value;
                        }
                    }
                    return acc;
                }, {} as Record <string, number>)
                const totalPitchingStats = group.values.filter(player => player.playerType === 'pitcher').reduce((acc, player) => {
                    for (const [key, value] of Object.entries(player.stats as PitcherStats)) {
                        if(typeof value === 'number') {
                            acc[key] = (acc[key] || 0) + value;
                        }
                    }
                    return acc;
                }, {} as Record <string, number>)
                const avgHittingStats = group.values
                .filter(player => player.playerType === 'batter')
                .reduce((acc, player) => {
                    for (const [key, value] of Object.entries(player.stats as BatterStats)) {
                    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
                        if (!acc[key]) {
                        acc[key] = { sum: 0, count: 0 };
                        }
                        acc[key].sum += parseFloat(value);
                        acc[key].count += 1;
                    }
                    }
                    return acc; // ✅ return AFTER the loop finishes
                }, {} as Record<string, { sum: number; count: number }>);
                const avgPitchingStats = group.values
                .filter(player => player.playerType === 'pitcher')
                .reduce((acc, player) => {
                    for (const [key, value] of Object.entries(player.stats as PitcherStats)) {
                    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
                        if (!acc[key]) {
                        acc[key] = { sum: 0, count: 0 };
                        }
                        acc[key].sum += parseFloat(value);
                        acc[key].count += 1;
                    }
                    }
                    return acc; // ✅ return AFTER the loop finishes
                }, {} as Record<string, { sum: number; count: number }>);
                return {
                    team: team,
                    totalBatting: totalHittingStats.toString(),
                    totalPitching: totalPitchingStats.toString(),
                    avgBatting: avgHittingStats.toString(),
                    avgPitching: avgPitchingStats.toString(),
                    year: '2025',
                    playerType: 'accumulated',
                    totalCount: totalBatters + totalPitchers,
                    stats: null
                }
            })
        })
    }
}