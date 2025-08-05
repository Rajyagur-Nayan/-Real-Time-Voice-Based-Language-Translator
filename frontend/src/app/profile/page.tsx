"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Play, X } from "lucide-react"; // Import all necessary Lucide icons
import { useAuth } from "../pages/auth/AuthContext";

const Button = ({
  children,
  className,
  variant = "default",
  ...props
}: any) => {
  let baseStyle =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-200";
  if (variant === "destructive") {
    baseStyle += " bg-red-600 text-white hover:bg-red-700";
  } else if (variant === "outline") {
    baseStyle += " border border-gray-600 text-gray-200 hover:bg-gray-700";
  } else if (variant === "ghost") {
    baseStyle += " text-gray-400 hover:bg-gray-700";
  } else {
    baseStyle += " bg-blue-600 text-white hover:bg-blue-700";
  }
  return (
    <button className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: any) => (
  <div
    className={`bg-gray-900 rounded-xl shadow-lg border border-gray-800 ${className}`}
    {...props}
  >
    {children}
  </div>
);
const CardHeader = ({ children, className, ...props }: any) => (
  <div className={`p-4 md:p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className, ...props }: any) => (
  <h3
    className={`text-lg md:text-xl font-bold text-purple-300 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className, ...props }: any) => (
  <div className={`p-4 md:p-6 pt-4 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className, ...props }: any) => (
  <input
    className={`w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className, ...props }: any) => (
  <label
    htmlFor={htmlFor}
    className={`text-gray-300 text-sm font-medium ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Select = ({
  children,
  value,
  onValueChange,
  placeholder,
  ...props
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Find the selected item's text to display in the trigger
  const selectedItemText =
    React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        typeof child.props === "object" &&
        child.props !== null &&
        "value" in child.props &&
        child.props.value === value
      ) {
        return "children" in child.props ? child.props.children : null;
      }
      return null;
    }).filter(Boolean)[0] || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation (optional, but good for accessibility)
  const handleKeyDown = (event: any) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
    // Add more keyboard navigation logic (ArrowUp, ArrowDown, Enter) if needed
  };

  return (
    <div
      className="relative"
      ref={selectRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Custom Trigger - visually displayed */}
      <SelectTrigger
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        {...props}
      >
        <SelectValue placeholder={placeholder}>{selectedItemText}</SelectValue>
      </SelectTrigger>

      {/* Hidden Native Select for accessibility and form submission */}
      {/* This is the actual <select> element that holds the value */}
      <select
        value={value}
        onChange={(e) => {
          onValueChange && onValueChange(e.target.value);
          setIsOpen(false); // Close dropdown on native select change
        }}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-0" // Make it visually hidden but clickable
        aria-hidden="true" // Hide from assistive technologies as custom UI provides experience
        tabIndex={-1} // Make it not focusable directly, custom trigger handles focus
        // The actual <option> tags go here
      >
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            child.type === SelectItem &&
            typeof child.props === "object" &&
            child.props !== null &&
            "value" in child.props
          ) {
            return (
              <option
                key={(child.props as any).value}
                value={(child.props as any).value}
              >
                {(child.props as any).children}
              </option>
            );
          }
          return null;
        })}
      </select>

      {/* Custom Dropdown Content - conditionally rendered */}
      <AnimatePresence>
        {isOpen && (
          <SelectContent>
            {" "}
            {/* Now correctly using SelectContent component */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SelectItem) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  onClick: () => {
                    onValueChange &&
                      onValueChange(
                        (child as React.ReactElement<any>).props.value
                      );
                    setIsOpen(false);
                  },
                  className: `p-2 hover:bg-gray-700 cursor-pointer ${
                    (child.props as any).value === value ? "bg-gray-700" : ""
                  }`,
                });
              }
              return null;
            })}
          </SelectContent>
        )}
      </AnimatePresence>
    </div>
  );
};

// SelectTrigger component - now a simple div that acts as the visual trigger
const SelectTrigger = ({ children, className, onClick, ...props }: any) => (
  <div
    className={`flex items-center justify-between ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-400 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
);

// SelectValue component - just renders text based on selected value
const SelectValue = ({ placeholder, children }: any) => (
  <span>{children || placeholder}</span>
);

// SelectContent component - Reinstated as a component
const SelectContent = ({ children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
  >
    {children}
  </motion.div>
);

// SelectItem component - now a div representing a clickable option in the custom dropdown
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const SelectItem = ({
  children,
  value,
  onClick,
  className,
  ...props
}: SelectItemProps) => (
  <div className={className} onClick={onClick} {...props}>
    {children}
  </div>
);
// --- END REFACTORED SELECT COMPONENTS ---

const Textarea = ({ className, ...props }: any) => (
  <textarea
    className={`w-full p-3 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${className}`}
    {...props}
  ></textarea>
);

const Switch = ({ checked, onCheckedChange, ...props }: any) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
      checked ? "bg-blue-600" : "bg-gray-700"
    }`}
    {...props}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const Avatar = ({ children, className, ...props }: any) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  >
    {children}
  </div>
);

const AvatarImage = ({ src, alt, className, ...props }: any) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full ${className}`}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = "https://placehold.co/64x64/e2e8f0/64748b?text=U";
    }}
    {...props}
  />
);

const AvatarFallback = ({ children, className, ...props }: any) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-700 text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// --- Simulated Shadcn Dialog Components ---
const Dialog = ({ children, open, onOpenChange }: any) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)} // Close on backdrop click
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DialogTrigger = ({ children, onClick }: any) => (
  <span onClick={onClick}>{children}</span>
);

const DialogContent = ({ children, className, onClose }: any) => (
  <motion.div
    className={`bg-gray-900 rounded-xl shadow-lg p-6 -full max-w-md relative text-gray-100 ${className}`}
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 50, opacity: 0 }}
    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
  >
    {children}
    {onClose && (
      <Button
        variant="ghost"
        className="absolute top-4 right-4 text-gray-500 hover:bg-gray-800"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
    )}
  </motion.div>
);

const DialogHeader = ({ children, className }: any) => (
  <div className={`text-center mb-6 ${className}`}>{children}</div>
);

const DialogTitle = ({ children, className }: any) => (
  <h2 className={`text-2xl font-bold text-purple-300 ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className }: any) => (
  <p className={`text-sm text-gray-400 ${className}`}>{children}</p>
);

const DialogFooter = ({ children, className }: any) => (
  <div className={`flex justify-end space-x-4 mt-8 ${className}`}>
    {children}
  </div>
);

// --- End Simulated Shadcn UI Components ---

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFullName: string;
  currentEmail: string;
  onSave: (updatedFullName: string, updatedEmail: string) => void;
}

// Modal component for editing Profile Information
const EditProfileModal = ({
  isOpen,
  onClose,
  currentFullName,
  currentEmail,
  onSave,
}: EditProfileModalProps) => {
  const [newFullName, setNewFullName] = useState(currentFullName);
  const [newEmail, setNewEmail] = useState(currentEmail);

  const handleSave = () => {
    onSave(newFullName, newEmail);
    console.log(newEmail, newFullName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={undefined} onClose={onClose}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Edit Profile</DialogTitle>
          <DialogDescription className={undefined}>
            Update your personal details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={undefined} htmlFor="modalFullName">
              Full Name
            </Label>
            <Input
              className={undefined}
              id="modalFullName"
              value={newFullName}
              onChange={(e: any) => setNewFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className={undefined} htmlFor="modalEmailAddress">
              Email Address
            </Label>
            <Input
              className={undefined}
              id="modalEmailAddress"
              value={newEmail}
              onChange={(e: any) => setNewEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter className={undefined}>
          <Button className={undefined} variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
const EditLanguageModal = ({
  isOpen,
  onClose,
  currentSourceLanguage,
  currentTargetLanguage,
  onSave,
}: EditLanguageModalProps) => {
  const [newSourceLanguage, setNewSourceLanguage] = useState(
    currentSourceLanguage
  );
  const [newTargetLanguage, setNewTargetLanguage] = useState(
    currentTargetLanguage
  );

  const handleSave = () => {
    onSave(newSourceLanguage, newTargetLanguage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={undefined} onClose={onClose}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>
            Edit Language Preferences
          </DialogTitle>
          <DialogDescription className={undefined}>
            Select your preferred source and target languages.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={undefined} htmlFor="modalSourceLanguage">
              Source Language
            </Label>
            <Select
              value={newSourceLanguage}
              onValueChange={setNewSourceLanguage}
              id="modalSourceLanguage" // Added ID for label association
              placeholder="Select Source Language" // Added placeholder
            >
              <SelectItem
                className={undefined}
                onClick={undefined}
                value="english"
              >
                English
              </SelectItem>
              <SelectItem
                className={undefined}
                onClick={undefined}
                value="spanish"
              >
                Spanish
              </SelectItem>
              <SelectItem
                className={undefined}
                onClick={undefined}
                value="french"
              >
                French
              </SelectItem>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className={undefined} htmlFor="modalTargetLanguage">
              Target Language
            </Label>
            <Select
              value={newTargetLanguage}
              onValueChange={setNewTargetLanguage}
              id="modalTargetLanguage" // Added ID for label association
              placeholder="Select Target Language" // Added placeholder
            >
              <SelectItem
                className={undefined}
                onClick={undefined}
                value="english"
              >
                English
              </SelectItem>
              <SelectItem
                className={undefined}
                onClick={undefined}
                value="spanish"
              >
                Spanish
              </SelectItem>
              <SelectItem
                className={undefined}
                onClick={undefined}
                value="french"
              >
                French
              </SelectItem>
            </Select>
          </div>
        </div>
        <DialogFooter className={undefined}>
          <Button className={undefined} variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// The Navbar component is now removed as requested
// const Navbar = () => { ... };

export default function App() {
  // State for form fields
  const [fullName, setFullName] = useState("Alice Johnson");
  const [emailAddress, setEmailAddress] = useState("alice.johnson@example.com");
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("spanish");
  const [appThemeDark, setAppThemeDark] = useState(true); // State for theme switch

  // State for modal visibility
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { logout } = useAuth();

  // Set dark mode initially and toggle with switch
  useEffect(() => {
    if (appThemeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appThemeDark]);

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
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Main Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-purple-300">
            Settings
          </h1>

          {/* Profile Information Section */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5 }}
          >
            <Card className="rounded-xl shadow-md p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-bold mb-2">
                Profile Information
              </CardTitle>
              <p className="text-sm text-gray-400 mb-6">
                Update your personal details and avatar.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    className={undefined}
                    src="https://placehold.co/64x64/e2e8f0/64748b?text=AJ"
                    alt="Alice Johnson"
                  />
                  <AvatarFallback className={undefined}>AJ</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <p className="text-lg font-semibold">{fullName}</p>
                  <p className="text-sm text-gray-400">{emailAddress}</p>
                </div>
                <Button
                  variant="ghost"
                  className="sm:ml-auto text-gray-500 hover:bg-gray-800"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label className={undefined} htmlFor="fullName">
                    Full Name
                  </Label>
                  <Input
                    className={undefined}
                    id="fullName"
                    value={fullName}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label className={undefined} htmlFor="emailAddress">
                    Email Address
                  </Label>
                  <Input
                    id="emailAddress"
                    value={emailAddress}
                    className={undefined}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  Edit Profile
                </Button>
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
              <CardTitle className="text-lg md:text-xl font-bold mb-2">
                Language Preferences
              </CardTitle>
              <p className="text-sm text-gray-400 mb-6">
                Select your preferred source and target languages for
                translation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label className={undefined} htmlFor="sourceLanguage">
                    Source Language
                  </Label>
                  <Select
                    value={sourceLanguage}
                    onValueChange={setSourceLanguage}
                    id="sourceLanguage"
                    placeholder="Select Source Language"
                  >
                    <SelectItem
                      className={undefined}
                      onClick={undefined}
                      value="english"
                    >
                      English
                    </SelectItem>
                    <SelectItem
                      className={undefined}
                      onClick={undefined}
                      value="spanish"
                    >
                      Spanish
                    </SelectItem>
                    <SelectItem
                      className={undefined}
                      onClick={undefined}
                      value="french"
                    >
                      French
                    </SelectItem>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={undefined} htmlFor="targetLanguage">
                    Target Language
                  </Label>
                  <Select
                    value={targetLanguage}
                    onValueChange={setTargetLanguage}
                    id="targetLanguage"
                    placeholder="Select Target Language"
                  >
                    <SelectItem
                      value="english"
                      onClick={undefined}
                      className={undefined}
                    >
                      English
                    </SelectItem>
                    <SelectItem
                      className={undefined}
                      value="spanish"
                      onClick={undefined}
                    >
                      Spanish
                    </SelectItem>
                    <SelectItem
                      className={undefined}
                      onClick={undefined}
                      value="french"
                    >
                      French
                    </SelectItem>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsLanguageModalOpen(true)}
                >
                  Edit Language
                </Button>
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
              <CardTitle className="text-lg md:text-xl font-bold mb-2">
                Display & Session
              </CardTitle>
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium">Application Theme</p>
                    <p className="text-sm text-gray-400">
                      Switch between light and dark modes.
                    </p>
                  </div>
                  <Switch
                    checked={appThemeDark}
                    onCheckedChange={setAppThemeDark}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>

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
