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
import toast from "react-hot-toast";

import axios from "axios";

export function RegisterDialog({ onClose }: any) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // default role

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:4000/signup", {
        name,
        email,
        password,
      });
      toast.success("Register Success");
    } catch (error) {
      console.log(error);
      toast.error("Register Failed");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-700">
            Register
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="userName" className="text-gray-600">
              UserName
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder="xyz_07"
              className="mt-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="reg-email" className="text-gray-600">
              Email
            </Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="reg-password" className="text-gray-600">
              Password
            </Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="********"
              className="mt-1 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-gray-600">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="********"
              className="mt-1 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-md"
            >
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
