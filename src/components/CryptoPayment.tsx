import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTONConnect } from '@/context/TONConnectProvider';

interface CryptoPaymentProps {
  amount: number;
  onComplete: () => void;
}

const CryptoPayment = ({ amount, onComplete }: CryptoPaymentProps) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const { toast } = useToast();
  const { isConnected, sendTransaction, tonConnectUI } = useTONConnect();

  const exchangeRate = 0.3; // 1 USD ≈ 0.3 TON
  const cryptoAmount = (amount * exchangeRate).toFixed(2);

  const handleClick = async () => {
    if (!isConnected) {
      tonConnectUI.openModal(); // Trigger wallet connect
      return;
    }

    try {
      setPaymentStatus('processing');

      toast({
        title: "Processing payment",
        description: "Please confirm the transaction in your TON wallet"
      });

      const success = await sendTransaction(parseFloat(cryptoAmount));
      if (success) {
        setPaymentStatus('completed');
        toast({
          title: "Payment successful!",
          description: "Your TON payment has been processed"
        });
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setPaymentStatus('pending');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('pending');
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
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

        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          {paymentStatus === 'pending' && (
            <Button onClick={handleClick} className="w-full mt-2" variant="cyber">
              {isConnected ? 'Pay with TON' : 'Connect Wallet to Pay'}
            </Button>
          )}

          {paymentStatus === 'processing' && (
            <Button disabled className="w-full mt-2">
              Processing payment...
            </Button>
          )}

          {paymentStatus === 'completed' && (
            <Button variant="cyber" className="w-full mt-2" onClick={onComplete}>
              <Check className="mr-2 h-4 w-4" /> Payment confirmed
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground space-y-1 mt-4">
          <p>1. Connect your TON wallet</p>
          <p>2. Send <span className="text-cyber-blue font-mono">{cryptoAmount} TON</span> to complete payment</p>
          <p>3. Click "Pay with TON" to confirm</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;