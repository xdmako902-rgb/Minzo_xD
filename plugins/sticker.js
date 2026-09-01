const { cmd } = require('../command');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "sticker",
    alias: ["s", "stic", "st"],
    desc: "Convert image or video to sticker with full metadata",
    category: "convert",
    react: "✨",
    filename: __filename
},
async (sock, msg, m, { from, reply, quoted, pushname }) => {
    try {
        const isQuotedImage = m.quoted ? (m.quoted.type === 'imageMessage') : false;
        const isQuotedVideo = m.quoted ? (m.quoted.type === 'videoMessage') : false;
        const isImage = m.type === 'imageMessage';
        const isVideo = m.type === 'videoMessage';

        if (!isImage && !isVideo && !isQuotedImage && !isQuotedVideo) {
            return reply("⚠️ *කරුණාකර පින්තූරයකට හෝ තත්පර 10ට අඩු වීඩියෝවකට Reply කර .sticker ලෙස Type කරන්න!*");
        }

        let mediaMessage;
        let mimeType;

        if (isQuotedImage || isQuotedVideo) {
            const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
            mediaMessage = isQuotedImage ? quotedMsg.imageMessage : quotedMsg.videoMessage;
            mimeType = isQuotedImage ? 'image' : 'video';
        } else {
            mediaMessage = isImage ? msg.message.imageMessage : msg.message.videoMessage;
            mimeType = isImage ? 'image' : 'video';
        }

        if (isQuotedVideo || isVideo) {
            if ((mediaMessage.seconds || 0) > 11) {
                return reply("⚠️ *වීඩියෝවේ කාලය තත්පර 10කට වඩා අඩු විය යුතුය!*");
            }
        }

        const stream = await downloadContentFromMessage(mediaMessage, mimeType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const sticker = new Sticker(buffer, {
            pack: '𝑴𝒊𝒏𝒁𝒐 𝑷𝒂𝒕𝒊𝒚𝒂𝒉 🧃🎀', // ඔබ ඉල්ලූ නම
            author: '𝑸𝒖𝒆𝒆𝒏 𝑴𝒆𝒏𝒂 𝒎𝒅',             // අවශ්‍ය නම් මෙතනත් වෙනස් කළ හැක
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 70,
            background: 'transparent'
        });

        const stickerBuffer = await sticker.toBuffer();
        await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

    } catch (e) {
        console.error("Sticker Error:", e);
        reply("❌ *ස්ටිකරය සෑදීමේදී දෝෂයක් සිදුවිය! කරුණාකර නැවත උත්සාහ කරන්න.*");
    }
});
