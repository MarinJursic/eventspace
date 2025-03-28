// AuthModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInPopup from "./SignInPopup";
import SignUpPopup from "./SignUpPopup";
import { useSession } from "next-auth/react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
};

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "login",
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      onClose();
    }
  }, [session, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {activeTab === "login" ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <SignInPopup onSuccess={onClose} />
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <SignUpPopup onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
