import { cmd } from '../command.js';
import fs from 'fs-extra';
import path from 'path';
import config from '../config.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cmd({
    pattern: "setprefix",
    alias: ["sp", "changeprefix", "prefixset"],
    desc: "Change bot prefix",
    category: "owner",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, isOwner, prefix: currentPrefix }) => {
    try {

        if (!isOwner) {
            return reply('❌ *Access Denied!*\n\nOnly bot owner can change the prefix.');
        }

        if (!q || q.trim() === '') {
            return reply(`📌 *Current Prefix:* \`${currentPrefix}\`

📝 *How to use:*
\`${currentPrefix}setprefix [new_prefix]\`

📌 *Examples:*
• \`${currentPrefix}setprefix !\`
• \`${currentPrefix}setprefix /\`
• \`${currentPrefix}setprefix #\`
• \`${currentPrefix}setprefix $\``);
        }

        const newPrefix = q.trim();

        if (newPrefix.length > 2) {
            return reply(`❌ *Invalid Prefix!*

Prefix must be only 1 or 2 characters long.

📌 Examples: ! / # $ ? +`);
        }

        const configPath = path.join(__dirname, '../config.js');

        if (!await fs.pathExists(configPath)) {
            return reply('❌ *Error!*\n\nConfig file not found.');
        }

        let configContent = await fs.readFile(configPath, 'utf-8');

        let newContent = configContent.replace(
            /PREFIX:\s*['"`](.*?)['"`]/,
            `PREFIX: '${newPrefix}'`
        );

        await fs.writeFile(configPath, newContent, 'utf-8');

        try {
            config.PREFIX = newPrefix;
        } catch (e) {}

        return reply(`╭━━━〔 ⚙️ PREFIX CHANGED 〕━━━┈⊷
┃
┃ ✅ Successfully Changed!
┃
┃ 📌 Old Prefix: \`${currentPrefix}\`
┃ 📌 New Prefix: \`${newPrefix}\`
┃
┃ 📝 Example: \`${newPrefix}menu\`
┃
╰━━━━━━━━━━━━━━━━━━━┈⊷`);

    } catch (error) {
        console.error(error);
        reply(`❌ Error!\n\n${error.message}`);
    }
});