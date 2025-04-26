"use client";

export function ProblemSolution() {
  return (
    <>
      {/* Micro-Agent Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl uppercase">
              The Micro-Agent That Fits Your Workflow
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">
              Agent Email isn't another bloated platform you need to learn.<br />
              It's a specialized AI agent with one mission: <strong>Turn email addresses into personalized welcome emails.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">🔌</span>
              </div>
              <p><strong>Seamlessly plugs into your existing systems</strong></p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">⚙️</span>
              </div>
              <p><strong>No disruption to your current processes</strong></p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">🚀</span>
              </div>
              <p><strong>Deploy in minutes, not days</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Dilemma Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl uppercase">
              The Welcome Email Dilemma
            </h2>
            <p className="text-muted-foreground md:text-lg">
              See how Agent Email transforms common welcome email challenges into opportunities
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {/* Problems Column */}
            <div className="md:col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-muted p-4 flex items-center space-x-2 border-b">
                <span className="text-destructive text-xl">⚠️</span>
                <h3 className="font-bold">Common Challenges</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p>Generic welcome emails get ignored</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p>Manual research takes too much time</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p>New signups drift away without engagement</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p>Too early to invest resources in manual follow-up</p>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="h-1/3 w-px bg-border"></div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center my-4">
                <span className="text-primary-foreground">→</span>
              </div>
              <div className="h-1/3 w-px bg-border"></div>
            </div>
            
            {/* Solutions Column */}
            <div className="md:col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-muted p-4 flex items-center space-x-2 border-b">
                <span className="text-primary text-xl">✓</span>
                <h3 className="font-bold">Agent Email Solutions</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p>Messages that feel hand-crafted and personal</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p>Instant website analysis and personalization</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p>Capture attention when interest is highest</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p>Automated personalization at scale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl uppercase">
              How Agent Email Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Collect & Investigate</h3>
              <p className="text-muted-foreground">
                Receives an email address from your signup form or CRM and automatically researches their business website
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Analyze & Craft</h3>
              <p className="text-muted-foreground">
                Uses AI to understand their business needs and creates a personalized welcome email that speaks directly to their challenges
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Deliver & Convert</h3>
              <p className="text-muted-foreground">
                Provides ready-to-send email copy through your existing platform, turning cold signups into engaged prospects
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
