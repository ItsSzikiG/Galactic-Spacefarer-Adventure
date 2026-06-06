import { describe, it } from '@jest/globals';
import cds from '@sap/cds';

const { GET, POST, PATCH, expect } = cds.test(__dirname + '/..');

// Mocked users from .cdsrc.json
const ZORA = { username: 'zora', password: 'cosmos' }; // Commander, planet Tatooine
const KAEL = { username: 'kael', password: 'cosmos' }; //   authenticated, planet Naboo

const SF = '/odata/v4/cosmic/Spacefarers';

// Drive the real Fiori draft choreography: create a draft, fill it, then activate.
// Returns the activated (active) entity. Throws (via axios) if activation is rejected.
async function createActive(data: Record<string, unknown>, auth = ZORA) {
  const { data: draft } = await POST(SF, {}, { auth });
  const key = `ID=${draft.ID},IsActiveEntity=false`;
  await PATCH(`${SF}(${key})`, data, { auth });
  const { data: active } = await POST(
    `${SF}(${key})/CosmicService.draftActivate`, {}, { auth },
  );
  return active;
}

// Helper to assert an awaited request is rejected with a given HTTP status.
async function expectStatus(promise: Promise<unknown>, status: number) {
  try {
    await promise;
    expect.fail(`expected request to be rejected with ${status}`);
  } catch (err: any) {
    expect(err.response?.status).to.equal(status);
  }
}

const validData = (over = {}) => ({
  name: 'Test Farer',
  email: 'test.farer@tatooine.galaxy',
  originPlanet: 'Tatooine',
  ...over,
});

describe('CosmicService - Spacefarers business logic', () => {

  it('applies launch bonuses on activation (+15 stardust, +10 skill)', async () => {
    const active = await createActive(validData({ stardustCollection: 100, wormholeNavigationSkill: 50 }));
    expect(active.stardustCollection).to.equal(115);
    expect(active.wormholeNavigationSkill).to.equal(60);
  });

  it('floors negative stardust to 0 before applying the bonus', async () => {
    const active = await createActive(validData({ stardustCollection: -5, wormholeNavigationSkill: 20 }));
    expect(active.stardustCollection).to.equal(15); // 0 + 15
  });

  it('rejects out-of-range skill on create (activation)', async () => {
    const { data: draft } = await POST(SF, {}, { auth: ZORA });
    const key = `ID=${draft.ID},IsActiveEntity=false`;
    await PATCH(`${SF}(${key})`, validData({ wormholeNavigationSkill: 150 }), { auth: ZORA });
    await expectStatus(
      POST(`${SF}(${key})/CosmicService.draftActivate`, {}, { auth: ZORA }),
      400,
    );
  });

  it('rejects out-of-range skill on update (the new guard)', async () => {
    const active = await createActive(validData({ wormholeNavigationSkill: 40 }));
    const activeKey = `ID=${active.ID},IsActiveEntity=true`;

    // EDIT -> PATCH draft -> activate
    await POST(`${SF}(${activeKey})/CosmicService.draftEdit`, { PreserveChanges: true }, { auth: ZORA });
    const draftKey = `ID=${active.ID},IsActiveEntity=false`;
    await PATCH(`${SF}(${draftKey})`, { wormholeNavigationSkill: 999 }, { auth: ZORA });
    await expectStatus(
      POST(`${SF}(${draftKey})/CosmicService.draftActivate`, {}, { auth: ZORA }),
      400,
    );
  });
});

describe('CosmicService - authorization', () => {

  it('forbids non-Commander from creating Spacefarers', async () => {
    await expectStatus(POST(SF, {}, { auth: KAEL }), 403);
  });

  it('forbids non-Commander from writing reference data (Departments)', async () => {
    await expectStatus(
      POST('/odata/v4/cosmic/Departments', { name: 'Rogue Squadron' }, { auth: KAEL }),
      403,
    );
  });

  it('allows authenticated users to read reference data (Departments)', async () => {
    const { status } = await GET('/odata/v4/cosmic/Departments', { auth: KAEL });
    expect(status).to.equal(200);
  });

  it('does not leak cross-planet spacefarers via Positions navigation', async () => {
    // The spacefarers back-association is excluded from the reference-data
    // projections, so this navigation (which would bypass the planet filter)
    // no longer exists.
    await expectStatus(
      GET('/odata/v4/cosmic/Positions?$expand=spacefarers', { auth: KAEL }),
      400,
    );
  });
});
