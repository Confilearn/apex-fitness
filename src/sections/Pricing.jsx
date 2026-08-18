import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { lift, reveal } from '../lib/motion';
import { plans } from '../data/content';
import { Label } from '../components/Label';
import { CheckIcon, TrophyIcon } from '../components/icons';

/*
  Hover was React state on both cards. It is border colour, a 6px lift and a
  shadow — all of which CSS does without a render.
*/
const PlanCard = ({ plan, delay, vis }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`group relative rounded-card border backdrop-blur-md px-6 py-7 md:p-11
        transition-[border-color,transform,box-shadow] duration-280 ease-css
        hover:-translate-y-1.5 hover:border-[rgba(255,255,255,.16)] hover:shadow-[0_24px_64px_rgba(0,0,0,.6)]
        ${plan.badge ? 'border-[rgba(255,255,255,.16)] bg-[rgba(255,255,255,0.05)]' : 'border-[rgba(255,255,255,.07)] bg-[rgba(255,255,255,0.02)]'}`}
      style={{ opacity: vis ? 1 : 0, transitionDelay: `${delay}ms` }}
    >
      {plan.badge && (
        <div className="absolute top-5 right-5 flex items-center gap-[5px] rounded-full border border-[rgba(255,75,75,.35)] bg-[rgba(214,40,40,.12)] px-3 py-[5px] text-[9px] font-semibold tracking-[.2em] text-accent-hi uppercase">
          <TrophyIcon />
          Most Effective
        </div>
      )}
      <h3 className="mb-2 font-body text-[22px] font-bold tracking-[-0.01em] text-text">
        {plan.name} Training
      </h3>
      <div className="mb-5 flex items-baseline gap-1">
        <span className="font-display text-[72px] leading-none tracking-[.02em] text-text">{plan.price}</span>
        <span className="text-sm font-light text-muted">{plan.mo}</span>
      </div>
      <p className="mb-7 text-sm leading-[1.65] font-light text-muted">{plan.desc}</p>
      <ul className="mb-9 flex list-none flex-col gap-3 p-0">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <CheckIcon />
            <span className="text-[13px] font-normal text-text">{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        {...lift(1.03, plan.badge ? '0 0 28px rgba(214,40,40,.38)' : 'none')}
        onClick={() => navigate('/get-started')}
        aria-label={`Get started with ${plan.name} training at ${plan.price} per month`}
        className={`w-full cursor-pointer rounded-[10px] p-[15px] text-xs font-bold tracking-[.16em] uppercase transition-[transform,box-shadow] duration-200 ease-css
          ${plan.badge ? 'border-none bg-accent text-on-accent' : 'border border-[rgba(255,255,255,.12)] bg-transparent text-text'}`}
      >
        Get Started
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   8. PRICING
   Job: make the decision easy. Two options, no confusion.
   The recommended card sits in a soft accent bloom.
   ════════════════════════════════════════════════════════════ */
export const Pricing = () => {
  const [ref, vis] = useInView(0.1);

  return (
    <section id="pricing" ref={ref} className="bg-bg py-20 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6 md:px-14">
        <Label vis={vis}>Investment</Label>
        <h2
          style={reveal(vis, 80)}
          className="mb-10 font-body text-[clamp(36px,5vw,64px)] leading-[0.98] font-extrabold tracking-[-0.035em] text-text"
        >
          Choose Your Path
        </h2>
        <div className="grid max-w-full grid-cols-1 items-start gap-3.5 md:max-w-[880px] md:grid-cols-2">
          {plans.map((plan, i) =>
            plan.badge ? (
              <div key={plan.name} className="relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-10 z-0 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(214,40,40,0.13)_0%,transparent_70%)]"
                />
                <div className="relative z-1">
                  <PlanCard plan={plan} delay={i * 100} vis={vis} />
                </div>
              </div>
            ) : (
              <PlanCard key={plan.name} plan={plan} delay={i * 100} vis={vis} />
            )
          )}
        </div>
      </div>
    </section>
  );
};
