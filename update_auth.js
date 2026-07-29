const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src', 'app', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add imports
content = content.replace(
  'import { create } from "zustand";',
  'import { create } from "zustand";\nimport api from "../lib/api";\nimport { useAuthStore } from "../store/authStore";'
);

// 2. Replace LoginView
const loginViewRegex = /function LoginView\(\) \{[\s\S]*?(?=\/\/ 5\.3 REGISTER VIEW|function RegisterView)/;
const newLoginView = `function LoginView() {
  const store = useAppStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data.user, data.token);
      store.pushNotification("Access Approved", "Welcome to the dashboard console.", "success");
      store.navigate("dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      store.pushNotification("Access Denied", err.response?.data?.error || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-gray-900 text-md mb-6">
            <Zap size={18} className="text-[#f97316] fill-[#f97316]" />
            <span>Set2Send AI</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Log in to Set2Send</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Telemetry qualifications console</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl">
          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="you@domain.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Password</label>
              <button type="button" onClick={() => store.navigate("forgot-password")} className="text-[9px] text-indigo-600 font-semibold">Forgot?</button>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50">
            <Lock size={12} />
            <span>{loading ? "Authenticating..." : "Login to Console"}</span>
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-6">
          New creator? <button onClick={() => store.navigate("register")} className="text-indigo-600 font-semibold hover:underline">Create account</button>
        </p>
      </div>
    </div>
  );
}

`;
content = content.replace(loginViewRegex, newLoginView);

// 3. Replace RegisterView
const registerViewRegex = /function RegisterView\(\) \{[\s\S]*?(?=\/\/ 5\.4 FORGOT PASSWORD|function ForgotPasswordView)/;
const newRegisterView = `function RegisterView() {
  const store = useAppStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setAuth(data.user, data.token);
      store.pushNotification("Account Configured", "Your workspace setup is completed.", "success");
      store.addLog("Deployed Set2Send account", "success");
      store.navigate("dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
      store.pushNotification("Registration Failed", err.response?.data?.error || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-gray-900 text-md mb-6">
            <Zap size={18} className="text-[#f97316] fill-[#f97316]" />
            <span>Set2Send AI</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Create your account</h2>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Start converting comment triggers immediately</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl">
          {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded border border-red-100">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Workspace Creator Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="e.g. John Doe" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="you@domain.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="Min 8 characters" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 disabled:opacity-50">
            <User size={12} />
            <span>{loading ? "Deploying..." : "Deploy Workspace"}</span>
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-500 mt-6">
          Already have an account? <button onClick={() => store.navigate("login")} className="text-indigo-600 font-semibold hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
}

`;
content = content.replace(registerViewRegex, newRegisterView);

// 4. Replace ForgotPasswordView
const forgotViewRegex = /function ForgotPasswordView\(\) \{[\s\S]*?(?=\/\/ 5\.5 DASHBOARD HOME VIEW|function DashboardHomeView)/;
const newForgotView = `function ForgotPasswordView() {
  const store = useAppStore();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      store.pushNotification("Link Dispatched", "Check your inbox for reset steps.", "success");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <button onClick={() => store.navigate("landing")} className="flex items-center gap-1.5 font-bold text-gray-900 text-md mb-6">
            <Zap size={18} className="text-[#f97316] fill-[#f97316]" />
            <span>Set2Send AI</span>
          </button>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recover credentials</h2>
        </div>

        {success ? (
          <div className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl text-center">
             <div className="flex justify-center mb-2"><CheckCircle size={32} className="text-green-500" /></div>
             <p className="text-sm text-gray-900 font-semibold">Check your email</p>
             <p className="text-xs text-gray-500">We've sent a password reset link to {email}</p>
             <button onClick={() => store.navigate("login")} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs mt-4">Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleForgot} className="p-6 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500" placeholder="you@domain.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md mt-2 disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center text-[10px] text-gray-500 mt-6">
            Back to <button onClick={() => store.navigate("login")} className="text-indigo-600 font-semibold hover:underline">Login</button>
          </p>
        )}
      </div>
    </div>
  );
}

`;
content = content.replace(forgotViewRegex, newForgotView);

fs.writeFileSync(pagePath, content);
console.log("Successfully updated page.tsx auth forms!");
