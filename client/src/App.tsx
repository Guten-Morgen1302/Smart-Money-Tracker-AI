
import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Pages
import Dashboard from "@/pages/dashboard";
import WhaleTracker from "@/pages/whale-tracker";
import AITrends from "@/pages/ai-trends";
import WalletInsights from "@/pages/wallet-insights";
import Alerts from "@/pages/alerts";
import AIAssistant from "@/pages/ai-assistant";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/whale-tracker" component={WhaleTracker} />
      <Route path="/ai-trends" component={AITrends} />
      <Route path="/wallet-insights" component={WalletInsights} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/login" component={Login} />
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router base="">
          <AppRoutes />
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
