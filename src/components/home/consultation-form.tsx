"use client";

import { useRef, useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react";
import { InputField, SelectField, TextareaField } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { site } from "@/config/site";
import {
  CheckCircle2,
  Send,
  AlertCircle,
  Clock,
  X,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export interface ConsultationLabels {
  name: string;
  phone: string;
  service: string;
  message: string;
  choose: string;
  submit: string;
  notice: string;
  required: string;
  checked: string;
}

export interface ConsultationFormProps {
  labels: ConsultationLabels;
  services?: readonly { value: string; label: string }[];
  defaultService?: string;
  variant?: "radio" | "select";
}

// Format phone number strictly into +998 (__) ___-__-__
function formatUzbekPhoneMask(value: string): string {
  if (!value) return "+998 ";
  let digits = value.replace(/\D/g, "");

  // If starts with 998, strip it to only format the remaining 9 digits
  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }
  // Max 9 local digits
  digits = digits.slice(0, 9);

  if (digits.length === 0) return "+998 ";

  let formatted = "+998 ";
  if (digits.length <= 2) {
    formatted += `(${digits}`;
  } else if (digits.length <= 5) {
    formatted += `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 7) {
    formatted += `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  } else {
    formatted += `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
  }
  return formatted;
}

function isValidUzbekPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("998");
}

export function ConsultationForm({
  labels,
  services,
  defaultService,
  variant = "select",
}: ConsultationFormProps) {
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string>();
  const [phone, setPhone] = useState("+998 ");
  const [phoneError, setPhoneError] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>(
    defaultService || (services && services.length > 0 ? services[0].value : "SMM")
  );
  const [selectedTariffBadge, setSelectedTariffBadge] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{
    name: string;
    phone: string;
    service: string;
  } | null>(null);

  // Listen to interactive tariff selections from pricing/hero
  useEffect(() => {
    function handleSelectPlan(event: Event) {
      const customEvent = event as CustomEvent<{ service?: string; tariff?: string }>;
      const { service, tariff } = customEvent.detail || {};
      if (tariff) {
        setSelectedTariffBadge(tariff);
        setSelectedService(tariff);
      } else if (service) {
        setSelectedService(service);
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("select-service-plan", handleSelectPlan);
      return () => {
        window.removeEventListener("select-service-plan", handleSelectPlan);
      };
    }
  }, []);

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // Phone input change handler with strict auto-masking: +998 (__) ___-__-__
  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!raw || raw.trim() === "+" || raw.trim() === "+9" || raw.trim() === "+99" || raw.trim() === "+998") {
      setPhone("+998 ");
      setPhoneError(undefined);
      return;
    }
    const formatted = formatUzbekPhoneMask(raw);
    setPhone(formatted);
    if (phoneError) setPhoneError(undefined);
  }

  // Handle submit
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    let hasError = false;

    // 1. Name validation
    if (!name.trim()) {
      setNameError(labels.required || "Ismingizni kiriting.");
      hasError = true;
    } else {
      setNameError(undefined);
    }

    // 2. Phone validation (Uzbekistan format: +998 (XX) XXX-XX-XX)
    if (!isValidUzbekPhone(phone)) {
      setPhoneError("To'liq formatda kiriting: +998 (XX) XXX-XX-XX");
      hasError = true;
    } else {
      setPhoneError(undefined);
    }

    if (hasError) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          serviceType: selectedService || "SMM",
          message: message.trim(),
          website_hp: honeypot, // Honeypot spam defense
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "So'rovni yuborishda xatolik yuz berdi");
      }

      // Success actions: Toast + Modal
      const leadInfo = {
        name: name.trim(),
        phone: phone.trim(),
        service: selectedService,
      };

      setSubmittedLead(leadInfo);
      setModalOpen(true);
      showToast(labels.checked || "So'rovingiz muvaffaqiyatli qabul qilindi!", "success", 5000);

      // Reset form fields
      setName("");
      setPhone("+998 ");
      setMessage("");
      setHoneypot("");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Serverda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
      );
      showToast(
        err instanceof Error ? err.message : "Xatolik yuz berdi",
        "error",
        5000
      );
    } finally {
      setSubmitting(false);
    }
  }

  const defaultServices = [
    { value: "SMM", label: "SMM (Ijtimoiy tarmoqlar)" },
    { value: "Marketing", label: "Marketing (Kompleks savdo)" },
    { value: "IT xizmatlari", label: "IT xizmatlari (Sayt va dasturlar)" },
  ];

  const effectiveServices = useMemo(() => {
    const base = services && services.length > 0 ? [...services] : [...defaultServices];
    if (selectedTariffBadge && !base.some((s) => s.value === selectedTariffBadge)) {
      return [{ value: selectedTariffBadge, label: selectedTariffBadge }, ...base];
    }
    return base;
  }, [services, selectedTariffBadge]);

  const isFewOptions =
    effectiveServices.length <= 4 && (variant === "radio" || !services || services.length <= 3);

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* Selected Tariff Interactive Badge */}
        {selectedTariffBadge && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-blue-500/15 border border-blue-400/30 text-sky-200 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.15)] animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-sky-400 shrink-0" />
              <span>
                Tanlangan tarif: <strong className="text-white font-bold">{selectedTariffBadge}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTariffBadge(null);
                setSelectedService(defaultServices[0].value);
              }}
              className="p-1 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Tarifni tozalash"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-control bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Honeypot hidden input for spam bot protection */}
        <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
          <label htmlFor="website_hp">Robotlar to'ldirmasin</label>
          <input
            type="text"
            id="website_hp"
            name="website_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="consultation-name"
            name="name"
            label={labels.name}
            autoComplete="name"
            placeholder="Ismingiz"
            required
            value={name}
            error={nameError}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(undefined);
            }}
          />
          <InputField
            id="consultation-phone"
            name="phone"
            label={labels.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+998 (90) 123-45-67"
            value={phone}
            error={phoneError}
            onChange={handlePhoneChange}
          />
        </div>

        {/* Service selection: Radio cards or Select dropdown */}
        {isFewOptions ? (
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-wide uppercase text-slate-300">
              {labels.service} <span aria-hidden="true" className="text-sky-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {effectiveServices.map((opt) => {
                const isSelected = selectedService === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2.5 p-3 rounded-control border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-500/20 border-sky-400 text-sky-200 font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                        : "bg-[#0b1528]/80 border-blue-500/20 text-slate-300 hover:border-blue-500/50 hover:bg-[#0f1d38]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setSelectedService(opt.value)}
                      className="size-4 accent-sky-400"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
          <SelectField
            id="consultation-service"
            name="service"
            label={labels.service}
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            options={effectiveServices}
          />
        )}

        <TextareaField
          id="consultation-message"
          name="message"
          label={labels.message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Loyihangiz yoki talablaringiz haqida qisqacha..."
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Yuborilmoqda...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{labels.submit}</span>
                <Send className="size-4" />
              </span>
            )}
          </Button>

          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="size-3.5 text-sky-400 shrink-0" />
            <span>15 daqiqa ichida javob beramiz</span>
          </span>
        </div>
      </form>

      {/* Interactive Success Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-lg rounded-panel bg-[#091326] border border-blue-500/30 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] space-y-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close icon */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X className="size-5" />
            </button>

            {/* Checkmark icon with pulsing ring */}
            <div className="size-20 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-sky-400 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="size-3" />
                <span>Muvaffaqiyatli qabul qilindi</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Rahmat, {submittedLead?.name}!
              </h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Sizning arizangiz ma'lumotlar bazasiga kiritildi va mas'ul mutaxassisimizga yetkazildi.
              </p>
            </div>

            {/* Submitted Summary Details */}
            {submittedLead && (
              <div className="p-4 rounded-card bg-[#060c18] border border-blue-500/20 text-xs space-y-2 text-left">
                <div className="flex justify-between border-b border-blue-500/15 pb-1.5">
                  <span className="text-slate-400">Telefon raqam:</span>
                  <span className="font-bold text-white">{submittedLead.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanlangan yo'nalish:</span>
                  <span className="font-bold text-sky-400">{submittedLead.service}</span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-control bg-blue-500/10 border border-blue-500/20 text-xs text-slate-200 flex items-center justify-center gap-2">
              <Clock className="size-4 text-sky-400 shrink-0" />
              <span>
                Menejerimiz <strong>15 daqiqa ichida</strong> siz bilan telefon orqali bog'lanadi.
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={site.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold hover:from-blue-500 hover:to-sky-500 transition-all shadow-[0_0_15px_rgba(2,132,199,0.4)]"
              >
                <MessageCircle className="size-4" />
                <span>Telegramda zudlik bilan bog'lanish</span>
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-control bg-blue-500/10 border border-blue-500/20 text-slate-300 text-xs font-bold hover:bg-blue-500/20 hover:text-white transition-colors cursor-pointer"
              >
                Tushunarli / Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

