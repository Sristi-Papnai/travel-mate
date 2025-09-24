"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoAdd, IoClose } from "react-icons/io5";

// import your loader (spinner component)
import DialogLoader from "@/app/_components/layout/dialog-loader";

export default function InviteMemberDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddEmail = () => {
    if (emailInput.trim() !== "" && !emails.includes(emailInput)) {
      setEmails((prev) => [...prev, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const handleSendInvites = async () => {
    setLoading(true);
    setIsDisabled(true);

    try {
      // 🔥 Call your API here
      console.log("Inviting:", emails);
      await new Promise((res) => setTimeout(res, 2000)); // fake delay
      setIsOpen(false);
      setEmails([]);
    } catch (error) {
      console.error("Error sending invites:", error);
    } finally {
      setLoading(false);
      setIsDisabled(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="default"
        className="flex items-center gap-1 cursor-pointer px-3 py-1 bg-[#5A2D82] text-white text-sm rounded-md hover:bg-purple-800"
        onClick={() => setIsOpen(true)}
      >
        Invite Member
      </Button>

      {/* Nested dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">Invite Members</DialogTitle>
          </DialogHeader>

          {/* Email input + add button */}
          <div className="flex gap-2 mb-4">
            <Input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter email address"
              disabled={isDisabled || loading}
              className="text-black border-purple-800"
            />
            <Button onClick={handleAddEmail} disabled={isDisabled || loading}>
              <IoAdd />
            </Button>
          </div>

          {/* Added emails list */}
          <div className="mb-4 flex flex-wrap gap-2">
            {emails.map((e, idx) => (
              <div
                key={idx}
                className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-flex items-center gap-1"
              >
                <span>{e}</span>
                <IoClose
                  className="cursor-pointer hover:text-red-500"
                  onClick={() =>
                    setEmails((prev) => prev.filter((email) => email !== e))
                  }
                />
              </div>
            ))}
          </div>

          {/* Invite action */}
          <Button
            className="bg-[#5A2D82] text-white hover:bg-purple-800 flex items-center justify-center"
            onClick={handleSendInvites}
            disabled={isDisabled || loading || emails.length === 0}
          >
            {loading ? <DialogLoader /> : "Send Invites"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
