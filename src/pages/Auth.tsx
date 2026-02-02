import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, LogIn, UserPlus, User, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "analyst">("analyst");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      setIsLoading(false);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message === "Invalid login credentials" 
            ? "Invalid email or password. Please try again."
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });
        navigate(from, { replace: true });
      }
    } else {
      const { error } = await signUp(email, password, fullName, role);
      setIsLoading(false);

      if (error) {
        const errorMessage = error.message.includes("already registered")
          ? "This email is already registered. Please sign in instead."
          : error.message;
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Welcome to FraudGuard AI. You can now access the dashboard.",
        });
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg gradient-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">FraudGuard AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access the fraud detection dashboard"
                : "Sign up to get started with fraud detection"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("analyst")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === "analyst"
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <User className={`h-6 w-6 mx-auto mb-2 ${role === "analyst" ? "text-accent" : "text-muted-foreground"}`} />
                  <p className={`font-medium ${role === "analyst" ? "text-accent" : "text-foreground"}`}>Analyst</p>
                  <p className="text-xs text-muted-foreground">View & analyze</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === "admin"
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Lock className={`h-6 w-6 mx-auto mb-2 ${role === "admin" ? "text-accent" : "text-muted-foreground"}`} />
                  <p className={`font-medium ${role === "admin" ? "text-accent" : "text-foreground"}`}>Admin</p>
                  <p className="text-xs text-muted-foreground">Full access</p>
                </button>
              </div>
            </div>

            {/* Full Name (Signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                required
                className={`h-12 ${errors.email ? "border-fraud" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-fraud">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  required
                  className={`h-12 pr-12 ${errors.password ? "border-fraud" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-fraud">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  {isLogin ? "Sign In" : "Create Account"}
                </div>
              )}
            </Button>

            {/* Toggle Login/Signup */}
            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-accent hover:underline font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8 animate-float">
            <Shield className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            AI-Powered Fraud Detection
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Protect your transactions with advanced machine learning algorithms 
            and real-time monitoring capabilities.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary-foreground/10">
              <p className="text-2xl font-bold text-accent">99.2%</p>
              <p className="text-sm text-primary-foreground/70">Accuracy</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/10">
              <p className="text-2xl font-bold text-accent">&lt;50ms</p>
              <p className="text-sm text-primary-foreground/70">Response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
