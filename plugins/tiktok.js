import { cmd } from "../command.js";
import axios from "axios";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "tiktok",
    alias: ["tt"],
    desc: "Download TikTok videos",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q || !q.startsWith("http")) {
            return reply("❌ Please provide a TikTok URL!\nExample: .tt https://tiktok.com/...");
        }

        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

        const api = `https://movanest.xyz/v2/tiktok?url=${encodeURIComponent(q)}`;
        const res = await axios.get(api).then(r => r.data).catch(() => null);

        if (!res || !res.status || !res.results?.no_watermark) {
            return reply("❌ Failed to fetch TikTok video!");
        }

        const data = res.results;

        const caption = `🎵 *𝐓𝐢𝐤𝐓𝐨𝐤 𝐃𝐨𝐰𝐍𝐋𝐨𝐀𝐃𝐞𝐫*

╭━━━━━━━━━━━━━━━
│ • ᴛɪᴛʟᴇ : ${data.title || 'N/A'}
│ • ᴀᴜᴛʜᴏʀ : ${data.author || 'Unknown'}
╰━━━━━━━━━━━━━━━

1️⃣ ᴅᴏᴄᴜᴍᴇɴᴛ
2️⃣ ᴠɪᴅᴇᴏ
3️⃣ ᴠɪᴅᴇᴏ ɴᴏᴛᴇ

*Reply with number⤴️*

> *ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: data.cover || data.origin_cover },
            caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;

        const handler = async (update) => {
            try {
                const msg = update.messages[0];
                if (!msg.message?.extendedTextMessage) return;

                const text = msg.message.extendedTextMessage.text.toLowerCase();
                const contextId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

                if (contextId !== msgId) return;

                // 🛑 STOP
                if (text === "stop") {
                    conn.ev.off("messages.upsert", handler);
                    return await conn.sendMessage(from, { text: "🛑 Session Ended" });
                }

                await conn.sendMessage(from, { react: { text: "⏳", key: msg.key } });

                let media;

                if (text === "1") {
                    media = {
                        document: { url: data.no_watermark },
                        mimetype: "video/mp4",
                        fileName: `${data.title || 'tiktok'}.mp4`
                    };

                } else if (text === "2") {
                    media = {
                        video: { url: data.no_watermark },
                        mimetype: "video/mp4",
                        caption: "✅ Queen Mena V1 TikTok Video"
                    };

                } else if (text === "3") {
                    media = {
                        video: { url: data.no_watermark },
                        mimetype: "video/mp4",
                        ptv: true
                    };
                }

                if (media) {
                    await conn.sendMessage(from, media, { quoted: msg });
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                }

            } catch (err) {
                console.log("TT Handler Error:", err);
            }
        };

        conn.ev.on("messages.upsert", handler);

    } catch (err) {
        console.log("TT Error:", err);
        reply("❌ Internal Error. Try again later.");
    }
});