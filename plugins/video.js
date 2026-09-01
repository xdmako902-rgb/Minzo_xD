import { cmd } from '../command.js';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "video",
    desc: "Download youtube video with quality + document",
    category: "download",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    try {

        if (!q) return conn.sendMessage(from, { text: "*Give youtube link!*" }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } })

        // 🔹 GET VIDEO INFO - Using Blade API
        const infoApi = `https://blade-apis.vercel.app/download/ytmp4?key=blade-0e32e78d94ed123f8947eb479bafe2&url=${encodeURIComponent(q)}`
        const res = await fetch(infoApi)
        const data = await res.json()

        if (!data.status || !data.download_url) {
            // Fallback to movanest if Blade fails
            const fallbackApi = `https://www.movanest.xyz/v2/ytdown?url=${encodeURIComponent(q)}&quality=360`
            const fallbackRes = await fetch(fallbackApi)
            const fallbackData = await fallbackRes.json()
            
            if (!fallbackData.status) {
                return conn.sendMessage(from, { text: "*❌ Failed to fetch video! Try another link.*" }, { quoted: mek })
            }
        }

        const title = data.title || "Unknown Title"
        const thumb = data.thumbnail
        const duration = data.duration || "N/A"
        const author = data.author || "Unknown"

        let list = `👋 *Hello ${pushname}*

🎥 *ᴛɪᴛʟᴇ:* ${title}
⏱ *ᴅᴜʀᴀᴛɪᴏɴ:* ${duration}
👤 *ᴀᴜᴛʜᴏʀ:* ${author}

*📌 Reply with number to download:*

1️⃣ 360p (Video)
2️⃣ 480p (Video)
3️⃣ 720p (Video)
4️⃣ Document (File)
5️⃣ Audio (MP3)

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ǫᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`

        const sentMsg = await conn.sendMessage(from, {
            image: { url: thumb },
            caption: list
        }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

        // 🔁 REPLY LISTENER
        const handler = async (update) => {
            try {
                const msg = update.messages[0]
                if (!msg.message || !msg.message.extendedTextMessage) return

                const reply = msg.message.extendedTextMessage.text
                const contextId = msg.message.extendedTextMessage.contextInfo?.stanzaId

                if (contextId === sentMsg.key.id) {

                    const choice = parseInt(reply)

                    // 🎬 VIDEO DOWNLOAD (Quality options)
                    if (choice >= 1 && choice <= 3) {
                        
                        let quality = "360"
                        if (choice === 2) quality = "480"
                        if (choice === 3) quality = "720"

                        await conn.sendMessage(from, {
                            react: { text: "⬇️", key: msg.key }
                        })

                        await conn.sendMessage(from, {
                            text: `*⏳ Downloading ${quality}p video...*`
                        }, { quoted: msg })

                        // Try Blade API first
                        let videoUrl = null
                        try {
                            const bladeApi = `https://blade-apis.vercel.app/download/ytmp4?key=blade-0e32e78d94ed123f8947eb479bafe2&url=${encodeURIComponent(q)}&quality=${quality}`
                            const bladeRes = await fetch(bladeApi)
                            const bladeData = await bladeRes.json()
                            
                            if (bladeData.status && bladeData.download_url) {
                                videoUrl = bladeData.download_url
                            }
                        } catch (e) {
                            console.log("Blade quality API error:", e.message)
                        }

                        // Fallback to movanest
                        if (!videoUrl) {
                            const dlApi = `https://www.movanest.xyz/v2/ytdown?url=${encodeURIComponent(q)}&quality=${quality}`
                            const dlRes = await fetch(dlApi)
                            const dlData = await dlRes.json()

                            if (!dlData.status) {
                                await conn.sendMessage(from, { react: { text: "❌", key: msg.key } })
                                return conn.sendMessage(from, { text: "*❌ Download failed! Try another quality.*" }, { quoted: msg })
                            }
                            videoUrl = dlData.download.link
                        }

                        await conn.sendMessage(from, {
                            video: { url: videoUrl },
                            mimetype: "video/mp4",
                            fileName: `${title}.mp4`,
                            caption: `🎥 *${title}*\n\n📊 *Quality:* ${quality}p\n⏱ *Duration:* ${duration}`
                        }, { quoted: msg })

                        await conn.sendMessage(from, { react: { text: "✅", key: msg.key } })
                    }

                    // 📁 DOCUMENT (Best quality)
                    else if (choice === 4) {

                        await conn.sendMessage(from, {
                            react: { text: "⬇️", key: msg.key }
                        })

                        await conn.sendMessage(from, {
                            text: `*⏳ Downloading as document...*`
                        }, { quoted: msg })

                        // Try Blade API first (best quality)
                        let docUrl = null
                        try {
                            const bladeApi = `https://blade-apis.vercel.app/download/ytmp4?key=blade-0e32e78d94ed123f8947eb479bafe2&url=${encodeURIComponent(q)}`
                            const bladeRes = await fetch(bladeApi)
                            const bladeData = await bladeRes.json()
                            
                            if (bladeData.status && bladeData.download_url) {
                                docUrl = bladeData.download_url
                            }
                        } catch (e) {
                            console.log("Blade doc API error:", e.message)
                        }

                        // Fallback to movanest
                        if (!docUrl) {
                            const dlApi = `https://www.movanest.xyz/v2/ytdown?url=${encodeURIComponent(q)}&quality=720`
                            const dlRes = await fetch(dlApi)
                            const dlData = await dlRes.json()

                            if (!dlData.status) {
                                await conn.sendMessage(from, { react: { text: "❌", key: msg.key } })
                                return conn.sendMessage(from, { text: "*❌ Download failed!*" }, { quoted: msg })
                            }
                            docUrl = dlData.download.link
                        }

                        await conn.sendMessage(from, {
                            document: { url: docUrl },
                            mimetype: "video/mp4",
                            fileName: data.filename || `${title}.mp4`,
                            caption: `📁 *${title}*\n\n🎬 Sent as Document\n⏱ *Duration:* ${duration}`
                        }, { quoted: msg })

                        await conn.sendMessage(from, { react: { text: "✅", key: msg.key } })
                    }

                    // 🎵 AUDIO (MP3)
                    else if (choice === 5) {

                        await conn.sendMessage(from, {
                            react: { text: "⬇️", key: msg.key }
                        })

                        await conn.sendMessage(from, {
                            text: `*⏳ Downloading audio...*`
                        }, { quoted: msg })

                        // Use Blade MP3 API
                        let audioUrl = null
                        try {
                            const audioApi = `https://blade-apis.vercel.app/download/ytmp3?key=blade-0e32e78d94ed123f8947eb479bafe2&url=${encodeURIComponent(q)}`
                            const audioRes = await fetch(audioApi)
                            const audioData = await audioRes.json()
                            
                            if (audioData.status && audioData.download_url) {
                                audioUrl = audioData.download_url
                            }
                        } catch (e) {
                            console.log("Audio API error:", e.message)
                        }

                        if (!audioUrl) {
                            await conn.sendMessage(from, { react: { text: "❌", key: msg.key } })
                            return conn.sendMessage(from, { text: "*❌ Audio download failed!*" }, { quoted: msg })
                        }

                        await conn.sendMessage(from, {
                            audio: { url: audioUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${title}.mp3`
                        }, { quoted: msg })

                        await conn.sendMessage(from, { react: { text: "✅", key: msg.key } })
                    }

                    // ❗ Stop listener after processing
                    conn.ev.off('messages.upsert', handler)
                }
            } catch (err) {
                console.log("Handler error:", err)
            }
        }

        conn.ev.on('messages.upsert', handler)

    } catch (e) {
        console.log("Video command error:", e)
        conn.sendMessage(from, { text: "*❌ Error occurred! Please try again.*" }, { quoted: mek })
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})