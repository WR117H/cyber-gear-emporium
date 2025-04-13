import { useEffect, useState } from 'react';
import { TonConnect, type WalletInfoRemote } from '@tonconnect/sdk';

const tonConnect = new TonConnect();

export default function TonWalletConnector() {
  const [wallet, setWallet] = useState<WalletInfoRemote | null>(null);

  useEffect(() => {
    tonConnect.restoreConnection().then(() => {
      if (tonConnect.connected) {
        setWallet(tonConnect.wallet);
      }
    });
  }, []);

  const connect = async () => {
    try {
      await tonConnect.connectWallet();
      setWallet(tonConnect.wallet);
    } catch (e) {
      console.error('Connection failed', e);
    }
  };

  const sendTransaction = async () => {
    if (!tonConnect.connected) return;

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: 'UQD73-9drgEr9RzP7vog9DuXz3Bn6KWeVp60m6DjM9wFO_y3', // your TON wallet address
          amount: '100000000', // 0.1 TON (in nanoTONs)
        },
      ],
    };

    try {
      await tonConnect.sendTransaction(transaction);
      alert('Transaction sent!');
    } catch (e) {
      alert('Transaction failed');
      console.error(e);
    }
  };

  return (
    <div className="p-4">
      {wallet ? (
        <>
          <p className="mb-2">Connected Wallet: {wallet.account.address}</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={sendTransaction}
          >
            Pay 0.1 TON
          </button>
        </>
      ) : (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={connect}
        >
          Connect TON Wallet
        </button>
      )}
    </div>
  );
}
