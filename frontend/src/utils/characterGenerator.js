const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Tiefling', 'Dragonborn'];
const classes = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Paladin', 'Ranger'];
const backgrounds = ['Soldier', 'Sage', 'Criminal', 'Folk Hero', 'Noble', 'Hermit'];
const equipmentSets = [
  ['Longsword', 'Shield', 'Chainmail'],
  ['Dagger', 'Spellbook', 'Robes'],
  ['Shortbow', 'Leather Armor', 'Thieves’ Tools'],
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollAbilityScore() {
  const rolls = Array(4).fill(0).map(() => Math.ceil(Math.random() * 6));
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0);
}

export function generateRandomCharacter() {
  const stats = {
    strength: rollAbilityScore(),
    dexterity: rollAbilityScore(),
    constitution: rollAbilityScore(),
    intelligence: rollAbilityScore(),
    wisdom: rollAbilityScore(),
    charisma: rollAbilityScore(),
  };

  return {
    race: getRandomItem(races),
    className: getRandomItem(classes),
    level: 1,
    stats,
    equipment: getRandomItem(equipmentSets),
    background: getRandomItem(backgrounds),
  };
}
