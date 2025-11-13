import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Target, Trophy, Users, Zap, BookOpen, ArrowRight, Lock, Code2, Clock } from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  <span className="gradient-text">Master</span> Ethical Hacking
                </h1>
                <p className="text-xl text-foreground/70 max-w-lg">
                  Practice on real vulnerable machines, earn industry-recognized certifications, and become a cybersecurity expert with Hacking Vault.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8">
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="border-primary/30 text-base h-12 px-8 hover:bg-card hover:border-primary/50">
                  View Machines
                </Button>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <p className="text-sm text-foreground/60">Vulnerable Machines</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">50K+</div>
                  <p className="text-sm text-foreground/60">Active Learners</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">24/7</div>
                  <p className="text-sm text-foreground/60">Platform Access</p>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
              <div className="relative bg-card border border-primary/20 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-mono">
                    <span className="text-primary">$</span>
                    <span className="text-foreground/70">nmap -sV 192.168.1.100</span>
                  </div>
                  <div className="space-y-2 text-sm font-mono text-foreground/50">
                    <div>Starting Nmap 7.92 ( https://nmap.org )</div>
                    <div>Nmap scan report for 192.168.1.100</div>
                    <div>Host is up (0.024s latency)</div>
                    <div className="text-primary">
                      22/tcp open ssh OpenSSH 7.4
                    </div>
                    <div className="text-primary">
                      80/tcp open http Apache httpd 2.4.6
                    </div>
                    <div className="text-primary">
                      443/tcp open https
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse" />
                  <span className="text-xs text-foreground/60">Platform online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Everything</span> You Need
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              A comprehensive platform for mastering cybersecurity and ethical hacking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group card-hover glow-box p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary p-3 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                <Target className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-bold">Realistic Machines</h3>
              <p className="text-foreground/70">
                Practice on real-world vulnerable systems designed by security experts. Learn by breaking things in a safe environment.
              </p>
            </div>

            <div className="group card-hover glow-box p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent p-3 group-hover:shadow-lg group-hover:shadow-secondary/30 transition-all">
                <Trophy className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-bold">Certifications</h3>
              <p className="text-foreground/70">
                Prepare for industry-recognized certifications like CEH, OSCP, and Security+. Guided learning paths for each credential.
              </p>
            </div>

            <div className="group card-hover glow-box p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary p-3 group-hover:shadow-lg group-hover:shadow-accent/30 transition-all">
                <Users className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-foreground/70">
                Join 50,000+ ethical hackers worldwide. Share writeups, get hints, and collaborate with other security professionals.
              </p>
            </div>

            <div className="group card-hover glow-box p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent p-3 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                <BookOpen className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-bold">Learning Resources</h3>
              <p className="text-foreground/70">
                Access comprehensive tutorials, video courses, and documentation. Learn fundamental concepts and advanced techniques.
              </p>
            </div>

            <div className="group card-hover glow-box p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-primary p-3 group-hover:shadow-lg group-hover:shadow-secondary/30 transition-all">
                <Code2 className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-bold">Code Challenges</h3>
              <p className="text-foreground/70">
                Solve real security challenges. Write exploits, craft payloads, and master programming for cybersecurity.
              </p>
            </div>

            <div className="group card-hover glow-box p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-secondary p-3 group-hover:shadow-lg group-hover:shadow-accent/30 transition-all">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-foreground/70">
                Monitor your learning journey with detailed analytics. Track completed machines and measure your improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Machines Section */}
      <section id="machines" className="py-20 md:py-32 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Learn by <span className="gradient-text">Doing</span>
                </h2>
                <p className="text-lg text-foreground/70">
                  Our machines range from beginner-friendly to insanely difficult. Start with fundamentals and progress to advanced exploitation techniques.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Reverse Engineering</h4>
                    <p className="text-sm text-foreground/60">Analyze binaries and understand security mechanisms</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Web Exploitation</h4>
                    <p className="text-sm text-foreground/60">Master SQL injection, XSS, and modern web vulnerabilities</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Privilege Escalation</h4>
                    <p className="text-sm text-foreground/60">Learn techniques to elevate your access on target systems</p>
                  </div>
                </div>
              </div>

              <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8 w-full md:w-auto">
                Explore Machines
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="group card-hover glow-box p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold">Linux Privilege Escalation</h4>
                    <p className="text-sm text-foreground/60 mt-1">Learn to escalate privileges on Linux systems</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">Intermediate</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Users className="w-4 h-4" />
                  <span>1,234 completed</span>
                </div>
              </div>

              <div className="group card-hover glow-box p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold">Web Application Firewall Bypass</h4>
                    <p className="text-sm text-foreground/60 mt-1">Techniques to bypass modern security controls</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold">Advanced</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Users className="w-4 h-4" />
                  <span>789 completed</span>
                </div>
              </div>

              <div className="group card-hover glow-box p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold">Active Directory Enumeration</h4>
                    <p className="text-sm text-foreground/60 mt-1">Master reconnaissance in enterprise environments</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">Beginner</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground/60">
                  <Users className="w-4 h-4" />
                  <span>3,456 completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 md:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Industry-Recognized</span> Certifications
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Prepare for the certifications that employers are looking for
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glow-box border-primary/30 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">CEH (v12)</h3>
              </div>
              <p className="text-foreground/70">
                Certified Ethical Hacker is the industry standard for aspiring security professionals. Covers reconnaissance, scanning, enumeration, and exploitation.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Complete exam preparation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>50+ practice machines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Video tutorials & notes</span>
                </li>
              </ul>
              <Button className="w-full button-glow bg-primary text-background hover:bg-primary/90">
                View Path
              </Button>
            </div>

            <div className="glow-box border-secondary/30 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">OSCP</h3>
              </div>
              <p className="text-foreground/70">
                Offensive Security Certified Professional is one of the most respected credentials in cybersecurity. Hands-on penetration testing.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Advanced exploitation labs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Real-world scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Report writing guide</span>
                </li>
              </ul>
              <Button className="w-full button-glow bg-secondary text-background hover:bg-secondary/90">
                View Path
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Level Up Your <span className="gradient-text">Security Skills?</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Join thousands of ethical hackers learning on Hacking Vault today. Start with free machines and unlock premium content.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="button-glow bg-primary text-background hover:bg-primary/90 text-base h-12 px-8">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-primary/30 text-base h-12 px-8 hover:bg-card hover:border-primary/50">
              View All Machines
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-border/50">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Free Tier</span>
              </div>
              <p className="text-sm text-foreground/60">Access 50+ beginner machines</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold">Lifetime Access</span>
              </div>
              <p className="text-sm text-foreground/60">Keep your progress and certifications forever</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold">Community Support</span>
              </div>
              <p className="text-sm text-foreground/60">Learn from 50,000+ hackers worldwide</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
