import axios from "axios";
import { cmd } from "../command.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "xnxx",
    desc: "Download xnxx video",
    category: "Sex",
    react: "🔞",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Need Title or URL*")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        let videoUrl = q

        // 🔍 SEARCH
        if (!q.includes("xnxx.com")) {
            const searchApi = `https://apis.prexzyvilla.site/nsfw/xnxx-search?query=${encodeURIComponent(q)}`
            const search = await axios.get(searchApi).then(r => r.data).catch(() => null)

            if (!search || !search.status || !search.videos?.length) {
                return reply("*No results found*")
            }

            videoUrl = search.videos[0].link
        }

        // 📥 FETCH DATA
        const dlApi = `https://apis.prexzyvilla.site/nsfw/xnxx-dl?url=${encodeURIComponent(videoUrl)}`
        const data = await axios.get(dlApi).then(r => r.data).catch(() => null)

        if (!data || data.status !== true) {
            return reply("*Download failed*")
        }

        const desc = `🔞 *Ｑᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ Ｓᴇxꜱy Ｖɪᴅᴇᴏ Ｄᴏᴡɴʟᴏᴀᴅᴇʀ*

📌 *ᴛɪᴛʟᴇ:* ${data.title}
⏱ *ᴅᴜʀᴀᴛɪᴏɴ:* ${data.duration}
📄 *ᴅᴇꜱᴄʀɪᴩᴛɪᴏɴ:* ${data.info}

*Reply with number*

1️⃣ ᴠɪᴅᴇᴏ
2️⃣ ᴠɪᴅᴇᴏ ɴᴏᴛᴇ
3️⃣ ᴅᴏᴄᴜᴍᴇɴᴛ

> *ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`

        const sentMsg = await conn.sendMessage(from, {
            image: { url: data.image },
            caption: desc
        }, { quoted: mek })

        // 🎯 HANDLER
        const handler = async (update) => {
            try {
                const msg = update.messages[0]
                if (!msg.message?.extendedTextMessage) return

                const text = msg.message.extendedTextMessage.text
                const contextId = msg.message.extendedTextMessage.contextInfo?.stanzaId

                if (contextId !== sentMsg.key.id) return

                await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } })

                const apiUrl = `https://apis.prexzyvilla.site/nsfw/xnxx-dl?url=${encodeURIComponent(videoUrl)}`
                const res = await axios.get(apiUrl).then(r => r.data)

                // 🎥 VIDEO
                if (text === "1") {
                    await conn.sendMessage(from, {
                        video: { url: res.files.high },
                        mimetype: "video/mp4",
                        fileName: `${res.title}.mp4`
                    }, { quoted: msg })
                }

                // 🎙️ VIDEO NOTE
                else if (text === "2") {
                    await conn.sendMessage(from, {
                        video: { url: res.files.low },
                        mimetype: "video/mp4",
                        ptv: true
                    }, { quoted: msg })
                }

                // 📁 DOCUMENT
                else if (text === "3") {
                    await conn.sendMessage(from, {
                        document: { url: res.files.high },
                        mimetype: "video/mp4",
                        fileName: `${res.title}.mp4`
                    }, { quoted: msg })
                }

                await conn.sendMessage(from, { react: { text: "✅", key: msg.key } })

                conn.ev.off("messages.upsert", handler)

            } catch (e) {
                console.log(e)
            }
        }

        conn.ev.on("messages.upsert", handler)

    } catch (e) {
        console.log(e)
        reply("*Error occurred*")
    }
})