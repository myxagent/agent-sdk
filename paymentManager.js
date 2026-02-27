const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const QRCode = require("qrcode");
const { dbQuery } = require("./dbManager");
const { users } = require("./userData");
const { coins, BNB_COIN_ID } = require("./coinsData");
const { decrypt } = require("./walletManager");
const logger = require("./logger");

// ====================

const ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

// ====================

async function generatePaymentQrCode(recipientAddr, paymentAmount, tokenAddr, tokenDecimals) {
    try {
        let uri;

        if (tokenAddr && tokenDecimals) {
            const paymentWeiAmount = ethers.utils.parseUnits(paymentAmount.toString(), tokenDecimals).toString();
            uri = `binance:${recipientAddr}?token=${tokenAddr}&amount=${paymentWeiAmount}`;

        } else {
            uri = `binance:${recipientAddr}?amount=${paymentAmount}`;
        }

        return await QRCode.toBuffer(uri, { width: 300 });

    } catch (error) {
        logger.error(error);
    }
}

// ====================

async function confirmPayment(userId, coinId, paymentAmount) {
    try {
        const balance = coinId === BNB_COIN_ID
        ? await getNativeBalance(users[userId].wallet_addr)
        : await getTokenBalance(users[userId].wallet_addr, coinId);

        return balance >= paymentAmount; // returns false also if undefined

    } catch (error) {
        logger.error(error);
    }
}

// ====================

async function getNativeBalance(walletAddr) {
    try {
        const weiBalance = await provider.getBalance(walletAddr);
        const balance = Number(ethers.utils.formatEther(weiBalance));

        return balance;

    } catch (error) {
        logger.error(error);
    }
}

// ====================

async function getTokenBalance(walletAddr, coinId) {
    try {
        const tokenContract = new ethers.Contract(coins[coinId].addr, ABI, provider);
        const weiBalance = await tokenContract.balanceOf(walletAddr);
        const balance = Number(ethers.utils.formatUnits(weiBalance, coins[coinId].decimals));

        return balance;

    } catch (error) {
        logger.error(error);
    }
}

// ====================

const funderWallet = new ethers.Wallet(process.env.FUNDER_WALLET_KEY, provider);

const GAS_FOR_NATIVE = ethers.utils.parseEther("0.00001"); // gas kept for native transfers
const GAS_FOR_TOKEN = ethers.utils.parseEther("0.00002"); // gas needed for token transfers

async function transferToTreasury(userId, coinId, paymentAmount) {
    try {
        const [walletRow] = await dbQuery("SELECT wallet_key FROM users WHERE user_id = $1", [userId]);
        if (!walletRow?.wallet_key) return logger.error(`Transfer to treasury failed: Couldn't fetch private key for ${users[userId].wallet_addr}.`, true);

        const userWallet = new ethers.Wallet(decrypt(walletRow.wallet_key), provider);

        if (coinId === BNB_COIN_ID) {
            const weiAmount = ethers.utils.parseEther(paymentAmount.toString()).sub(GAS_FOR_NATIVE);

            const txHash = await transferNative(userWallet, process.env.TREASURY_WALLET_ADDR, weiAmount);
            if (!txHash) return logger.error(`Transfer to treasury failed: Couldn't send ${paymentAmount} ${coins[coinId].symbol}. ${users[userId].wallet_addr} still holds the funds.`, true);

        } else {
            const gasTxHash = await transferNative(funderWallet, users[userId].wallet_addr, GAS_FOR_TOKEN);
            if (!gasTxHash) return logger.error(`Transfer to treasury failed: Funder wallet is out of BNB. ${users[userId].wallet_addr} still holds the funds.`, true);

            const txHash = await transferToken(userWallet, process.env.TREASURY_WALLET_ADDR, coinId, paymentAmount);
            if (!txHash) return logger.error(`Transfer to treasury failed: Couldn't send ${paymentAmount} ${coins[coinId].symbol}. ${users[userId].wallet_addr} still holds the funds.`, true);
        }

        logger.log(`Transfer to treasury completed: Sent ${paymentAmount} ${coins[coinId].symbol}.`);

    } catch (error) {
        logger.error(error);
    }
}

// ====================

async function transferNative(senderWallet, recipientAddr, weiAmount) {
    try {
        if (weiAmount.lte(0)) return;

        const tx = await senderWallet.sendTransaction({
            to: recipientAddr,
            value: weiAmount
        });

        await tx.wait();
        return tx.hash;

    } catch (error) {
        logger.error(error);
    }
}

// ====================

async function transferToken(senderWallet, recipientAddr, coinId, paymentAmount) {
    try {
        const tokenContract = new ethers.Contract(coins[coinId].addr, ABI, senderWallet);

        const weiAmount = ethers.utils.parseUnits(paymentAmount.toString(), coins[coinId].decimals);
        if (weiAmount.lte(0)) return;

        const tx = await tokenContract.transfer(recipientAddr, weiAmount);

        await tx.wait();
        return tx.hash;

    } catch (error) {
        logger.error(error);
    }
}

// ====================

module.exports = { generatePaymentQrCode, confirmPayment, transferToTreasury };