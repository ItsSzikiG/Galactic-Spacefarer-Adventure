import cds from '@sap/cds';
import { Spacefarers, Spacefarer } from '#cds-models/CosmicService';

export default class CosmicService extends cds.ApplicationService {
  init() {
    this.before('CREATE', Spacefarers, (req) => {
      const s = req.data as Spacefarer;

      if (s.wormholeNavigationSkill == null) s.wormholeNavigationSkill = 1;
      if (s.wormholeNavigationSkill < 0 || s.wormholeNavigationSkill > 100) {
        return req.error(400, 'Wormhole navigation skill must be between 0 and 100.');
      }
      if (s.stardustCollection == null || s.stardustCollection < 0) s.stardustCollection = 0;

      s.stardustCollection += 100;
    });

    this.after('CREATE', Spacefarers, (data) => {
      if (!data) return;
      console.log(
        `[Cosmic Notification] Congratulations ${data.name}! ` +
        `You launched from ${data.originPlanet}. May the stardust be with you!`
      );
    });

    return super.init();
  }
}