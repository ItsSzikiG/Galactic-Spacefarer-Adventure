using galactic.adventure as ga from '../db/schema';

@requires: 'authenticated-user'
service CosmicService {

  @odata.draft.enabled
  @restrict: [
    { grant: 'READ',                       where: 'originPlanet = $user.planet' },
    { grant: ['CREATE','UPDATE','DELETE'], to: 'Commander' }
  ]
  entity Spacefarers as projection on ga.Spacefarers;

  @restrict: [
    { grant: 'READ' },
    { grant: ['CREATE','UPDATE','DELETE'], to: 'Commander' }
  ]
  entity Departments as projection on ga.Departments;

  @restrict: [
    { grant: 'READ' },
    { grant: ['CREATE','UPDATE','DELETE'], to: 'Commander' }
  ]
  entity Positions   as projection on ga.Positions;
}