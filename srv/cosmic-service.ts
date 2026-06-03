import cds from '@sap/cds';
import { Spacefarers, Spacefarer } from '#cds-models/CosmicService';

const LOG = cds.log('cosmic');

const LAUNCH_STARDUST_BONUS = 15;
const LAUNCH_WORMHOLE_BONUS = 10;
const SKILL_MIN = 0;
const SKILL_MAX = 100;

export default class CosmicService extends cds.ApplicationService {
  init() {
    this.before('CREATE', Spacefarers, (req) => {
      const s = req.data as Spacefarer;

      if (s.wormholeNavigationSkill == null) s.wormholeNavigationSkill = 1;
      if (s.wormholeNavigationSkill < SKILL_MIN || s.wormholeNavigationSkill > SKILL_MAX) {
        return req.reject(400, `Wormhole navigation skill must be between ${SKILL_MIN} and ${SKILL_MAX}.`);
      }
      if (s.stardustCollection == null || s.stardustCollection < 0) s.stardustCollection = 0;

      s.stardustCollection += LAUNCH_STARDUST_BONUS;
      s.wormholeNavigationSkill += LAUNCH_WORMHOLE_BONUS;
    });

    this.after('CREATE', Spacefarers, (data, req) => {
      if (!data) return;
      const s = data as Spacefarer;
      req.on('succeeded', () => this.sendCosmicWelcome(s));
    });

    return super.init();
  }

  private sendCosmicWelcome(s: Spacefarer): void {
    if (!s.email) return;
    LOG.info(
      `[Cosmic Notification] To: ${s.email} — Congratulations ${s.name}! ` +
      `You launched from ${s.originPlanet} with ${s.stardustCollection} stardust ` +
      `and wormhole navigation skill ${s.wormholeNavigationSkill}. ` +
      `May the stardust be with you among the stars.`
    );
  }
}
