import { DeleteByQueryOperation } from 'ravendb';
import { store } from '../src/lib/raven.ts';
import * as dotenv from 'dotenv';

export type RavenMetadata = {
  ['@collection']?: string;
  ['@id']?: string;
  ['@change-vector']?: string;
};

interface PlayerDoc {
  playerId: number;
  name: string;
  team: string;
  gamesRemaining: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
  year: string;
  timestamp: string;
  playerType: string;
  ['@metadata']?: RavenMetadata;
}

interface Game {
  gameDate: string;
}

interface DateEntry {
  date: string;
  games: Game[];
}

interface ScheduleResponse {
  dates: DateEntry[];
}

dotenv.config();

async function getTeams() {
  const res = await fetch('https://statsapi.mlb.com/api/v1/teams?sportId=1');
  const data = await res.json();
  console.log('team data: ', data);
  return data.teams;
}

async function getRoster(teamId: number) {
  const res = await fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/roster/Active`);
  const data = await res.json();
  return data.roster;
}

async function getPlayerStats(playerId: number) {
  const res = await fetch(`https://statsapi.mlb.com/api/v1/people/${playerId}?hydrate=stats(group=[hitting,pitching],type=[season])&season=2025`);
  const data = await res.json();
  return data.people?.[0];
}

async function getGamesRemaining(teamId: number): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const endOfSeason = '2025-12-01';

  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${teamId}&season=2025&startDate=${today}&endDate=${endOfSeason}&gameTypes=R`;

  console.log(`🔍 Fetching regular season schedule for team ${teamId}: ${url}`);

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to fetch schedule: ${resp.statusText}\nBody: ${text}`);
  }

  const data: ScheduleResponse = await resp.json();
  const games: Game[] = data.dates.flatMap((date: DateEntry) => date.games);
  return games.length;
}

async function ingest() {
  await clearStatsCollection();

  const session = store.openSession();
  
  const teams = await getTeams();

  for (const team of teams) {
    console.log(`📣 Ingesting players for team: ${team.name}`);
    const teamGamesRemaining = await getGamesRemaining(team.id);
    const roster = await getRoster(team.id);
    for (const player of roster) {
      const playerData = await getPlayerStats(player.person.id);
      if (!playerData) continue;
      if (!playerData.stats) continue;

      const statsData = playerData?.stats[0]?.splits[0]?.stat;
      const playerType = statsData.era ? 'pitcher' : 'batter';

      const body: PlayerDoc = {
        playerId: player.person.id,
        name: player.person.fullName,
        team: team.name,
        gamesRemaining: teamGamesRemaining,
        year: playerData?.stats[0]?.splits[0]?.season,
        stats: statsData,
        playerType: playerType,
        timestamp: new Date().toISOString(),
        ['@metadata']: { ['@collection']: 'Stats' },
      };

      await session.store(body);
      console.log(`⚾ Saved: ${player.person.fullName} (${player.person.id})`);
    }
  }

  await session.saveChanges();
  console.log(`✅ Ingested MLB player data at ${new Date().toISOString()}`);
}

ingest().catch(err => {
  console.error('❌ Failed to ingest MLB data:', err);
});

async function clearStatsCollection() {
  const op = new DeleteByQueryOperation("from Stats"); // wipe collection
  await store.operations.send(op);
  console.log("🗑️ Cleared Stats collection before ingestion");
}

export type { PlayerDoc }