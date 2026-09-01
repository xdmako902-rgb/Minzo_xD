const { cmd } = require('../command');

cmd({
    pattern: "tagall",
    alias: ["everyone", "all"],
    desc: "Tag all members in the group",
    category: "group",
    react: "📢",
    filename: __filename
},
async (sock, msg, m, { from, isGroup, participants, isAdmins, isOwner, reply, q }) => {
    try {
        if (!isGroup) return reply("⚠️ *මෙය Group එකක් තුළ පමණක් භාවිත කළ හැක.*");
        if (!isAdmins && !isOwner) return reply("⚠️ *මෙම විධානය භාවිත කළ හැක්කේ Admins ලාට පමණි.*");

        let messageText = `╭━━━〔 *𝑸𝑼𝑬𝑬𝑵 𝑴𝑬𝑵𝑨 𝑴𝑫* 〕━━━┈⊷\n`;
        messageText += `┃ 📢 *𝑴𝒆𝒔𝒔𝒂𝒈𝒆:* ${q ? q : 'Attention Everyone!'}\n`;
        messageText += `╰━━━━━━━━━━━━━━━┈⊷\n\n`;

        const mentions = [];
        for (let mem of participants) {
            messageText += `▫️ @${mem.id.split('@')[0]}\n`;
            mentions.push(mem.id);
        }

        messageText += `\n> *© 𝑸𝑼𝑬𝑬𝑵 𝑴𝑬𝑵𝑨 𝑴𝑫 𝑻𝒂𝒈 𝑨𝒍𝒍*`;

        await sock.sendMessage(from, { text: messageText, mentions: mentions }, { quoted: msg });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply("❌ *Tag කිරීමේදී දෝෂයක් සිදුවිය!*");
    }
});
