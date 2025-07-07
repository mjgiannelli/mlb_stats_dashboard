import { store } from '../src/lib/raven.ts';
import * as dotenv from 'dotenv';

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
    const roster = await getRoster(team.id);
    for (const player of roster) {
      const playerData = await getPlayerStats(player.person.id);
      if (!playerData) continue;

      await session.store({
        _collection: 'players_raw',
        playerId: player.person.id,
        name: player.person.fullName,
        team: team.name,
        stats: playerData.stats,
        timestamp: new Date().toISOString(),
      });
    }
  }

  await session.saveChanges();
  console.log(`✅ Ingested MLB player data at ${new Date().toISOString()}`);
}

ingest().catch(err => {
  console.error('❌ Failed to ingest MLB data:', err);
});
