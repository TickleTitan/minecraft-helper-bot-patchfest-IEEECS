// inventory/toolLogic.js
// Very simplified – you can expand with real mcData hardness checks [web:103]
const pickaxable = new Set(["stone", "iron_ore", "gold_ore", "coal_ore", "diamond_ore"]);
const shovelable = new Set(["dirt", "sand", "gravel"]);

function getRequiredTool(block) {
  if (pickaxable.has(block.name)) return "pickaxe";
  if (shovelable.has(block.name)) return "shovel";
  return null;
}

function findToolInInventory(bot, requiredType) {
  const inv = bot.inventory.items();
  return inv.find(item =>
    item.name.includes(requiredType) || item.displayName.toLowerCase().includes(requiredType)
  );
}

async function ensureToolEquipped(bot, block, log) {
  const needed = getRequiredTool(block);
  if (!needed) return true; // any tool/hand is ok

  const item = findToolInInventory(bot, needed);
  if (!item) {
    log(`Missing ${needed} for block ${block.name}`);
    bot.chat(`I cannot mine ${block.name} safely; no ${needed} found.`);
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
