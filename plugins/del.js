const { cmd } = require('../command');

cmd({
    pattern: "del",
    alias: ["delete", "unsend"],
    desc: "Delete a quoted message without internal admin checks.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!m.quoted) {
            return reply("*𝑷𝒍𝒆𝒂𝒔𝒆 𝑹𝒆𝒑𝒍𝒚 𝑻𝒐 𝑻𝒉𝒆 𝑴𝒆𝒔𝒔𝒂𝒈𝒆 𝒀𝒐𝒖 𝑾𝒂𝒏𝒕 𝑻𝒐 𝑫𝒆𝒍𝒆𝒕𝒆.*");
        }

        const key = {
            remoteJid: from,
            fromMe: m.quoted.fromMe || false,
            id: m.quoted.id,
            ...(isGroup && !m.quoted.fromMe ? { participant: m.quoted.sender } : {})
        };

        await conn.sendMessage(from, { delete: key });

    } catch (e) {
        console.error("DEL_ERROR:", e);
        reply(`*𝑬𝒓𝒓𝒐𝒓:* ${e.message || e}\n\n_(*බොට් ඇඩ්මින්ද කියලා හෝ මැසේජ් එක ගොඩක් පරණ එකක්ද කියලා චෙක් කරන්න*)_`);
    }
});
