import { cmd } from "../command.js";
import FileType from "file-type";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// 🔥 ALL-IN-ONE SAVE SYSTEM
cmd({
    pattern: "save",
    alias: [
        "දාපන්","ඔන",
        "❤️❤️","🤭🤭","💗💗","wow","🥰🥰","😁😁","😂😂","👍👍","අම්මෝ","නියමයි"
    ],
    desc: "Auto + Manual Save System",
    category: "utility",
    react: "💾",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg) return;

        // 🔥 detect mode
        const text = m?.body || "";
        const isAuto = [
            "❤️❤️","🤭🤭","💗💗","wow","🥰🥰","😁😁","😂😂","👍👍","අම්මෝ","නියමයි"
        ].includes(text);

        // 📌 auto → bot inbox | manual → same chat
        const saveChat = isAuto ? conn.user.id : from;

        // 📥 MEDIA DOWNLOAD
        async function downloadMedia(msg) {
            const type = Object.keys(msg)[0];
            const stream = await conn.downloadContentFromMessage(msg[type], type.replace("Message",""));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            return buffer;
        }

        // ================= MEDIA =================
        if (
            quotedMsg.imageMessage ||
            quotedMsg.videoMessage ||
            quotedMsg.audioMessage ||
            quotedMsg.documentMessage ||
            quotedMsg.stickerMessage
        ) {
            const buffer = await downloadMedia(quotedMsg);
            if (!buffer) return reply("❌ Download failed");

            if (quotedMsg.imageMessage) {
                await conn.sendMessage(saveChat, {
                    image: buffer,
                    caption: isAuto ? `Saved from ${sender}` : "✅ Saved"
                });

            } else if (quotedMsg.videoMessage) {
                await conn.sendMessage(saveChat, {
                    video: buffer,
                    caption: isAuto ? `Saved from ${sender}` : "✅ Saved"
                });

            } else if (quotedMsg.audioMessage) {
                await conn.sendMessage(saveChat, {
                    audio: buffer,
                    mimetype: "audio/mpeg"
                });

            } else if (quotedMsg.documentMessage) {
                const type = await FileType.fromBuffer(buffer);
                await conn.sendMessage(saveChat, {
                    document: buffer,
                    fileName: `saved.${type?.ext || "bin"}`
                });

            } else if (quotedMsg.stickerMessage) {
                await conn.sendMessage(saveChat, {
                    image: buffer,
                    caption: isAuto ? `Sticker saved from ${sender}` : "✅ Sticker Saved"
                });
            }

            if (!isAuto) reply("🧸🎈 Saved Successfully!");

        // ================= TEXT =================
        } else if (quotedMsg.conversation || quotedMsg.extendedTextMessage) {
            const txt = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text;

            await conn.sendMessage(saveChat, {
                text: isAuto
                    ? `Text saved from ${sender}:\n\n${txt}`
                    : `✅ Saved\n\n${txt}`
            });

            if (!isAuto) reply("🧸🎈 Text Saved Successfully!");

        // ================= FALLBACK =================
        } else {
            try {
                await conn.copyNForward(saveChat, mek.key, true);
                if (!isAuto) reply("🧸🎈 Saved Successfully!");
            } catch {
                if (!isAuto) reply("❌ Cannot save this message");
            }
        }

    } catch (err) {
        console.log("Save System Error:", err);
        reply("❌ Error saving");
    }
});