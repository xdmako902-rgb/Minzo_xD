import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "cinfo",
    alias: [],
    desc: "Get whatsapp channel information",
    category: "main",
    react: "📢",
    filename: __filename
},
async(conn, mek, m, { args, reply, prefix, q }) => {
    try {
        if (!q) return reply(`❌ *ᴜꜱᴀɢᴇ:* \`${prefix}cinfo <ᴄʜᴀɴɴᴇʟ ʟɪɴᴋ>\``);
        const parts = q.trim().split("/");
        const inviteId = parts[parts.indexOf("channel") + 1];
        if (!inviteId) return reply("❌ *ɪɴᴠᴀʟɪᴅ ᴄʜᴀɴɴᴇʟ ʟɪɴᴋ.*");
        
        const meta = await conn.newsletterMetadata('invite', inviteId);
        const filtered = {
            id: meta.id,
            status: meta.state?.type || "ᴜɴᴋɴᴏᴡɴ",
            name: meta.thread_metadata?.name?.text || "ɴ/ᴀ",
            description: meta.thread_metadata?.description?.text || "ɴ/ᴀ",
            invite: meta.thread_metadata?.invite || "ɴ/ᴀ",
            subscribers: meta.thread_metadata?.subscribers_count || "0",
            verification: meta.thread_metadata?.verification || "ɴ/ᴀ"
        };
        
        let msg = `📢 *ᴄʜᴀɴɴᴇʟ ɪɴꜰᴏ*\n\n🆔 *ɪᴅ:* ${filtered.id}\n📛 *ɴᴀᴍᴇ:* ${filtered.name}\n📄 *ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ:*\n${filtered.description}\n\n🔗 *ɪɴᴠɪᴛᴇ:* ${filtered.invite}\n👥 *ꜱᴜʙꜱᴄʀɪʙᴇʀꜱ:* ${filtered.subscribers}\n✅ *ꜱᴛᴀᴛᴜꜱ:* ${filtered.status}\n🔒 *ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ:* ${filtered.verification}`;
        await reply(msg);
    } catch (e) { 
        console.error(e);
        reply("❌ *ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴄʜᴀɴɴᴇʟ ɪɴꜰᴏ.*"); 
    }
});
