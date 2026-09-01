import fs from 'fs';
import path from 'path';
import { cmd } from '../command.js';
import { downloadContentFromMessage } from 'baileys-in-error-fix';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'vv_trigger.json');

cmd({
    pattern: "setst",
    react: "⚙️",
    desc: "Set a custom prefix-less trigger for Status Save",
    category: "owner",
    use: '.setst <emoji or word>',
    filename: __filename
},
async (conn, mek, m, { from, q, isOwner, reply }) => {
    if (!isOwner) return await reply("❌ 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿!");

    const query = q ? q.trim() : "";

    if (query.toLowerCase() === 'reset') {
        if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
        return await reply("✅ *Custom Status Dl Trigger Reset!*\nNow using default emoji: 🔓");
    }

    if (!query) {
        return await reply(`*Status Dawnload Cmd Change ⚙️*\n.setst (Castom Imoji Or Word)\n*Ex :* \n.setst Save\n.setst දාන්න \n.setst 😘\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`);
    }

    fs.writeFileSync(dbPath, JSON.stringify({ trigger: query }));
    await reply(`✅ *CUSTOM STATUS DL TRIGGER SAVED!*\n\nNow you can simply reply to a Status using:\n*${query}*\n_(No dot/prefix required!)_`);
});

cmd({
    on: "body" 
},
async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        if (!isOwner || !m.quoted) return;

        const msgText = mek.message?.conversation || mek.message?.extendedTextMessage?.text || "";
        if (!msgText) return;

        let trigger = "🔓"; 
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath));
            trigger = data.trigger;
        }

        if (msgText.trim() !== trigger) return;

        const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) return;

        let type = Object.keys(quotedMessage)[0];
        let mediaMsg = quotedMessage[type];

        if (type === 'viewOnceMessageV2' || type === 'viewOnceMessage' || type === 'viewOnceMessageV2Extension') {
            const innerType = Object.keys(quotedMessage[type].message)[0];
            mediaMsg = quotedMessage[type].message[innerType];
            type = innerType;
        }

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
            return reply("❌ 𝗧𝗵𝗶𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝗦𝘁𝗮𝘁𝘂𝘀");
        }
        const stream = await downloadContentFromMessage(mediaMsg, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        let senderId = m.quoted.sender || m.sender || '';

        const secretCaption = `📥 *𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗔𝗪𝗡𝗟𝗢𝗔𝗗𝗘Ｒ*

◈ *Title :* ${type.replace('Message', '').toUpperCase()}
◈ *Status Uploder :* @${senderId.split('@')[0]}

> *ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ʀᴀꜱʜᴜ ᴏꜰᴄ*`;

        if (type === 'imageMessage') {
            await conn.sendMessage(botNumber, { image: buffer, caption: secretCaption, mentions: [senderId] });
        } else if (type === 'videoMessage') {
            await conn.sendMessage(botNumber, { video: buffer, caption: secretCaption, mimetype: 'video/mp4', mentions: [senderId] });
        } else if (type === 'audioMessage') {
            await conn.sendMessage(botNumber, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true });
            await conn.sendMessage(botNumber, { text: secretCaption, mentions: [senderId] });
        }

    } catch (e) {
        console.log("VV_PREFIXLESS_ERROR:", e);
    }
});

cmd({
    pattern: "save",
    alias: ["send", "දාන්න"],
    desc: "Dawnload Status media and send to Bot Inbox.",
    category: "owner",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    try {
        if (!isOwner) return reply("❌ 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗼𝘄𝗻𝗲𝗿!");
        if (!m.quoted) return reply("❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘁𝗼 𝗮 𝗦𝘁𝗮𝘁𝘂𝘀.");
        
        const quotedMessage = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) return reply("❌ 𝗖𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗳𝗶𝗻𝗱 𝘁𝗵𝗲 𝗾𝘂𝗼𝘁𝗲𝗱 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 🇩𝗮𝘁𝗮.");

        let type = Object.keys(quotedMessage)[0];
        let mediaMsg = quotedMessage[type];

        if (type === 'viewOnceMessageV2' || type === 'viewOnceMessage' || type === 'viewOnceMessageV2Extension') {
            const innerType = Object.keys(quotedMessage[type].message)[0];
            mediaMsg = quotedMessage[type].message[innerType];
            type = innerType;
        }

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
            return reply("❌ 𝗧𝗵𝗶𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝗦𝘁𝗮𝘁𝘂𝘀.");
        }

        const stream = await downloadContentFromMessage(mediaMsg, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        let senderId = m.quoted.sender || m.sender || '';

        const secretCaption = `📥 *𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗔𝗪𝗡𝗟𝗢𝗔𝗗𝗘Ｒ*\n\n◈ *Title :* ${type.replace('Message', '').toUpperCase()}\n◈ *Status Uploder :* @${senderId.split('@')[0]}\n> *ᴘᴏᴡᴇʀᴅ ʙʏ Qᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`;

        if (type === 'imageMessage') {
            await conn.sendMessage(botNumber, { image: buffer, caption: secretCaption, mentions: [senderId] });
        } else if (type === 'videoMessage') {
            await conn.sendMessage(botNumber, { video: buffer, caption: secretCaption, mimetype: 'video/mp4', mentions: [senderId] });
        } else if (type === 'audioMessage') {
            await conn.sendMessage(botNumber, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true });
            await conn.sendMessage(botNumber, { text: secretCaption, mentions: [senderId] });
        }
    } catch (e) {
        console.log("VV_ERROR:", e);
        reply("❌ 𝗘𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: " + e.message);
    }
});