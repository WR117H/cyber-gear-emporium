
import React, { useState } from 'react';
import { Bitcoin, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CryptoPaymentProps {
  amount: number;
  onComplete: () => void;
}

const CryptoPayment = ({ amount, onComplete }: CryptoPaymentProps) => {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const { toast } = useToast();

  // Example wallet addresses - in a real app these would come from your backend
  const walletAddresses = {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    eth: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate payment processing
  const processPayment = () => {
    setPaymentStatus('processing');
    
    // In a real app, you would have a backend webhook or listener for the transaction
    setTimeout(() => {
      setPaymentStatus('completed');
      toast({
        title: "Payment confirmed!",
        description: "Your cryptocurrency payment has been processed",
      });
      // Call the completion callback
      onComplete();
    }, 3000);
  };

  return (
    <div className="space-y-6 p-6 border border-white/10 rounded-xl bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Bitcoin className="text-cyber-blue h-6 w-6" />
        <h3 className="text-xl font-medium text-white">Pay with Cryptocurrency</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-cyber-navy/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Amount to pay:</p>
          <p className="text-2xl font-bold text-white">
            {amount.toFixed(2)} USD
            <span className="text-sm text-cyber-blue ml-2">
              ≈ {(amount * 0.000016).toFixed(6)} BTC
            </span>
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Bitcoin Address (BTC)
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-grow p-3 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-white overflow-x-auto">
                {walletAddresses.btc}
              </code>
              <Button
                size="icon"
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => handleCopy(walletAddresses.btc)}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Ethereum Address (ETH)
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-grow p-3 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-white overflow-x-auto">
                {walletAddresses.eth}
              </code>
              <Button
                size="icon"
                variant="outline" 
                className="flex-shrink-0"
                onClick={() => handleCopy(walletAddresses.eth)}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>1. Send the exact amount to one of the addresses above</p>
          <p>2. Click "I've made the payment" once completed</p>
          <p>3. Wait for transaction confirmation (usually 1-6 blocks)</p>
        </div>
        
        {paymentStatus === 'pending' && (
          <Button 
            onClick={processPayment} 
            className="w-full"
            variant="cyber"
          >
            I've made the payment
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
        
        <div className="text-xs text-center text-muted-foreground">
          <a 
            href="https://blockexplorer.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 hover:text-cyber-blue"
          >
            View transaction in block explorer <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
