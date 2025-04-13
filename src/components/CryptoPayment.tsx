
import React, { useState, useEffect } from 'react';
import { Bitcoin, Copy, Check, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CryptoPaymentProps {
  amount: number;
  onComplete: () => void;
}

const CryptoPayment = ({ amount, onComplete }: CryptoPaymentProps) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [selectedCrypto, setSelectedCrypto] = useState<'btc' | 'eth' | 'ton'>('btc');
  const [manualAddress, setManualAddress] = useState('');
  const { toast } = useToast();

  // More realistic exchange rates
  const exchangeRates = {
    btc: 0.000034, // BTC/USD
    eth: 0.00049,  // ETH/USD
    ton: 0.015     // TON/USD
  };
  
  // Real wallet addresses for demo
  const walletAddresses = {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    ton: 'UQD73-9drgEr9RzP7vog9DuXz3Bn6KWeVp60m6DjM9wFO_y3'
  };

  const cryptoAmount = (amount * exchangeRates[selectedCrypto]).toFixed(6);
  
  // Reset payment status when crypto changes
  useEffect(() => {
    setPaymentStatus('pending');
  }, [selectedCrypto]);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyTransaction = () => {
    if (!manualAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter your wallet address",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentStatus('processing');
    
    // In a real app, this would connect to a blockchain node to verify the transaction
    toast({
      title: "Verifying transaction",
      description: "Please wait while we confirm your payment"
    });
    
    // Simulate blockchain confirmation time
    setTimeout(() => {
      // In a real app, this would check if the transaction is valid
      if (Math.random() > 0.1) { // 90% success rate for demo
        setPaymentStatus('completed');
        toast({
          title: "Payment confirmed!",
          description: "Your cryptocurrency payment has been processed"
        });
      } else {
        setPaymentStatus('pending');
        toast({
          title: "Transaction failed",
          description: "We couldn't verify your payment. Please try again.",
          variant: "destructive"
        });
      }
    }, 5000);
  };

  const getCryptoName = () => {
    switch(selectedCrypto) {
      case 'btc': return 'Bitcoin';
      case 'eth': return 'Ethereum';
      case 'ton': return 'TON';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 p-6 border border-white/10 rounded-xl bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Bitcoin className="text-cyber-blue h-6 w-6" />
        <h3 className="text-xl font-medium text-white">Pay with Cryptocurrency</h3>
      </div>
      
      <div className="flex gap-2 mb-2">
        <Button 
          variant={selectedCrypto === 'btc' ? 'cyber' : 'outline'} 
          onClick={() => setSelectedCrypto('btc')}
          className="flex-1"
        >
          Bitcoin
        </Button>
        <Button 
          variant={selectedCrypto === 'eth' ? 'cyber' : 'outline'} 
          onClick={() => setSelectedCrypto('eth')}
          className="flex-1"
        >
          Ethereum
        </Button>
        <Button 
          variant={selectedCrypto === 'ton' ? 'cyber' : 'outline'} 
          onClick={() => setSelectedCrypto('ton')}
          className="flex-1"
        >
          TON
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-cyber-navy/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Amount to pay:</p>
          <p className="text-2xl font-bold text-white">
            {amount.toFixed(2)} USD
            <span className="text-sm text-cyber-blue ml-2">
              ≈ {cryptoAmount} {selectedCrypto.toUpperCase()}
            </span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {getCryptoName()} Address
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-grow p-3 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-white overflow-x-auto">
                {walletAddresses[selectedCrypto]}
              </code>
              <Button
                size="icon"
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => handleCopy(walletAddresses[selectedCrypto])}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Your {getCryptoName()} Wallet Address
            </label>
            <input
              type="text"
              className="cyber-input w-full"
              placeholder={`Enter your ${getCryptoName()} wallet address`}
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1. Send <span className="text-cyber-blue font-mono">{cryptoAmount} {selectedCrypto.toUpperCase()}</span> to the address above</p>
          <p>2. Enter your wallet address for verification</p>
          <p>3. Click "Verify Payment" once completed</p>
          <p>4. Wait for blockchain confirmation (typically 1-6 blocks)</p>
        </div>
        
        {paymentStatus === 'pending' && (
          <Button onClick={verifyTransaction} 
          className="w-full"
          variant="cyber"
          Verify Payment>
           Pay
          </Button>
      
        )}
        
        {paymentStatus === 'processing' && (
          <Button disabled className="w-full">
            Verifying transaction...
          </Button>
        )}
        
        {paymentStatus === 'completed' && (
          <Button variant="cyber" className="w-full" onClick={onComplete}>
            <Check className="mr-2 h-4 w-4" /> Payment confirmed
          </Button>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-white/10">
          <a 
            href={`https://blockexplorer.com`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-cyber-blue"
          >
            View in block explorer <ExternalLink size={12} />
          </a>
          
          <div className="flex items-center gap-1">
            <Wallet size={12} />
            Secure Payments
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
