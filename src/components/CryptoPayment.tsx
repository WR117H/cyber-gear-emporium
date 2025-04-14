
import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CryptoPaymentProps {
  amount: number;
  onComplete: () => void;
}

const CryptoPayment = ({ amount, onComplete }: CryptoPaymentProps) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [manualAddress, setManualAddress] = useState('');
  const { toast } = useToast();

  // Specific TON wallet details
  const tonWalletAddress = 'UQD73-9drgEr9RzP7vog9DuXz3Bn6KWeVp60m6DjM9wFO_y3';
  const exchangeRate = 0.015; // TON/USD rate
  
  const cryptoAmount = (amount * exchangeRate).toFixed(6);
  
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
        description: "Please enter your TON wallet address",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentStatus('processing');
    
    toast({
      title: "Verifying transaction",
      description: "Please wait while we confirm your payment"
    });
    
    // Simulate transaction verification
    setTimeout(() => {
      // Simulated verification with a high success rate
      if (Math.random() > 0.1) { // 90% success rate for demo
        setPaymentStatus('completed');
        toast({
          title: "Payment confirmed!",
          description: "Your TON payment has been processed"
        });
        onComplete();
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

  return (
    <div className="space-y-6 p-6 border border-white/10 rounded-xl bg-card/30 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="p-4 bg-cyber-navy/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Amount to pay:</p>
          <p className="text-2xl font-bold text-white">
            {amount.toFixed(2)} USD
            <span className="text-sm text-cyber-blue ml-2">
              ≈ {cryptoAmount} TON
            </span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              TON Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-grow p-3 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-white overflow-x-auto">
                {tonWalletAddress}
              </code>
              <Button
                size="icon"
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => handleCopy(tonWalletAddress)}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Your TON Wallet Address
            </label>
            <input
              type="text"
              className="cyber-input w-full"
              placeholder="Enter your TON wallet address"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1. Send <span className="text-cyber-blue font-mono">{cryptoAmount} TON</span> to the address above</p>
          <p>2. Enter your wallet address for verification</p>
          <p>3. Click "Pay" once completed</p>
          <p>4. Wait for blockchain confirmation</p>
        </div>
        
        {paymentStatus === 'pending' && (
          <Button 
            onClick={verifyTransaction} 
            className="w-full"
            variant="cyber"
          >
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
            href="https://tonscan.org" 
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
