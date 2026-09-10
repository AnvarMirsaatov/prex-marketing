"use client";
import { useState, useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { InputField, SelectField, TextareaField } from "@/components/ui/form-fields";
import type { Messages } from "@/i18n/messages";

export function FormPreview({ messages }: { messages: Messages }) {
  const [error, setError] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const t = messages.design;
  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = new FormData(event.currentTarget).get("phone");
    const missing = typeof phone !== "string" || !phone.trim();
    setError(missing ? t.requiredError : undefined);
    if (missing) form.current?.querySelector<HTMLInputElement>("#preview-phone")?.focus();
  }
  return (
    <form ref={form} noValidate onSubmit={check} className="space-y-5">
      <p id="preview-notice" className="text-label text-muted">
        {t.formNotice}
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField id="preview-name" name="name" label={t.name} autoComplete="name" />
        <InputField
          id="preview-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          label={t.phone}
          hint={t.phoneHint}
          required
          error={error}
          onChange={() => setError(undefined)}
        />
      </div>
      <SelectField
        id="preview-service"
        name="service"
        label={t.service}
        defaultValue=""
        options={[
          { value: "", label: t.select },
          { value: "smm", label: messages.pages.smm },
          { value: "marketing", label: messages.pages.marketing },
          { value: "it", label: messages.pages.it },
        ]}
      />
      <TextareaField id="preview-message" name="message" label={t.message} />
      <Button type="submit" aria-describedby="preview-notice">
        {t.checkFields}
      </Button>
    </form>
  );
}
