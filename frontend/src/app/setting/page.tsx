"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Search, Edit, Play, Facebook, Twitter, Linkedin, Instagram, Home, History, Settings, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFullName: string;
  currentEmail: string;
  onSave: (updatedFullName: string, updatedEmail: string) => void;
}


// Modal component for editing Profile Information
const EditProfileModal = ({ isOpen, onClose, currentFullName, currentEmail, onSave }: EditProfileModalProps) => {
  const [newFullName, setNewFullName] = useState(currentFullName);
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Make the API call to update the user profile
      const response = await axios.put(
        "http://localhost:4000/profile/update", // Replace with your actual API base URL
        {
          name: newFullName,
          email: newEmail,
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store a JWT token in localStorage
        //   },
        // }
      );

      // Update the parent component's state with the new profile data
      onSave(newFullName, newEmail);

      // Show success notification
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      // Close the modal
      onClose();
    } catch (err: any) {
      // Handle errors
      setError(err.response?.data?.error || "Failed to update profile");
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modalFullName">Full Name</Label>
                <Input
                  id="modalFullName"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalEmailAddress">Email Address</Label>
                <Input
                  id="modalEmailAddress"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface EditLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSourceLanguage: string;
  currentTargetLanguage: string;
  onSave: (updatedSource: string, updatedTarget: string) => void;
}

// Modal component for editing Language Preferences
const EditLanguageModal = ({ isOpen, onClose, currentSourceLanguage, currentTargetLanguage, onSave }: EditLanguageModalProps) => {
  const [newSourceLanguage, setNewSourceLanguage] = useState(currentSourceLanguage);
  const [newTargetLanguage, setNewTargetLanguage] = useState(currentTargetLanguage);

  const handleSave = () => {
    onSave(newSourceLanguage, newTargetLanguage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm p-4" // Changed background to blurred white
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Language Preferences</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modalSourceLanguage">Source Language</Label>
                <Select value={newSourceLanguage} onValueChange={setNewSourceLanguage}>
                  <SelectTrigger id="modalSourceLanguage">
                    <SelectValue placeholder="Select Source Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalTargetLanguage">Target Language</Label>
                <Select value={newTargetLanguage} onValueChange={setNewTargetLanguage}>
                  <SelectTrigger id="modalTargetLanguage">
                    <SelectValue placeholder="Select Target Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};



export default function App() {
  // State for form fields
  const [fullName, setFullName] = useState("Alice Johnson");
  const [emailAddress, setEmailAddress] = useState("alice.johnson@example.com");
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("spanish");

  // State for modal visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Framer Motion variants for card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSaveProfile = (newFullName: string, newEmail: string) => {
    setFullName(newFullName);
    setEmailAddress(newEmail);
  };

  const handleSaveLanguage = (newSource: string, newTarget: string) => {
    setSourceLanguage(newSource);
    setTargetLanguage(newTarget);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      {/* Top Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto flex flex-col sm:flex-row max-w-full items-center justify-between p-4 px-4 sm:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-xl font-bold mb-2 sm:mb-0">
            <span className="text-blue-500">::</span>
            <span>logo</span>
          </div>
          {/* Navigation Links and User Avatar */}
          <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-4 sm:space-x-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              History
            </a>
            <a href="#" className="text-sm font-medium text-blue-500 border-b-2 border-blue-500">
              Settings
            </a>
            <Avatar className="ml-2">
              <AvatarImage src="https://placehold.co/40x40/e2e8f0/64748b?text=JD" alt="User Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </header>

      {/* Main Content Area: Now full width */}
      <div className="flex flex-1 flex-col">
        {/* Main Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Settings</h1>

          {/* Profile Information Section */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5 }}
          >
            <Card className="rounded-xl shadow-md p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-bold mb-2">Profile Information</CardTitle>
              <p className="text-sm text-gray-600 mb-6">Update your personal details and avatar.</p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://placehold.co/64x64/e2e8f0/64748b?text=AJ" alt="Alice Johnson" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-semibold">{fullName}</p>
                  <p className="text-sm text-gray-500">{emailAddress}</p>
                </div>
                <Button variant="ghost" size="icon" className="sm:ml-auto text-gray-500" onClick={() => setIsProfileModalOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input id="emailAddress" value={emailAddress} readOnly />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsProfileModalOpen(true)}>Edit Profile</Button>
              </div>
            </Card>
          </motion.div>

          {/* Language Preferences Section */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="rounded-xl shadow-md p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-bold mb-2">Language Preferences</CardTitle>
              <p className="text-sm text-gray-600 mb-6">Select your preferred source and target languages for translation.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sourceLanguage">Source Language</Label>
                  <Select value={sourceLanguage}>
                    <SelectTrigger id="sourceLanguage">
                      <SelectValue placeholder="Select Source Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetLanguage">Target Language</Label>
                  <Select value={targetLanguage}>
                    <SelectTrigger id="targetLanguage">
                      <SelectValue placeholder="Select Target Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsLanguageModalOpen(true)}>Edit Language</Button>
              </div>
            </Card>
          </motion.div>

          {/* Voice Settings Section */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="rounded-xl shadow-md p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-bold mb-2">Voice Settings</CardTitle>
              <p className="text-sm text-gray-600 mb-6">Customize the voice for text-to-speech output.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selectVoice">Select Voice</Label>
                  <Select defaultValue="standard-female">
                    <SelectTrigger id="selectVoice">
                      <SelectValue placeholder="Select Voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard-female">Standard Female</SelectItem>
                      <SelectItem value="standard-male">Standard Male</SelectItem>
                      <SelectItem value="ai-voice-1">AI Voice 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="Hello, how can I help you?"
                    className="min-h-[80px] pr-10 resize-none bg-gray-50"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-2 bottom-2 text-gray-500">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <Button variant="ghost">Cancel</Button>
                <Button className="bg-blue-500 text-white hover:bg-blue-600">Save Changes</Button>
              </div>
            </Card>
          </motion.div>

          {/* Display & Session Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="rounded-xl shadow-md p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-bold mb-2">Display & Session</CardTitle>
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium">Application Theme</p>
                    <p className="text-sm text-gray-600">Switch between light and dark modes.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-sm text-gray-600">Manage your active login sessions and ensure account security.</p>
                  </div>
                  <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Footer Section */}
      <footer className="mt-auto bg-white p-4 text-sm text-gray-500 shadow-sm border-t border-gray-200">
        <div className="mx-auto flex flex-col sm:flex-row max-w-full items-center justify-between px-4 sm:px-8">
          <div className="flex space-x-6 mb-2 sm:mb-0">
            <a href="#">Resources</a>
            <a href="#">Company</a>
            <a href="#">Legal</a>
          </div>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentFullName={fullName}
        currentEmail={emailAddress}
        onSave={handleSaveProfile}
      />

      <EditLanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentSourceLanguage={sourceLanguage}
        currentTargetLanguage={targetLanguage}
        onSave={handleSaveLanguage}
      />
    </div>
  );
}
