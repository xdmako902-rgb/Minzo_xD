const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["pairing", "getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for Queen Mena MD bot",
    category: "download",
    use: ".pair 9477xxxxxxx",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Check if in group
        if (isGroup) {
            return await reply("❌ *This command only works in private chat. Please message me directly!*");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Extract phone number from command or sender
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ *Please provide a valid phone number without `+`*\n\n*Example:* `.pair 94771234567`");
        }

        // Make API request to get pairing code (Using standard reliable pairing API endpoint)
        const response = await axios.get(`https://api.giftedtech.web.id/api/v1/pairing?number=${encodeURIComponent(phoneNumber)}`);

        let pairingCode = "";
        if (response.data && response.data.code) {
            pairingCode = response.data.code;
        } else if (response.data && response.data.result) {
            pairingCode = response.data.result;
        } else {
            // Fallback alternative API if needed
            const altResponse = await axios.get(`https://suhail-md-v2-1-396ca5e39626.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);
            pairingCode = altResponse.data?.code;
        }

        if (!pairingCode) {
            return await reply("❌ *Failed to retrieve pairing code. Please try again later.*");
        }

        // Send image with caption containing the code
        const captionText = `╭══════════════════════╮
║   🦋 *𝑸𝑼𝑬𝑬𝑵 𝑴𝑬𝑵𝑨 𝑴𝑫* 🦋   ║
╰══════════════════════╯
│
│ ⊳ *𝑷𝒂𝒊𝒓𝒊𝒏𝒈 𝑪𝒐𝒅𝒆 𝑲𝒆𝒚* ✨
│
│ 🔢 *Code:* \`${pairingCode}\`
│
╰══════════════════════⟡

> _💡 Copy the code from below message and paste it into your WhatsApp linked devices._

> © *𝑷𝑶𝑾𝑬𝑹𝑬𝑫 𝑩𝒀 𝑸𝑼𝑬𝑬𝑵 𝑴𝑬𝑵𝑨 𝑴𝑫 🦋*`;

        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/n8R0vxgN/1daccc9c8fc5.jpg" },
            caption: captionText
        }, { quoted: mek });

        // Send clean code separately for easy copying
        await reply(pairingCode);

        // Success reaction
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ *An error occurred while getting pairing code. Please check your number and try again later.*");
    }
});
