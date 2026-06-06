# Galactic Spacefarer Adventure

A SAP CAP application managing spacefarers across the SAP galaxy. It exposes an OData V4 service with cosmic business logic and a SAP Fiori Elements List Report / Object Page UI.

## Stack

SAP CAP (`@sap/cds` 9) with TypeScript handlers, SQLite (`@cap-js/sqlite`), and SAP Fiori Elements via `cds-plugin-ui5`.

## Data Model

`Spacefarers` (`cuid`, `managed`): `name`, `email`, `originPlanet`, `spacesuitColor`, `stardustCollection`, `wormholeNavigationSkill`, plus associations to `Departments` and `Positions`. See [db/schema.cds](db/schema.cds).

## Service

`CosmicService` at `/odata/v4/cosmic/` — see [srv/cosmic-service.cds](srv/cosmic-service.cds):

- `@requires: 'authenticated-user'` — anonymous access rejected.
- `READ where originPlanet = $user.planet` — users only see spacefarers from their own planet (Planet X cannot read Planet Y).
- `CREATE/UPDATE/DELETE` restricted to the `Commander` role.
- `Departments` and `Positions` (reference data): readable by any authenticated user, writable only by `Commander`. Their `spacefarers` back-association is excluded from the projections so the planet filter on `Spacefarers` can't be bypassed via navigation/`$expand`.
- `@odata.draft.enabled` — powers the editable Fiori Object Page.

### Event handlers ([srv/cosmic-service.ts](srv/cosmic-service.ts))

- `@Before CREATE` — defaults a missing wormhole skill to 1, floors negative stardust to 0, and grants a launch bonus (+15 stardust, +10 skill, capped at 100).
- `@Before CREATE/UPDATE` and draft `SAVE` — rejects a wormhole skill outside 0–100, so the guard holds on edits and draft activation, not just creation.
- `@After CREATE` — on transaction commit (`req.on('succeeded')`), sends a cosmic welcome notification to the spacefarer's email (logged locally).

## Running

```sh
npm install
npm run watch-spacefarers
```

Mocked users ([.cdsrc.json](.cdsrc.json), password `cosmos`):

| User | Roles | Planet |
|---|---|---|
| `zora` | `Commander`, `authenticated-user` | Tatooine |
| `kael` | `authenticated-user` | Naboo |

Service: <http://localhost:4004/odata/v4/cosmic/> — App: <http://localhost:4004/galactic.spacefarer.ui.spacefarers/index.html>

## Testing

```sh
npm test
```

Jest + ts-jest run `cds.test` against the service (see [test/cosmic-service.test.ts](test/cosmic-service.test.ts)), covering the launch bonuses, stardust flooring, skill-range rejection on create/update, and the authorization rules. `test/setup.ts` sets `CDS_TYPESCRIPT=true` so the TypeScript handler is loaded under tests.
