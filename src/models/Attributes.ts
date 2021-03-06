export enum Attributes {
  Fire = 0,
  Water = 1,
  Wood = 2,
  Light = 3,
  Dark = 4,
  Heart = 5,
  Jammer = 6,
  Poison = 7,
  MPoison = 8,
  Bomb = 9,
}

export namespace Attributes {
  export const names: Record<string, string> = {
    [Attributes.Fire]: 'Fire',
    [Attributes.Water]: 'Water',
    [Attributes.Wood]: 'Wood',
    [Attributes.Light]: 'Light',
    [Attributes.Dark]: 'Dark',
    [Attributes.Heart]: 'Heart',
    [Attributes.Jammer]: 'Jammer',
    [Attributes.Poison]: 'Poison',
    [Attributes.MPoison]: 'Mortal Poison',
    [Attributes.Bomb]: 'Bomb',
  };

  export function all() {
    return [
      Attributes.Fire,
      Attributes.Water,
      Attributes.Wood,
      Attributes.Light,
      Attributes.Dark
    ];
  }

  export function orbs() {
    return [
      Attributes.Fire,
      Attributes.Water,
      Attributes.Wood,
      Attributes.Light,
      Attributes.Dark,
      Attributes.Heart,
      Attributes.Jammer,
      Attributes.Poison,
      Attributes.MPoison,
      Attributes.Bomb,
    ];
  }
}