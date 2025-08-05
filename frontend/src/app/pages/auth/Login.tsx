import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "react-hot-toast";

// LoginDialog Component
export function LoginDialog({ onClose }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/login",
        {
          email,
          password,
        },
        {
          withCredentials: true, // ✅ sends and receives cookies
        }
      );

      toast.success("Login Success");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-700">
            Login
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-600 mb-3">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-600 mb-3">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="mt-1 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md"
            >
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
