import {
  ArrowLeft,
  ArrowRight,
  Award,
  Clock3,
  GraduationCap,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import { siteData } from "../data/siteData";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const highlights = [
  {
    icon: GraduationCap,
    label: "Qualification",
    value: siteData.doctor.qualification,
    detail: siteData.doctor.institute,
    tint: "bg-[#e8f4f2] text-[#0f6668]",
  },
  {
    icon: Clock3,
    label: "Experience",
    value: siteData.doctor.experience,
    detail: "of professional dental practice",
    tint: "bg-[#f4eddf] text-[#9b7932]",
  },
  {
    icon: Stethoscope,
    label: "Specialization",
    value: siteData.doctor.specialization,
    detail: "General dentistry & smile care",
    tint: "bg-[#effaf4] text-[#21643e]",
  },
];

export default function DoctorProfilePage() {
  return (
    <div className="min-h-screen bg-[#f4faf9] text-[#173235]">

      {/* ========================= TOP BAR ========================= */}

      <header className="sticky top-0 z-50 border-b border-[#e4edec] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Shree Shyam Dental Care"
              className="h-11 w-auto object-contain sm:h-12"
            />
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#cddfdd] bg-white px-3 py-2.5 text-xs font-bold text-[#315657] transition hover:border-[#0f6668] hover:text-[#0f6668] sm:px-4 sm:text-sm"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back to Home</span>
            </a>

            <a
              href="/#appointment"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f6668] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(15,102,104,0.2)] transition hover:bg-[#0b5557] sm:px-5 sm:text-sm"
            >
              Book Appointment
              <ArrowRight size={15} />
            </a>
          </div>

        </div>
      </header>

      {/* ========================= HERO ========================= */}

      <section className="mx-auto max-w-6xl px-4 pb-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">

          <div className="relative mx-auto w-full max-w-md">

            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#d9ece9] opacity-70 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white bg-white p-3 shadow-[0_30px_70px_rgba(20,70,70,0.14)]">

              <div className="h-[380px] overflow-hidden rounded-[1.5rem] sm:h-[440px]">

                <img
                  src="/dr.mayankpareek-qualification.jpeg"
                  alt="Dr. Mayank Pareek - BDS Dental Surgeon at his clinic"
                  className="h-full w-full object-cover object-[center_35%]"
                />

              </div>

            </div>

          </div>

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4e7e4] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f6668]">

              <Award size={13} />
              Qualification &amp; Experience

            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              {siteData.doctor.name}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-3 text-base font-semibold text-[#0f6668] sm:text-lg">
              {siteData.doctor.qualification} &bull; {siteData.doctor.designation}

              {siteData.doctor.instagram && (
                <a
                  href={siteData.doctor.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dr. Mayank Pareek on Instagram"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d4e7e4] bg-white text-[#0f6668] shadow-sm transition hover:border-[#0f6668] hover:bg-[#0f6668] hover:text-white"
                >
                  <InstagramIcon size={15} />
                </a>
              )}
            </p>

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#698081] sm:text-base sm:leading-8">
              {siteData.doctor.about}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              {highlights.map((item) => (

                <div
                  key={item.label}
                  className="rounded-2xl border border-[#dfeceb] bg-white p-5 shadow-[0_8px_25px_rgba(20,70,70,0.05)]"
                >

                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tint}`}>
                    <item.icon size={19} />
                  </div>

                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[#8a9b9c]">
                    {item.label}
                  </p>

                  <p className="mt-1 text-lg font-bold text-[#294d4e]">
                    {item.value}
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-[#839697]">
                    {item.detail}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ========================= OUR TEAM ========================= */}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4e7e4] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f6668] shadow-sm">

            <Stethoscope size={13} />

            Our Team

          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
            Meet our dental team.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#698081] sm:text-base">
            Specialist doctors working together to provide complete dental care at Shree Shyam Dental Care.
          </p>

        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">

          {siteData.team.map((member) => (

            <div
              key={member.name}
              className="rounded-[1.75rem] border border-[#e0ecea] bg-white p-5 shadow-[0_15px_45px_rgba(20,70,70,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(20,70,70,0.12)] sm:p-6"
            >

              <div className="h-72 overflow-hidden rounded-[1.25rem] sm:h-80">

                <img
                  src={member.image}
                  alt={`${member.name} at Shree Shyam Dental Care`}
                  className="h-full w-full object-cover object-[center_25%]"
                />

              </div>

              <div className="mt-5 flex items-start justify-between gap-3">

                <div>

                  <h3 className="text-xl font-bold tracking-tight text-[#173235]">
                    {member.name}
                  </h3>

                  <p className="mt-1.5 text-sm font-semibold text-[#0f6668]">
                    {member.qualification}
                  </p>

                </div>

                {member.instagram && (

                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on Instagram`}
                    className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4e7e4] bg-white text-[#0f6668] shadow-sm transition hover:border-[#0f6668] hover:bg-[#0f6668] hover:text-white"
                  >
                    <InstagramIcon size={16} />
                  </a>

                )}

              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f4f2] px-3 py-1.5 text-xs font-bold text-[#0f6668]">

                  <Stethoscope size={13} />
                  {member.specialization}

                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4eddf] px-3 py-1.5 text-xs font-bold text-[#9b7932]">

                  <Clock3 size={13} />
                  Exp. {member.experience}

                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f4f4] px-3 py-1.5 text-xs font-bold text-[#4e6869]">

                  <MapPin size={13} />
                  {member.location}

                </span>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ========================= CTA ========================= */}

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">

        <div className="rounded-[1.75rem] bg-[#0f6668] px-7 py-10 text-center shadow-[0_25px_60px_rgba(15,102,104,0.25)] sm:px-12">

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Book your visit with Dr. Mayank Pareek
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#cfe9e7]">
            Personalized dental care at Shree Shyam Dental Care, Moti Bavji Choraha, Bhilwara.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <a
              href="/#appointment"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0f6668] transition hover:-translate-y-0.5"
            >
              Book an Appointment
              <ArrowRight size={16} />
            </a>

            <a
              href={`tel:${siteData.clinic.phone}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Phone size={16} />
              Call Clinic
            </a>

          </div>

        </div>

      </section>

      {/* ========================= FOOTER ========================= */}

      <footer className="border-t border-[#e4edec] bg-white">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">

          <p className="text-xs font-semibold text-[#718687]">
            {siteData.clinic.name} &bull; Dr. Mayank Pareek, {siteData.doctor.qualification}
          </p>

          <p className="flex items-center gap-1.5 text-xs text-[#839697]">
            <MapPin size={13} className="text-[#0f6668]" />
            {siteData.clinic.address}
          </p>

        </div>

      </footer>

    </div>
  );
}
