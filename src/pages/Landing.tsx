import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Activity,
  Brain,
  Zap,
  Lock,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Monitor transactions as they happen with instant fraud detection and alerts.",
  },
  {
    icon: Brain,
    title: "Machine Learning Detection",
    description: "Advanced ML models trained on millions of transactions for accurate fraud detection.",
  },
  {
    icon: Zap,
    title: "Explainable AI",
    description: "Understand why transactions are flagged with SHAP and LIME explanations.",
  },
  {
    icon: Lock,
    title: "Secure Analysis",
    description: "Enterprise-grade security for sensitive transaction data processing.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards with detailed fraud analysis and trends.",
  },
  {
    icon: Shield,
    title: "Anomaly Detection",
    description: "Detect unusual patterns and potential threats before they escalate.",
  },
];

const stats = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "< 50ms", label: "Response Time" },
  { value: "1M+", label: "Transactions Analyzed" },
  { value: "24/7", label: "Real-Time Monitoring" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-fade-in">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground/90">AI-Powered Fraud Detection System</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Protect Your Transactions with{" "}
              <span className="text-gradient">Intelligent AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Advanced machine learning algorithms detect fraudulent activities in real-time, 
              providing explainable insights and comprehensive transaction analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/dashboard">
                <Button variant="accent" size="xl">
                  View Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="heroOutline" size="xl">
                  Login to System
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Fraud Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system provides end-to-end transaction analysis with 
              state-of-the-art machine learning capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our system processes transactions through multiple stages to ensure accurate fraud detection.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Data Collection",
                  description: "Transaction data is securely collected and preprocessed for analysis.",
                },
                {
                  step: "02",
                  title: "ML Analysis",
                  description: "Advanced algorithms analyze patterns and detect anomalies in real-time.",
                },
                {
                  step: "03",
                  title: "Explainable Results",
                  description: "SHAP/LIME provides clear explanations for each fraud detection decision.",
                },
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Secure Your Transactions?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Start using our AI-powered fraud detection system today and protect your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="accent" size="xl">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="heroOutline" size="xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
