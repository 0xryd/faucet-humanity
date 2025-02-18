import { readFileSync } from 'fs';
import { Wallet } from 'ethers';

const filePath = './privateKeys.json'; // Sesuaikan path jika perlu
const privateKeys = JSON.parse(readFileSync(filePath, 'utf-8')); // Membaca file JSON

if (privateKeys.length === 0) {
  console.error('Error: Tidak ada private key dalam file.');
  process.exit(1);
}

const url = 'https://faucet.testnet.humanity.org/api/claim';
const headers = {
  'Accept': '*/*',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/json',
  'Origin': 'https://faucet.testnet.humanity.org',
  'Referer': 'https://faucet.testnet.humanity.org/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
};

// Loop untuk setiap private key dalam file JSON
const requestFaucet = async () => {
  for (const privateKey of privateKeys) {
    try {
      const wallet = new Wallet(privateKey);
      const walletAddress = wallet.address;

      console.log(`Requesting faucet for address: ${walletAddress}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ address: walletAddress })
      });

      const data = await response.json();
      console.log(`Response for ${walletAddress}:`, data);
    } catch (error) {
      console.error(`Error processing ${privateKey}:`, error);
    }
  }
};

requestFaucet();
