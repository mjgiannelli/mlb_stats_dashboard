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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any;
  year: string;
  timestamp: string;
  playerType: string;
  ['@metadata']?: RavenMetadata;
}

dotenv.config();

async function getTeams() {
  const res = await fetch('https://statsapi.mlb.com/api/v1/teams?sportId=1');
  const data = await res.json();
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

async function ingest() {
  const session = store.openSession();
  const teams = await getTeams();

  for (const team of teams) {
    console.log(`📣 Ingesting players for team: ${team.name}`);
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

export type { PlayerDoc }