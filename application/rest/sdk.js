'use strict';

const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const channelName = 'channel1';
const chaincodeName = 'abstore';

const walletPath = path.join(process.cwd(), '..', 'wallet');
const ccpPath = path.resolve(__dirname, '..', 'connection-org1.json');
const org1UserId = 'appUser';

async function send(type, func, args, res, callback) {
    try {
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const gateway = new Gateway();

        try {
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: false }
            });
            console.log('Success to connect network');

            const network = await gateway.getNetwork(channelName);
            console.log('Success to connect channel1');
            const contract = network.getContract(chaincodeName);

            let result;
            if (type) {
                result = await contract.evaluateTransaction(func, ...args);
            } else {
                result = await contract.submitTransaction(func, ...args);
            }

            if (callback) {
                callback(result.toString());
            } else {
                res.json({ status: 'success', result: result.toString() });
            }
        } catch (error) {
            console.error(`Error processing transaction. ${error}`);
            res.status(500).json({ status: 'error', message: error.toString() });
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`Error connecting to gateway. ${error}`);
        res.status(500).json({ status: 'error', message: error.toString() });
    }
}

module.exports = {
    send: send
};
