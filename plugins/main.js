import config from '../config.js';
import { cmd } from '../command.js';
import { getGroupAdmins, fetchJson } from '../lib/functions.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ✅ OWNER = DEV FULL ACCESS
const isDev = true


// ================== TAGALL ==================
cmd({
    pattern: "tagall",
    react: "📢",
    category: "group",
    filename: __filename
},
async(conn, mek, m,{from, isGroup, isAdmins, isBotAdmins, isOwner, participants, reply}) => {
try{
if (!isGroup) return reply("Group only ❌")
if (!isAdmins && !isOwner) return reply("Admins only ❌")

let teks = "📢 *Queen Rashu V5 Tagging All Members*\n\n"
for (let mem of participants) {
    teks += `@${mem.id.split('@')[0]}\n`
}

conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek })

} catch (e) {
reply("Error ❌")
console.log(e)
}
})