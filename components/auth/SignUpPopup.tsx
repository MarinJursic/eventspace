"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { FcGoogle } from "react-icons/fc";

type SignUpProps = {
  onClose: () => void;
};

const SignUpPopup: React.FC<SignUpProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call Next-Auth's credentials provider to register the user.
      // The provider creates a new account or logs in an existing one.
      const result = await signIn("credentials", {
        redirect: false,
        name,
        email,
        password,
        role: role,
        callbackUrl: window.location.href,
        isSignUp: "true",
      });

      if (result?.error) {
        toast({
          title: "Sign up failed",
          description: result.error,
          variant: "destructive",
        });
      } else if (result?.url && result.url.includes("/complete-profile")) {
        // If the account is missing required fields (incomplete), redirect to complete the profile.
        router.push(result.url);
      } else {
        toast({
          title: "Account created",
          description: "Welcome to EventSpace!",
        });
        // Close the popup and continue where the user was browsing.
        onClose();
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "There was a problem creating your account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9"
            required
            minLength={6}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters long
        </p>
      </div>

      <div className="space-y-2">
        <Label>Account Type</Label>
        <RadioGroup
          value={role}
          onValueChange={(value) => setRole(value as "customer" | "vendor")}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
            <RadioGroupItem value="customer" id="customer" />
            <Label htmlFor="customer" className="cursor-pointer flex-1">
              <div className="font-medium">Customer</div>
              {/*<div className="text-sm text-muted-foreground">
                Event organizer looking to book venues and services
              </div>*/}
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 ">
            <RadioGroupItem value="vendor" id="vendor" />
            <Label htmlFor="vendor" className="cursor-pointer flex-1">
              <div className="font-medium">Vendor</div>
              {/*<div className="text-sm text-muted-foreground">
                Business offering venues or services for events
              </div>*/}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign up"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={() =>
            signIn("google", { callbackUrl: window.location.href })
          }
        >
          <FcGoogle />
          Google
        </Button>
      </div>
    </form>
  );
};

export default SignUpPopup;
