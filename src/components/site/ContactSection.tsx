"use client";

import { useState } from "react";
import { AtSign, Mail, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/content/types";
import { TodoTag } from "@/components/ui/TodoTag";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <h2 className="mb-8 font-display text-3xl font-bold">Contact</h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-3 font-body text-sm text-ink-soft">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {settings.contactEmail ? settings.contactEmail : <TodoTag>Contact email — add via CMS</TodoTag>}
          </p>
          <p className="flex items-center gap-2">
            <AtSign className="h-4 w-4" />
            {settings.instagramHandle ? settings.instagramHandle : <TodoTag>Instagram handle — add via CMS</TodoTag>}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {settings.businessAddress ? settings.businessAddress : <TodoTag>Business address — add via CMS</TodoTag>}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block font-body text-sm">
            <span className="mb-1 block font-medium">Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="block font-body text-sm">
            <span className="mb-1 block font-medium">Your email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="block font-body text-sm">
            <span className="mb-1 block font-medium">Message</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-tomato px-6 py-2.5 font-body text-sm font-semibold text-white disabled:opacity-40"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {status === "sent" && <p className="font-body text-xs text-olive">Thanks — we&apos;ll be in touch.</p>}
          {status === "error" && <p className="font-body text-xs text-tomato">Couldn&apos;t send — try again shortly.</p>}
        </form>
      </div>
    </section>
  );
}
