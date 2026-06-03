namespace galactic.adventure;
using { cuid, managed } from '@sap/cds/common';

entity Spacefarers : cuid, managed {
  name                    : String(100) @mandatory;
  originPlanet            : String(50)  @mandatory;
  spacesuitColor          : String(30);
  stardustCollection      : Integer default 1;
  wormholeNavigationSkill  : Integer default 1;
  department              : Association to Departments;
  position                : Association to Positions;
}

entity Departments : cuid {
  name        : String(100); @mandatory
  description : String(200);
  spacefarers : Association to many Spacefarers on spacefarers.department = $self;
}

entity Positions : cuid {
  title       : String(100); @mandatory
  level       : Integer;
  spacefarers : Association to many Spacefarers on spacefarers.position = $self;
}