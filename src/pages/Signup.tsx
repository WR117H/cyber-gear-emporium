import React, { useState, useEffect } from 'react'; import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"; import { Button } from "@/components/ui/button"; import { useToast } from "@/hooks/use-toast"; import { Mail, MailCheck } from 'lucide-react';

interface OTPVerificationProps { length?: number; onVerify: (code: string) => void; isLoading?: boolean; email?: string; }

export function OTPVerification({ length = 6, onVerify, isLoading = false, email }: OTPVerificationProps) { const [otp, setOtp] = useState(""); const [resendTimeout, setResendTimeout] = useState(30); const { toast } = useToast();

useEffect(() => { let timer: NodeJS.Timeout; if (resendTimeout > 0) { timer = setInterval(() => { setResendTimeout((prev) => prev - 1); }, 1000); }

return () => {
  if (timer) clearInterval(timer);
};

}, [resendTimeout]);

const handleResend = () => { toast({ title: "Code resent!", description: A new verification code has been sent to ${email || "your email"}, }); setResendTimeout(30); };

const handleVerify = () => { if (otp.length === length) { onVerify(otp); } };

return ( <div className="space-y-8"> <div className="space-y-4 text-center"> <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"> <MailCheck className="h-6 w-6 text-cyber-blue" /> </div>

<h3 className="text-lg font-medium text-white">Check your email</h3>
    {email && (
      <p className="text-md text-cyber-blue font-medium">
        {email}
      </p>
    )}
    <p className="text-sm text-muted-foreground">
      We've sent a verification code to your email
    </p>
  </div>
  
  <div className="flex flex-col items-center space-y-4">
    <InputOTP 
      maxLength={length} 
      value={otp} 
      onChange={setOtp}
      containerClassName="gap-2 md:gap-4"
    >
      <InputOTPGroup>
        {Array.from({ length }).map((_, i) => (
          <React.Fragment key={i}>
            <InputOTPSlot index={i} />
            {i !== length - 1 && <InputOTPSeparator />}
          </React.Fragment>
        ))}
      </InputOTPGroup>
    </InputOTP>
    
    <Button 
      onClick={handleVerify} 
      disabled={otp.length !== length || isLoading}
      variant="cyber"
      className="w-full mt-4"
    >
      {isLoading ? "Verifying..." : "Verify Email"}
    </Button>
    
    <div className="text-sm text-center">
      {resendTimeout > 0 ? (
        <p className="text-muted-foreground">
          Resend code in {resendTimeout}s
        </p>
      ) : (
        <button 
          onClick={handleResend} 
          className="text-cyber-blue hover:underline"
        >
          Resend code
        </button>
      )}
    </div>
  </div>
</div>

); }

