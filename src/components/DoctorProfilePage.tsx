import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  Clock3,
  GraduationCap,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import { siteData } from "../data/siteData";

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

const experiencePoints = [
  "6+ years of hands-on clinical dental experience",
  "BDS from Geetanjali Dental and Research Institute, Udaipur",
  "Patient-focused consultation with clear treatment guidance",
  "Comfortable, hygienic, and welcoming care environment",
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

            <p className="mt-3 text-base font-semibold text-[#0f6668] sm:text-lg">
              {siteData.doctor.qualification} &bull; {siteData.doctor.designation}
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

      {/* ========================= EXPERIENCE DETAILS ========================= */}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-[1.75rem] border border-[#e0ecea] bg-white p-7 shadow-[0_15px_45px_rgba(20,70,70,0.06)] sm:p-9">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f4f2] text-[#0f6668]">
              <GraduationCap size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
              Qualification
            </h2>

            <p className="mt-4 text-base font-bold text-[#0f6668]">
              {siteData.doctor.qualification}
            </p>

            <p className="mt-1.5 text-sm leading-7 text-[#698081]">
              {siteData.doctor.institute}
            </p>

            <div className="mt-6 space-y-3">

              {[
                "Bachelor of Dental Surgery (BDS)",
                "Recognized dental education & clinical training",
                "Committed to continued learning in modern dentistry",
              ].map((point) => (

                <div key={point} className="flex items-start gap-2.5">

                  <Check size={16} className="mt-0.5 shrink-0 text-[#0f6668]" />

                  <p className="text-sm leading-6 text-[#4e6869]">{point}</p>

                </div>

              ))}

            </div>

          </div>

          <div className="rounded-[1.75rem] border border-[#e0ecea] bg-white p-7 shadow-[0_15px_45px_rgba(20,70,70,0.06)] sm:p-9">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4eddf] text-[#9b7932]">
              <Clock3 size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-[1.7rem]">
              Experience
            </h2>

            <p className="mt-4 text-base font-bold text-[#9b7932]">
              {siteData.doctor.experience} of professional practice
            </p>

            <div className="mt-6 space-y-3">

              {experiencePoints.map((point) => (

                <div key={point} className="flex items-start gap-2.5">

                  <Check size={16} className="mt-0.5 shrink-0 text-[#9b7932]" />

                  <p className="text-sm leading-6 text-[#4e6869]">{point}</p>

                </div>

              ))}

            </div>

          </div>

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
