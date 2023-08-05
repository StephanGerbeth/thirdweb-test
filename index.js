import { ethers } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import dotenv from 'dotenv-mono';
import { PublicLockV12 } from '@unlock-protocol/contracts';

dotenv.config();

const thirdwebOptions = {
    gasSettings: { maxPriceInGwei: 1.5, speed: 'fastest' },
    clientId: process.env.THIRDWEB_CLIENT_ID,
    gatewayUrls: [
        'https://ipfs.io/ipfs/',
        'https://gateway.ipfs.io/ipfs/',
        'https://dweb.link/ipfs/',
        'https://4everland.io/ipfs/'
]
};
const sdk = await ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, 80001, thirdwebOptions);
const contract = await sdk.getContract('0x1d79618361812118bE2ff04df1B1b14d1d08B833');
const publicAddress = sdk.signer.address;

const lockInterface = new ethers.utils.Interface(PublicLockV12.abi);
const params = [
    publicAddress,
    lockInterface.encodeFunctionData('initialize(address,uint256,address,uint256,uint256,string)', [
        contract.getAddress(),
        20000,
        ethers.constants.AddressZero, // We use the base chain currency
        String(0), // 0.01 Eth
        String(10),
        'Test Lock'
    ])
]

contract.events.addEventListener('LockCreated', (e) => {
    console.log('A')
})
contract.events.addEventListener('LockCreated', (e) => {
    console.log('B')
})
contract.events.addEventListener('LockCreated', (e) => {
    console.log('C')
})

const tx = await contract.prepare('deployLockWithNonTransferableKeys', params).send()
console.log(tx);