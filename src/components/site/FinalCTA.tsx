import { ReviewForm } from "./ReviewForm";

export const FinalCTA = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="relative overflow-hidden rounded-3xl bg-navy text-white p-8 sm:p-14 lg:p-20">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-30 blur-3xl rounded-full" />
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Start here</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
              Start with a Free Energy Review.
            </h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-md">
              Tell us about your property. We'll model the opportunity, share a
              transparent proposal and outline the long-term plan.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-elegant">
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  </section>
);
