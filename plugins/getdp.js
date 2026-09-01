import { cmd } from "../command.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "getdp",
    alias: ["dp", "profile", "pp"],
    desc: "Get profile photo by number or mention",
    category: "tools",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, args, quoted, mentionedJid, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        let target;

        // 1. අංකයක් type කර ඇත්නම් එය ලබා ගැනීම
        if (args.length > 0) {
            let num = args[0].replace(/[^0-9]/g, ""); // අංකය පිරිසිදු කිරීම
            if (num.length < 9) return reply("❌ Please enter a valid phone number!");
            target = num + "@s.whatsapp.net";
        } 
        // 2. කෙනෙක්ව tag කර ඇත්නම්
        else if (mentionedJid[0]) {
            target = mentionedJid[0];
        } 
        // 3. reply කර ඇත්නම්
        else if (quoted) {
            target = quoted.sender;
        } 
        // 4. කිසිවක් නැත්නම් තමන්ගේම
        else {
            target = m.sender;
        }

        // 🖼️ Fetch DP
        let pp;
        try {
            pp = await conn.profilePictureUrl(target, "image");
        } catch {
            pp = "https://files.catbox.moe/63ysre.jpeg"; // DP එකක් නැතිනම්
        }

        // 🧾 Send DP
        await conn.sendMessage(from, {
            image: { url: pp },
            caption: `🖼️ *ʙʟᴀᴄᴋ Qᴜᴇᴇɴ ᴍᴅ ᴠ1 ᴘʀᴏꜰɪʟᴇ ᴘʜᴏᴛᴏ* \n\n> *User:* @${target.split("@")[0]}`,
            mentions: [target]
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.log("Get DP Error:", err);
        reply("❌ Error getting profile photo! Make sure the number is correct.");
    }
});
