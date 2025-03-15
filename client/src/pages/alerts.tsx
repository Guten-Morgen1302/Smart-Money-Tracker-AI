import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Alert = {
  id: number;
  title: string;
  condition: string;
  active: boolean;
  createdAt: string;
};

export default function Alerts() {
  // Add circuit pattern background effect
  useEffect(() => {
    const circuitPattern = document.createElement('div');
    circuitPattern.className = 'circuit-pattern';
    document.body.appendChild(circuitPattern);
    
    return () => {
      document.body.removeChild(circuitPattern);
    };
  }, []);
  
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    condition: "",
    active: true,
    thresholdAmount: "",
    thresholdCurrency: "BTC",
    walletAddress: "",
    alertType: "transaction"
  });
  
  // Fetch alerts
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    staleTime: 60000 // Refresh every minute
  });
  
  // Sample alerts for initial rendering if API hasn't loaded yet
  const sampleAlerts: Alert[] = [
    {
      id: 1,
      title: "Large BTC Transfers",
      condition: "Transaction amount > 100 BTC",
      active: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: "Whale Wallet Activity",
      condition: "Wallet 0x7a25...1fe2 transactions",
      active: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: "Exchange Outflows",
      condition: "ETH exchange outflows > 5000 ETH",
      active: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  const handleCreateAlert = async () => {
    try {
      let condition = "";
      
      if (newAlert.alertType === "transaction") {
        condition = `Transaction amount > ${newAlert.thresholdAmount} ${newAlert.thresholdCurrency}`;
      } else if (newAlert.alertType === "wallet") {
        condition = `Wallet ${newAlert.walletAddress} transactions`;
      }
      
      const alertData = {
        title: newAlert.title,
        condition,
        active: newAlert.active
      };
      
      await apiRequest("POST", "/api/alerts", alertData);
      
      // Reset form and close dialog
      setNewAlert({
        title: "",
        condition: "",
        active: true,
        thresholdAmount: "",
        thresholdCurrency: "BTC",
        walletAddress: "",
        alertType: "transaction"
      });
      setCreateDialogOpen(false);
      
      // Invalidate cache to refresh alerts
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      
      toast({
        title: "Alert created",
        description: "Your alert has been created successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const toggleAlertStatus = async (id: number, currentStatus: boolean) => {
    try {
      await apiRequest("PATCH", `/api/alerts/${id}`, {
        active: !currentStatus
      });
      
      // Invalidate cache to refresh alerts
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      
      toast({
        title: "Alert updated",
        description: `Alert has been ${!currentStatus ? 'activated' : 'deactivated'}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const deleteAlert = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/alerts/${id}`, undefined);
      
      // Invalidate cache to refresh alerts
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      
      toast({
        title: "Alert deleted",
        description: "Your alert has been deleted successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="font-inter text-white bg-background min-h-screen">
      <Sidebar />
      <Header title="Custom" highlight="Alerts" />
      
      <main className="pl-16 lg:pl-64 pt-16">
        <div className="container mx-auto p-6 space-y-6 pb-20">
          {/* Alert Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#191A2A] border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-400 text-sm">Active Alerts</h3>
                    <p className="mt-1 text-2xl font-orbitron font-bold">
                      {isLoading 
                        ? "..." 
                        : alerts 
                          ? alerts.filter((alert: Alert) => alert.active).length 
                          : sampleAlerts.filter(alert => alert.active).length}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Monitoring 24/7</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-400/20 flex items-center justify-center">
                    <i className="ri-alarm-warning-line text-xl text-cyan-400"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#191A2A] border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-400 text-sm">Triggered Today</h3>
                    <p className="mt-1 text-2xl font-orbitron font-bold">3</p>
                    <p className="mt-1 text-xs text-gray-400">+1 from yesterday</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <i className="ri-notification-3-line text-xl text-purple-500"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#191A2A] border-green-400/20 hover:border-green-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-400 text-sm">Notification Methods</h3>
                    <p className="mt-1 text-2xl font-orbitron font-bold">2</p>
                    <p className="mt-1 text-xs text-gray-400">Email, Browser</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                    <i className="ri-mail-send-line text-xl text-green-400"></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Alerts Management */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
              <h3 className="font-orbitron text-lg">My Alerts</h3>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Alert
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#191A2A] border border-cyan-400/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Alert</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Set up custom alerts for specific blockchain activities
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Alert Name</Label>
                      <Input 
                        id="title" 
                        value={newAlert.title} 
                        onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                        placeholder="E.g., Large BTC Transfers" 
                        className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Alert Type</Label>
                      <Select 
                        value={newAlert.alertType} 
                        onValueChange={(value) => setNewAlert({...newAlert, alertType: value})}
                      >
                        <SelectTrigger className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80">
                          <SelectValue placeholder="Select alert type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#191A2A] border border-cyan-400/20 text-white">
                          <SelectItem value="transaction">Transaction Amount</SelectItem>
                          <SelectItem value="wallet">Wallet Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newAlert.alertType === "transaction" ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="thresholdAmount">Threshold Amount</Label>
                          <Input 
                            id="thresholdAmount" 
                            value={newAlert.thresholdAmount} 
                            onChange={(e) => setNewAlert({...newAlert, thresholdAmount: e.target.value})}
                            placeholder="100" 
                            className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="thresholdCurrency">Currency</Label>
                          <Select 
                            value={newAlert.thresholdCurrency} 
                            onValueChange={(value) => setNewAlert({...newAlert, thresholdCurrency: value})}
                          >
                            <SelectTrigger className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#191A2A] border border-cyan-400/20 text-white">
                              <SelectItem value="BTC">BTC</SelectItem>
                              <SelectItem value="ETH">ETH</SelectItem>
                              <SelectItem value="SOL">SOL</SelectItem>
                              <SelectItem value="USDC">USDC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="walletAddress">Wallet Address</Label>
                        <Input 
                          id="walletAddress" 
                          value={newAlert.walletAddress} 
                          onChange={(e) => setNewAlert({...newAlert, walletAddress: e.target.value})}
                          placeholder="0x..." 
                          className="bg-[#0A0A10]/70 border-cyan-400/30 focus:border-cyan-400/80"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="active" 
                        checked={newAlert.active} 
                        onCheckedChange={(checked) => setNewAlert({...newAlert, active: checked})}
                      />
                      <Label htmlFor="active">Enable Alert</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-cyan-400/30 text-white hover:bg-white/5">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAlert} className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                      Create Alert
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-12 h-12 border-2 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-400">Loading your alerts...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Condition</TableHead>
                      <TableHead className="text-gray-400">Created</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(alerts || sampleAlerts).map((alert: Alert) => (
                      <TableRow key={alert.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-medium">{alert.title}</TableCell>
                        <TableCell className="text-sm text-gray-300">{alert.condition}</TableCell>
                        <TableCell className="text-sm text-gray-400">{formatDate(alert.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch 
                              checked={alert.active} 
                              onCheckedChange={() => toggleAlertStatus(alert.id, alert.active)}
                              className="data-[state=checked]:bg-cyan-400"
                            />
                            <span className="ml-2 text-sm">
                              {alert.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-400 hover:bg-white/5">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-400 hover:text-pink-500 hover:bg-white/5"
                              onClick={() => deleteAlert(alert.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {(alerts && alerts.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <AlertCircle className="h-8 w-8 mb-2" />
                            <p>No alerts found</p>
                            <p className="text-sm">Create your first alert to get started</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* Alert History */}
          <Card className="bg-[#191A2A] border-white/10">
            <CardHeader className="p-4 border-b border-white/5">
              <h3 className="font-orbitron text-lg">Recent Alert Triggers</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative border-l-2 border-white/10 ml-4 space-y-6 py-2">
                {/* Timeline items */}
                <div className="relative">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-pink-500 border-4 border-[#191A2A]"></div>
                  <div className="ml-6">
                    <div className="bg-[#0A0A10]/70 p-4 rounded-lg border border-pink-500/20">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-pink-500">Large BTC Transfer Alert</h4>
                        <span className="ml-auto text-xs text-gray-400">Today, 13:45</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">
                        Transaction of 245 BTC detected between wallet 0x7a25...1fe2 and 0x9b32...8ad1
                      </p>
                      <div className="mt-2 flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs h-7 border-pink-500/30 text-pink-500 hover:bg-pink-500/10">
                          View Transaction
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-gray-400 hover:text-white hover:bg-white/5">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-cyan-400 border-4 border-[#191A2A]"></div>
                  <div className="ml-6">
                    <div className="bg-[#0A0A10]/70 p-4 rounded-lg border border-cyan-400/20">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-cyan-400">Whale Wallet Activity</h4>
                        <span className="ml-auto text-xs text-gray-400">Today, 09:12</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">
                        Monitored wallet 0x7a25...1fe2 has started accumulating BTC after 3 weeks of inactivity
                      </p>
                      <div className="mt-2 flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs h-7 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                          View Wallet
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-gray-400 hover:text-white hover:bg-white/5">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[9px] w-4 h-4 rounded-full bg-purple-500 border-4 border-[#191A2A]"></div>
                  <div className="ml-6">
                    <div className="bg-[#0A0A10]/70 p-4 rounded-lg border border-purple-500/20">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-purple-500">ETH Exchange Outflows</h4>
                        <span className="ml-auto text-xs text-gray-400">Yesterday, 21:30</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">
                        Large ETH outflows of over 12,450 ETH detected from major exchanges
                      </p>
                      <div className="mt-2 flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs h-7 border-purple-500/30 text-purple-500 hover:bg-purple-500/10">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 text-gray-400 hover:text-white hover:bg-white/5">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
