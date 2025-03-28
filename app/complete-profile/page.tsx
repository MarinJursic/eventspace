// /app/complete-profile/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function CompleteProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }
      toast({
        title: "Profile updated",
        description: "Your account is now complete.",
      });

      signOut({ redirect: false });

      signIn("google");
    } catch (err) {
      setError("An error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <RadioGroup
            value={role}
            onValueChange={(value) => setRole(value)}
            className="flex flex-col space-y-2"
            required
          >
            <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="customer" id="cp-customer" />
              <Label htmlFor="cp-customer" className="cursor-pointer flex-1">
                Customer
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
              <RadioGroupItem value="vendor" id="cp-vendor" />
              <Label htmlFor="cp-vendor" className="cursor-pointer flex-1">
                Vendor
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="complete-password">Set a Password</Label>
          <Input
            id="complete-password"
            type="password"
            placeholder="Enter a new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </form>
    </div>
  );
}
