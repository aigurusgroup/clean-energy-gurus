import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  postcode: z.string().trim().min(3, "Enter a postcode").max(10),
  customerType: z.string().min(1, "Select a customer type"),
  spend: z.string().min(1, "Select a spend range"),
  interest: z.string().min(1, "Select an area of interest"),
  contact: z.string().min(1, "Select a contact method"),
  notes: z.string().trim().max(1000).optional(),
});

const opt = (vals: string[]) => (
  <>
    <option value="" disabled>Select…</option>
    {vals.map((v) => <option key={v} value={v}>{v}</option>)}
  </>
);

const selectCls = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-electric/40";

export const ReviewForm = ({ compact = false }: { compact?: boolean }) => {
  const [data, setData] = useState({ name: "", email: "", postcode: "", customerType: "", spend: "", interest: "", contact: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string) => setData({ ...data, [k]: v });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    toast({ title: "Request received", description: "We'll be in touch within one business day." });
    setData({ name: "", email: "", postcode: "", customerType: "", spend: "", interest: "", contact: "", notes: "" });
  };

  return (
    <form onSubmit={submit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <div className={compact ? "" : "sm:col-span-2"}>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={data.name} onChange={(e) => update("name", e.target.value)} className="mt-1.5" />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={data.email} onChange={(e) => update("email", e.target.value)} className="mt-1.5" />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="postcode">Postcode</Label>
        <Input id="postcode" value={data.postcode} onChange={(e) => update("postcode", e.target.value)} className="mt-1.5" />
        {errors.postcode && <p className="text-xs text-destructive mt-1">{errors.postcode}</p>}
      </div>
      <div>
        <Label htmlFor="customerType">Customer type</Label>
        <select id="customerType" value={data.customerType} onChange={(e) => update("customerType", e.target.value)} className={`${selectCls} mt-1.5`}>
          {opt(["Business", "Farm", "Landlord", "Home"])}
        </select>
        {errors.customerType && <p className="text-xs text-destructive mt-1">{errors.customerType}</p>}
      </div>
      <div>
        <Label htmlFor="spend">Annual energy spend</Label>
        <select id="spend" value={data.spend} onChange={(e) => update("spend", e.target.value)} className={`${selectCls} mt-1.5`}>
          {opt(["Under £5k", "£5k–£20k", "£20k–£100k", "£100k+"])}
        </select>
        {errors.spend && <p className="text-xs text-destructive mt-1">{errors.spend}</p>}
      </div>
      <div>
        <Label htmlFor="interest">Area of interest</Label>
        <select id="interest" value={data.interest} onChange={(e) => update("interest", e.target.value)} className={`${selectCls} mt-1.5`}>
          {opt(["Solar PV", "Battery storage", "EV charging", "Monitoring", "Tariff optimisation", "Full review"])}
        </select>
        {errors.interest && <p className="text-xs text-destructive mt-1">{errors.interest}</p>}
      </div>
      <div>
        <Label htmlFor="contact">Preferred contact</Label>
        <select id="contact" value={data.contact} onChange={(e) => update("contact", e.target.value)} className={`${selectCls} mt-1.5`}>
          {opt(["Email", "Phone", "Either"])}
        </select>
        {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <Label htmlFor="notes">Anything else (optional)</Label>
        <Textarea id="notes" rows={3} value={data.notes} onChange={(e) => update("notes", e.target.value)} className="mt-1.5" />
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <Button type="submit" size="lg" className="w-full bg-gradient-electric text-white border-0 rounded-full shadow-glow">
          Request my free energy review
        </Button>
        <p className="text-[11px] text-muted-foreground mt-3 text-center">We'll respond within one business day. No obligation.</p>
      </div>
    </form>
  );
};
