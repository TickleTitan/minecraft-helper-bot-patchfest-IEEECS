// inventory/toolLogic.js
// Minimal tool requirement logic for mining

// You can expand this using mcData hardness info later.
const pickaxable = new Set([
  'stone', 'deepslate', 'iron_ore', 'gold_ore', 'coal_ore',
  'diamond_ore', 'copper_ore', 'redstone_ore', 'lapis_ore'
]);
const shovelable = new Set(['dirt', 'grass_block', 'sand', 'gravel', 'clay']);

function getRequiredTool(block) {
  if (pickaxable.has(block.name)) return 'pickaxe';
  if (shovelable.has(block.name)) return 'shovel';
  return null; // hand is fine
}

function findToolInInventory(bot, type) {
  const inv = bot.inventory.items();
  const lower = type.toLowerCase();
  return inv.find(
    item =>
      item.displayName.toLowerCase().includes(lower) ||
      item.name.toLowerCase().includes(lower)
  );
}

async function ensureToolEquipped(bot, block, log) {
  const needed = getRequiredTool(block);
  if (!needed) return true;

  const item = findToolInInventory(bot, needed);
  if (!item) {
    log(`Missing ${needed} for ${block.name}`);
    bot.chat(`I cannot mine ${block.name}; no ${needed} found.`);
    return false;
  }

  return new Promise(resolve => {
    bot.equip(item, 'hand', err => {
      if (err) {
        log(`Failed to equip ${item.displayName}: ${err.message}`);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = { ensureToolEquipped };
