import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Our AI engine analyzes your resume across six critical dimensions to
            give you actionable insights in seconds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📄",
                title: "Upload Your Resume",
                description:
                  "Drag and drop your PDF or paste your resume text. We support all common formats.",
              },
              {
                step: "02",
                icon: "🔍",
                title: "AI Analysis",
                description:
                  "Our engine scans for 200+ keywords, action verbs, metrics, and formatting patterns.",
              },
              {
                step: "03",
                icon: "📊",
                title: "Get Your Score",
                description:
                  "Receive a detailed breakdown with scores, grades, and actionable improvement tips.",
              },
            ].map((feature, index) => (
              <div
                key={feature.step}
                className="glass rounded-2xl p-8 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s`, opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded-full">
                    STEP {feature.step}
                  </span>
                </div>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dimensions Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">6 Scoring Dimensions</span>
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
            Every resume is evaluated across these critical areas that
            recruiters and ATS systems look for.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📧",
                name: "Contact Info",
                desc: "Email, phone, LinkedIn, GitHub, and portfolio links",
                color: "from-violet-500 to-purple-500",
              },
              {
                icon: "💼",
                name: "Experience",
                desc: "Action verbs, job titles, date ranges, and bullet structure",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: "⚡",
                name: "Skills",
                desc: "Technical and soft skills matched against industry standards",
                color: "from-emerald-400 to-teal-500",
              },
              {
                icon: "🎓",
                name: "Education",
                desc: "Degrees, certifications, GPA, and relevant coursework",
                color: "from-amber-400 to-orange-500",
              },
              {
                icon: "📐",
                name: "Formatting",
                desc: "Length, section structure, readability, and consistency",
                color: "from-rose-400 to-pink-500",
              },
              {
                icon: "🎯",
                name: "Impact",
                desc: "Quantified achievements, metrics, and measurable outcomes",
                color: "from-indigo-400 to-violet-500",
              },
            ].map((dim, index) => (
              <div
                key={dim.name}
                className="glass rounded-xl p-6 card-hover group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dim.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {dim.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {dim.name}
                </h3>
                <p className="text-sm text-slate-400">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Improve Your Resume?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of job seekers who have improved their resumes with
              ResumeScore. It&apos;s free and takes less than 30 seconds.
            </p>
            <a href="/analyze" className="btn-primary inline-block text-lg px-8 py-4">
              Analyze Your Resume Now →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
