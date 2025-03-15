import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await apiRequest("POST", "/api/auth/login", loginData);
      
      toast({
        title: "Login Successful",
        description: "Welcome to Smart Money Tracker AI",
        variant: "default"
      });
      
      // Redirect to dashboard
      setLocation('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await apiRequest("POST", "/api/auth/register", {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      });
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
        variant: "default"
      });
      
      // Switch to login tab
      setAuthType('login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Username may already be taken or there was a server error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="font-inter text-white bg-background min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="circuit-pattern"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D0E19]/90 pointer-events-none"></div>
      
      {/* Logo */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center glow-border animate-glow">
            <span className="font-orbitron font-bold text-white text-3xl">SM</span>
          </div>
          <h1 className="font-orbitron font-bold text-3xl ml-4 cybr-text-gradient">SmartMoney AI</h1>
        </div>
        <p className="text-center mt-2 text-gray-400">Advanced whale transaction tracking for crypto traders</p>
      </div>
      
      {/* Auth Card */}
      <Card className="w-full max-w-md bg-[#191A2A] border-white/10 relative z-10">
        <Tabs defaultValue={authType} onValueChange={(value) => setAuthType(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 bg-[#0A0A10]">
            <TabsTrigger value="login" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-500">
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="font-orbitron">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Enter your username" 
                    className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-cyan-400 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white" 
                  disabled={loading}
                >
                  {loading ? 
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </div> : 
                    "Sign In"
                  }
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="font-orbitron">Create Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Register to start tracking whale transactions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username">Username</Label>
                  <Input 
                    id="new-username" 
                    type="text" 
                    placeholder="Choose a username" 
                    className="bg-[#0A0A10]/70 border-purple-500/30 focus:border-purple-500/80"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-[#0A0A10]/70 border-purple-500/30 focus:border-purple-500/80"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Create a password" 
                    className="bg-[#0A0A10]/70 border-purple-500/30 focus:border-purple-500/80"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm your password" 
                    className="bg-[#0A0A10]/70 border-purple-500/30 focus:border-purple-500/80"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <a href="#" className="text-purple-500 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-500 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  disabled={loading}
                >
                  {loading ? 
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div> : 
                    "Create Account"
                  }
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Cyberpunk Decoration Elements */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/20 to-purple-500/0 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-tr from-purple-500/20 to-cyan-400/0 rounded-full blur-[80px]"></div>
      
      <div className="mt-8 text-center text-gray-500 text-sm relative z-10">
        <p>© 2023 Smart Money Tracker AI. All rights reserved.</p>
      </div>
    </div>
  );
}
