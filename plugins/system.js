import { cmd } from '../command.js';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "system",
    desc: "Show bot system information",
    category: "main",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {

        // 🕒 Uptime
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // 💾 RAM
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);

        // 🖥️ CPU
        const cpu = os.cpus()[0].model;

        // 📱 System Info
        const platform = os.platform();
        const hostname = os.hostname();
        const activeBotCount = global.activeSockets ? global.activeSockets.size : 0;

        const message = `💻 *Ｑᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ Ｓyꜱᴛᴇᴍ ɪɴꜰᴏ*

⏱️ ᴜᴩᴛɪᴍᴇ: ${hours}h ${minutes}m ${seconds}s

🧠 ʀᴀᴍ ᴜꜱᴀɢᴇ:
   • ᴛᴏᴛᴀʟ: ${totalMem} MB
   • ᴜꜱᴇᴅ: ${usedMem} MB
   • ꜰʀᴇᴇ: ${freeMem} MB

⚙️ ᴄᴩᴜ: ${cpu}

🖥️ ᴩʟᴀᴛꜰᴏʀᴍ: ${platform}
📡 ʜᴏꜱᴛɴᴀᴍᴇ: ${hostname}
📊 ᴀᴄᴛɪᴠᴇ ᴜꜱᴇʀ: ${activeBotCount}

👑 Bot is running smoothly 🚀

> *ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`;

        return await conn.sendMessage(from, { text: message }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error getting system info!");
    }
});