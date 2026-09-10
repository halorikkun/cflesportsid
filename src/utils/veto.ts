import type { CollectionEntry } from 'astro:content';

export function resolveVeto(stage: Pick<CollectionEntry<'tournaments'>['data']['stages'][number], 'series' | 'veto'>, maps: Map<string, CollectionEntry<'maps'>>) {
  const config = stage.veto;
  if (!config) return undefined;
  if (stage.series.type !== 'fixed-maps' || stage.series.mapCount !== 3) throw new Error('Veto supports fixed three-map stages only.');
  if (new Set(config.mapPoolIds).size !== config.mapPoolIds.length) throw new Error('Duplicate veto map ID.');
  const pool = config.mapPoolIds.map(id => {
    const map = maps.get(id);
    if (!map) throw new Error(`Missing veto map: ${id}`);
    return { id, name: map.data.name };
  });
  for (const team of ['A', 'B']) {
    if (config.steps.filter(step => step.team === team && step.action === 'pick').length !== 1) throw new Error('Each team must have exactly one map pick.');
  }
  if (config.steps.length >= pool.length) throw new Error('Veto must leave at least one map for the wheel.');
  return { ...config, maps: pool };
}
