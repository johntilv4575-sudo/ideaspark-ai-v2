import React from "react";
import { format } from "date-fns";
import { Check, HelpCircle, AlertTriangle, FlaskConical, Wallet } from "lucide-react";
import { VERDICTS } from "@/lib/validation";

function Section({ title, icon: Icon, children, tone = "text-slate-300" }) {
  return (
    <div className="card-secondary p-4 md:p-5">
      <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${tone}`}>
        <Icon className="w-4 h-4" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ValidationReport({ validation }) {
  const verdict = VERDICTS[validation.verdict] || VERDICTS.promising;
  const sell = validation.how_to_sell || {};

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 md:p-6 ${verdict.tone}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider opacity-80">Verdict</p>
            <p className="text-2xl font-bold text-white">{verdict.label}</p>
            <p className="text-sm text-slate-200 mt-1 max-w-xl">{validation.headline}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{validation.overall_score}</p>
            <p className="text-xs text-slate-300">out of 10</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-white/10">
          {verdict.meaning}
        </p>
      </div>

      <div className="card-secondary p-4 md:p-5">
        <h3 className="text-sm font-bold text-white mb-4">What it scored</h3>
        <div className="space-y-4">
          {(validation.scores || []).map((s) => (
            <div key={s.key}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-white">{s.label}</p>
                <p className="text-sm font-bold text-slate-200 flex-shrink-0">{s.score}/10</p>
              </div>
              <div className="h-1.5 rounded-full bg-slate-700 mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${verdict.bar}`}
                  style={{ width: `${s.score * 10}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">{s.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="What the research proves" icon={Check} tone="text-emerald-400">
          <ul className="space-y-2">
            {(validation.proven || []).map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-emerald-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="What you're assuming" icon={HelpCircle} tone="text-amber-400">
          <ul className="space-y-2">
            {(validation.assumed || []).map((item, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-amber-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="What would kill it" icon={AlertTriangle} tone="text-rose-400">
        <ul className="space-y-3">
          {(validation.fatal_risks || []).map((r, i) => (
            <li key={i}>
              <p className="text-sm font-semibold text-white">{r.risk}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.why}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Test this before you build" icon={FlaskConical} tone="text-blue-400">
        <div className="space-y-3">
          {(validation.tests || []).map((t, i) => (
            <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3">
              <p className="text-sm font-semibold text-white">
                {i + 1}. {t.test}
              </p>
              <p className="text-xs text-slate-300 mt-1">{t.how}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <p className="text-xs text-emerald-400">Success looks like: {t.success_signal}</p>
                <p className="text-xs text-slate-500">Effort: {t.effort}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How to sell it" icon={Wallet} tone="text-purple-400">
        <dl className="grid sm:grid-cols-3 gap-3">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">Buyer</dt>
            <dd className="text-xs text-slate-200 mt-1">{sell.buyer || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">Price</dt>
            <dd className="text-xs text-slate-200 mt-1">{sell.price || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">First channel</dt>
            <dd className="text-xs text-slate-200 mt-1">{sell.first_channel || "—"}</dd>
          </div>
        </dl>
      </Section>

      <div className="card-secondary p-4 md:p-5">
        <h3 className="text-sm font-bold text-white mb-2">Recommendation</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{validation.recommendation}</p>
        <p className="text-[11px] text-slate-500 mt-3">
          {validation.concept_name}
          {validation.generated_at
            ? ` · ${format(new Date(validation.generated_at), "d MMM yyyy, h:mm a")}`
            : ""}
        </p>
      </div>
    </div>
  );
}