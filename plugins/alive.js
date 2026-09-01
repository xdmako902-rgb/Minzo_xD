import { cmd } from '../command.js';
import os from 'os';
import moment from 'moment';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { downloadContentFromMessage } from 'baileys-in-error-fix';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local path to save custom alive logo
const savedAliveImgPath = path.join(__dirname, 'custom_alive_logo.jpg');
const defaultAliveImg = "https://www.movanest.xyz/igWGa2.jpg";

// Helper function to get current alive image payload
function getAliveImagePayload() {
    if (fs.existsSync(savedAliveImgPath)) {
        return fs.readFileSync(savedAliveImgPath); // reads custom image buffer
    }
    return { url: defaultAliveImg }; // fallback to default URL
}

// ==========================================
// 1. SET ALIVE LOGO COMMAND (DEPLOYED USER ONLY)
// ==========================================
cmd({
    pattern: "setalive",
    desc: "Change the alive logo permanently (Only for the bot deployer).",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Get main bot number/deployer ID
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

        // Check if sender is the bot number itself
        if (sender !== botNumber) {
            return reply("❌ This command can only be used by the user who deployed the bot (From the bot's own number).");
        }

        let imageMessage = null;

        // Check if there is a quoted image message
        const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMsg?.imageMessage) {
            imageMessage = quotedMsg.imageMessage;
        } else if (mek.message?.imageMessage) {
            // Check if direct image message
            imageMessage = mek.message.imageMessage;
        }

        if (!imageMessage) {
            return reply("❌ Please reply to an image or send an image with the caption *.setalive*");
        }

        reply("⏳ Downloading and updating alive logo...");

        const stream = await downloadContentFromMessage(imageMessage, 'image');
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Save image permanently
        fs.writeFileSync(savedAliveImgPath, buffer);

        return reply("✅ Alive logo updated successfully! (Saved permanently)");

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});

// ==========================================
// 2. RESET ALIVE LOGO COMMAND (DEPLOYED USER ONLY)
// ==========================================
cmd({
    pattern: "resetalive",
    desc: "Reset the alive logo back to default.",
    category: "owner",
    react: "🔄",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

        if (sender !== botNumber) {
            return reply("❌ This command can only be used by the user who deployed the bot (From the bot's own number).");
        }

        if (fs.existsSync(savedAliveImgPath)) {
            fs.unlinkSync(savedAliveImgPath);
            return reply("✅ Alive logo has been reset to the default image!");
        } else {
            return reply("ℹ️ Alive logo is already set to default.");
        }

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});

// ==========================================
// 3. ALIVE COMMAND (FOR EVERYONE WITH DYNAMIC LOGO)
// ==========================================
cmd({
    pattern: "alive",
    desc: "Alive with image",
    category: "main",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = new Date().getTime();

        // 🕒 ᴜᴘᴛɪᴍᴇ
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // 💾 ʀᴀᴍ
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);

        // ⚙️ ᴄᴘᴜ
        const cpu = os.cpus()[0].model;

        // 🌍 ᴘʟᴀᴛꜰᴏʀᴍ
        const platform = os.platform();

        // 📅 ᴛɪᴍᴇ
        const time = moment().format("YYYY-MM-DD HH:mm:ss");

        const end = new Date().getTime();
        const ping = end - start;

        const caption = `
╭━━━〔 Qᴜᴇᴇɴ ᴍᴇɴᴀ ᴍᴅ ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ 〕━━━┈⊷
┃  *ʙᴏᴛ ɪꜱ ᴀʟɪᴠᴇ & ʀᴜɴɴɪɴɢ*
┃ 
┃ ⏱️ ᴜᴘᴛɪᴍᴇ: ${hours}h ${minutes}m ${seconds}s
┃ ⚡ ᴘɪɴɢ: ${ping} ms
┃ 📅 ᴛɪᴍᴇ: ${time}
┃ 
┣━━━〔  ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ 〕━━━┈⊷
┃ 🧠 ʀᴀᴍ: ${usedMem}MB / ${totalMem}MB
┃ ⚙️ ᴄᴘᴜ: ${cpu}
┃ 🖥️ ᴘʟᴀᴛꜰʀᴏᴍ: ${platform}
┃ 
┣━━━〔 🚀 ꜱᴛᴀᴛᴜꜱ 〕━━━┈⊷
┃ ✅ ꜱᴘᴇᴇᴅ : ꜰᴀꜱᴛ
┃ 🔒 ᴍᴏᴅᴇ : ᴘᴜʙʟɪᴄ
┃ 💡 ᴠᴇʀꜱɪᴏɴ : 3.0 ᴘʀᴇᴍɪᴜᴍ
╰━━━━━━━━━━━━━━━━━━━┈⊷
> *© ᴘᴏᴡᴇʀᴅ ʙʏ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`;

        // Get custom or default image payload
        const aliveImgPayload = getAliveImagePayload();

        // 🖼️ IMAGE SEND
        await conn.sendMessage(from, {
            image: aliveImgPayload,
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error!");
    }
});

// ==========================================
// 4. LOGIN COMMAND (OWNER ONLY)
// ==========================================
cmd({
    pattern: "login",
    desc: "Get dashboard login URL and password",
    category: "main",
    react: "🔑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        if (!isOwner) return reply("❌ Only the Owner can use this command!");
        const botNumber = conn.user.id.split(':')[0].replace(/[^0-9]/g, '');
        const UserConfigModel = mongoose.models.UserConfig || mongoose.model('UserConfig', new mongoose.Schema({
            number: { type: String, required: true, unique: true },
            config: { type: Object, required: true }
        }));
        const dbEntry = await UserConfigModel.findOne({ number: botNumber });
        const sessionConfig = dbEntry ? dbEntry.config : {};
        const password = sessionConfig.DASHBOARD_PASSWORD || "No password generated yet";

        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        let loginUrl = redirectUri 
            ? redirectUri.replace('/auth/google/callback', '/login.html') 
            : 'https://v5-update-01-5751b71dd477.herokuapp.com/login.html';
        loginUrl = loginUrl.replace(/([^:]\/)\/+/g, "$1"); // fix double slashes

        const caption = `╭━━━〔 *Ｑᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ* 〕━━━┈⊷
┃ 🔑 *ᴅᴀꜱʜʙᴏᴀʀᴅ ʟᴏɢɪɴ ɪɴꜰᴏ*
╰━━━━━━━━━━━━━━━━━━━┈⊷

*┌────────────────────┐*
*├ 📱 ʙᴏᴛ ɴᴜᴍʙᴇʀ* : *${botNumber}*
*├ 🔑 ᴘᴀꜱꜱᴡᴏʀᴅ* : *${password}*
*├ 🌐 ʟᴏɢɪɴ ᴜʀʟ* : ${loginUrl}
*└────────────────────┘*

> *© ᴘᴏᴡᴇʀᴅ ʙʏ ᴍᴇɴᴀ ᴍᴅ ᴏꜰᴄ*`;

        await conn.sendMessage(from, { text: caption }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply("❌ Error retrieving login info!");
    }
});

// ==========================================
// 5. SET PASSWORD COMMAND (OWNER ONLY)
// ==========================================
cmd({
    pattern: "setpwd",
    desc: "Set dashboard login password",
    category: "main",
    react: "🔑",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner, q }) => {
    try {
        if (!isOwner) return reply("❌ Only the Owner can use this command!");
        if (!q) return reply("⚠️ Please provide a password!\nExample: `.setpwd MyNewPassword`");
        
        const newPassword = q.trim();
        if (newPassword.length < 4) return reply("⚠️ Password must be at least 4 characters long!");

        const botNumber = conn.user.id.split(':')[0].replace(/[^0-9]/g, '');
        const UserConfigModel = mongoose.models.UserConfig || mongoose.model('UserConfig', new mongoose.Schema({
            number: { type: String, required: true, unique: true },
            config: { type: Object, required: true }
        }));

        let dbEntry = await UserConfigModel.findOne({ number: botNumber });
        let sessionConfig = dbEntry ? dbEntry.config : {};
        sessionConfig.DASHBOARD_PASSWORD = newPassword;

        await UserConfigModel.findOneAndUpdate(
            { number: botNumber },
            { number: botNumber, config: sessionConfig, updatedAt: new Date() },
            { upsert: true }
        );

        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        let loginUrl = redirectUri 
            ? redirectUri.replace('/auth/google/callback', '/login.html') 
            : 'https://v5-update-01-5751b71dd477.herokuapp.com/login.html';
        loginUrl = loginUrl.replace(/([^:]\/)\/+/g, "$1");

        reply(`✅ *Success!* Dashboard password has been set to: *${newPassword}*\n\nLogin URL: ${loginUrl}`);
    } catch (e) {
        console.error(e);
        reply("❌ Error setting password!");
    }
});