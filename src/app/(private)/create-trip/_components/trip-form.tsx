"use client";

import { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoArrowBack, IoArrowForward, IoAdd, IoClose } from "react-icons/io5";
import QuestionStep from "@/app/(private)/create-trip/_components/question-step";
import { useRouter, useSearchParams } from "next/navigation";
import { questions, tripStatus } from "@/app/_libs/constants/create-trip";
import { createTrip } from "@/app/services/api/trips";
import type { CreateTripPayload, TripStatus } from "@/interfaces/openapi";
import type { Session } from "next-auth";
import DialogLoader from "@/app/_components/layout/dialog-loader";
import { inviteMembersAction } from "@/app/actions/trip-actions";

export default function TripForm({ session }: { session: Session | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawStatus = searchParams.get("status");
  const status: TripStatus =
    rawStatus && tripStatus.includes(rawStatus as TripStatus)
      ? (rawStatus as TripStatus)
      : "inplanning";

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<
    Omit<CreateTripPayload, "user"> & { user: any }
  >({
    destination: "",
    description: null,
    occasion: "",
    members: null,
    start_date: null,
    end_date: null,
    min_budget: null,
    max_budget: null,
    status,
    user: session?.user,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tripCreated, setTripCreated] = useState(false);
  const [tripId, setTripId] = useState(null);

  // Email invite state
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    console.log("Session user:", session);
  }, [session]);

  const updateField = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // clear error on change
  };

  const validateStep = () => {
    const stepFields = questions[step].fields;
    const newErrors: Record<string, string> = {};

    stepFields.forEach((f) => {
      const key = f.key as keyof typeof formData;
      if (f.required && !formData[key]) {
        newErrors[key as string] = `${f.label} is required`;
      }
    });
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);

    const payload = {
      ...formData,
      members: formData.members ? Number(formData.members) : null,
      min_budget: formData.min_budget ? Number(formData.min_budget) : null,
      max_budget: formData.max_budget ? Number(formData.max_budget) : null,
    };

    const response = await createTrip(payload);

    setLoading(false);

    if (!response.error) {
      setTripId((response as any)?.data?.trip?.id ?? 0);
      setTripCreated(true); // show invite form
    } else {
      alert("Failed to create trip");
    }
  };

  const handleAddEmail = () => {
    if (emailInput.trim() && !emails.includes(emailInput.trim())) {
      setEmails((prev) => [...prev, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const handleInvite = async () => {
    if (emails.length === 0) return;
  
    setLoading(true); // show loader and disable form
    try {
      console.log("Inviting emails:", emails);
  
      // Simulate API call (replace with real invite logic)
      await inviteMembersAction({ tripId: tripId!, emails });
      
      setEmails([]); // optionally clear emails
      setEmailInput("");
      router.push("/board")
    } catch (err) {
      console.error("Failed to send invites:", err);
      alert("Failed to send invites");
    } finally {
      setLoading(false); 
    }
  };

  // Disable form when loading
  const isDisabled = loading;

  if (tripCreated) {
    return (
      <div className="w-[500px] p-6 bg-white/70 rounded-2xl shadow-lg text-black relative">
        {loading && <DialogLoader />}
        <h2 className="text-lg font-semibold mb-4">Invite Members</h2>
  
        <div className="flex gap-2 mb-4">
          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter email address"
            disabled={isDisabled}
          />
          <Button onClick={handleAddEmail} disabled={isDisabled}>
            <IoAdd />
          </Button>
        </div>
  
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
  
        {emails.length === 0 ? (
          <Button
            onClick={() => router.push("/board")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white"
            disabled={isDisabled}
          >
            Skip
          </Button>
        ) : (
          <Button
            onClick={handleInvite}
            className={`w-full text-white ${
              !emails.length
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isDisabled}
          >
            Invite
          </Button>
        )}
      </div>
    );
  }
  
  

  return (
    <div className="w-[500px] p-6 bg-white/70 rounded-2xl shadow-lg text-black relative">
      {loading && <DialogLoader />}
      <SwipeableViews index={step} onChangeIndex={setStep}>
        {questions.map((q, idx) => (
          <QuestionStep
            key={idx}
            title={q.title}
            fields={q.fields}
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        ))}
      </SwipeableViews>

      <div className="flex justify-center mt-6 w-full">
        {step > 0 && (
          <Button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 bg-[#5A2D82] hover:bg-purple-800"
            disabled={isDisabled}
          >
            <IoArrowBack />
          </Button>
        )}

        {step < questions.length - 1 ? (
          <Button
            onClick={handleNext}
            className="ml-auto flex items-center gap-2 bg-[#5A2D82] hover:bg-purple-800 text-white"
            disabled={isDisabled}
          >
            <IoArrowForward />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white"
            disabled={isDisabled}
          >
            Create Trip
          </Button>
        )}
      </div>
    </div>
  );
}
