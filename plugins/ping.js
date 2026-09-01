const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now();
        
        
        const pingText = `╭━━━〔 Ｑᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ 〕━━━┈⊷
┃ 🎀𝑷𝑰𝑵𝑮‌ !
╰━━━━━━━━━━━━━━━┈⊷

⭔ ꜱᴩᴇᴇᴅ : ᴩɪɴɢɪɴɢ...
⭔ ꜱᴛᴀᴛᴜꜱ : ꜰᴀꜱᴛ & ᴀᴄᴛɪᴠᴇ 🟢

*© Qᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ*`;

      
        const message = await conn.sendMessage(from, { 
            image: { url: 'https://img3.pixhost.to/images/5387/764992060_upload.jpg' }, 
            caption: pingText 
        }, { quoted: mek });
        
        const endTime = Date.now();
        const ping = endTime - startTime;
        
        const updatedPingText = `╭━━━〔 Ｑᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ〕━━━┈⊷
┃ 🎀𝑷𝑰𝑵𝑮‌!
╰━━━━━━━━━━━━━━━┈⊷

⭔ ꜱᴩᴇᴇᴅ : ${ping}ms
⭔ ꜱᴛᴀᴛᴜꜱ : ꜰᴀꜱᴛ & ᴀᴄᴛɪᴠᴇ 🟢

*© Ｑᴜᴇᴇɴ Ｍᴇɴᴀ Ｍᴅ*`;

        await conn.sendMessage(from, { text: updatedPingText, edit: message.key });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
})
