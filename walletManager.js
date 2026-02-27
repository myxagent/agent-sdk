const crypto = require("crypto");
const { ethers } = require("ethers");
const { dbQuery } = require("./dbManager");
const { users } = require("./userData");
const logger = require("./logger");

// ====================

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // to generate a new one: console.log(crypto.randomBytes(16).toString("hex"));
const IV_LENGTH = 12;

// ====================

async function createWallet(userId) {
    try {
        const wallet = ethers.Wallet.createRandom();
        const walletAddr = wallet.address;
        const walletKey = encrypt(wallet.privateKey);

        const result = await dbQuery("UPDATE users SET wallet_addr = $1, wallet_key = $2 WHERE user_id = $3 AND wallet_addr IS NULL", [walletAddr, walletKey, userId]);
        if (result.rowCount === 0) return; // If another createWallet won the race, do nothing

        users[userId].wallet_addr = walletAddr;

    } catch (error) {
        logger.error(error);
    }
}

// ====================

function encrypt(privateKey) {
    try {
        const key = Buffer.from(ENCRYPTION_KEY, "hex");
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv("aes-128-gcm", key, iv);

        const rawKey = Buffer.from(privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey, "hex");
        const encrypted = Buffer.concat([cipher.update(rawKey), cipher.final()]);
        const authTag = cipher.getAuthTag();

        const combined = Buffer.concat([iv, authTag, encrypted]);
        return combined.toString("hex");

    } catch (error) {
        logger.error(error);
    }
}

// ====================

function decrypt(encryptedKey) {
    try {
        const key = Buffer.from(ENCRYPTION_KEY, "hex");
        const data = Buffer.from(encryptedKey, "hex");

        const iv = data.slice(0, IV_LENGTH);
        const authTag = data.slice(IV_LENGTH, IV_LENGTH + 16);
        const ciphertext = data.slice(IV_LENGTH + 16);

        const decipher = crypto.createDecipheriv("aes-128-gcm", key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

        return "0x" + decrypted.toString("hex");

    } catch (error) {
        logger.error(error);
    }
}

// ====================

module.exports = { createWallet, decrypt };