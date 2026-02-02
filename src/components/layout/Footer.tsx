import { Shield, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-bold text-lg">FraudGuard AI</span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              AI-Based Fraud and Anomaly Detection System for secure transaction analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Fraud Prediction
                </Link>
              </li>
              <li>
                <Link to="/explainability" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Explainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  About Project
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>© 2024 FraudGuard AI - Final Year Engineering Project</p>
          <p className="mt-1">Built with React, FastAPI, and Machine Learning</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
