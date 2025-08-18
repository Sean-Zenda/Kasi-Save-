import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Settings, AlertTriangle, TrendingUp, Target, CheckCircle, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { useLanguage } from '../components/LanguageContext';
import { BudgetAlert, BudgetAlertSettings } from '../components/BudgetMonitor';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
  alertSettings: BudgetAlertSettings;
  monthlyBudget: number;
  currentSpending: number;
  onBack: () => void;
  onUpdateSettings: (settings: BudgetAlertSettings) => void;
  onMarkAsRead: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  onClearAllAlerts: () => void;
}

export function BudgetAlerts({
  alerts,
  alertSettings,
  monthlyBudget,
  currentSpending,
  onBack,
  onUpdateSettings,
  onMarkAsRead,
  onDeleteAlert,
  onClearAllAlerts
}: BudgetAlertsProps) {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<BudgetAlertSettings>(alertSettings);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'warning' | 'danger' | 'success'>('all');
  const [showSettings, setShowSettings] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !alert.isRead;
    return alert.type === filterType;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const budgetPercentage = monthlyBudget > 0 ? (currentSpending / monthlyBudget) * 100 : 0;

  const handleSettingChange = (key: keyof BudgetAlertSettings, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings(newSettings);
    
    if (key === 'enableAlerts') {
      toast.success(value ? 'Budget alerts enabled' : 'Budget alerts disabled');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-destructive bg-destructive/5';
      case 'warning': return 'border-amber-500 bg-amber-50 dark:bg-amber-900/10';
      case 'success': return 'border-green-500 bg-green-50 dark:bg-green-900/10';
      case 'info': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/10';
      default: return 'border-border bg-card';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-medium">Budget Alerts</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            {alerts.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClearAllAlerts}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Budget Overview */}
        <div className="px-4 pb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Budget</span>
                <span className="text-sm text-muted-foreground">
                  R{currentSpending.toLocaleString()} / R{monthlyBudget.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    budgetPercentage >= 100 ? 'bg-destructive' : 
                    budgetPercentage >= 80 ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>{budgetPercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            {/* Filter Options */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { key: 'all', label: 'All', count: alerts.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'danger', label: 'Critical', count: alerts.filter(a => a.type === 'danger').length },
                { key: 'warning', label: 'Warning', count: alerts.filter(a => a.type === 'warning').length },
                { key: 'success', label: 'Success', count: alerts.filter(a => a.type === 'success').length }
              ].map(filter => (
                <Button
                  key={filter.key}
                  variant={filterType === filter.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(filter.key as any)}
                  className="shrink-0"
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {filter.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredAlerts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No alerts to show</h3>
                    <p className="text-muted-foreground">
                      {filterType === 'all' 
                        ? "You're doing great with your budget!" 
                        : `No ${filterType} alerts at the moment`}
                    </p>
                  </motion.div>
                ) : (
                  filteredAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`${getAlertColor(alert.type)} ${!alert.isRead ? 'ring-2 ring-primary/20' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              {getAlertIcon(alert.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <p className="text-sm font-medium leading-tight">
                                    {alert.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {alert.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {formatRelativeTime(alert.timestamp)}
                                    </span>
                                  </div>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDeleteAlert(alert.id)}
                                  className="shrink-0 h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>

                              {/* Spending Progress */}
                              {alert.budgetLimit > 0 && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>R{alert.currentSpending.toLocaleString()}</span>
                                    <span>R{alert.budgetLimit.toLocaleString()}</span>
                                  </div>
                                  <div className="w-full bg-secondary rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        alert.type === 'danger' ? 'bg-destructive' : 
                                        alert.type === 'warning' ? 'bg-amber-500' : 'bg-primary'
                                      }`}
                                      style={{ 
                                        width: `${Math.min((alert.currentSpending / alert.budgetLimit) * 100, 100)}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {!alert.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onMarkAsRead(alert.id)}
                                  className="text-xs h-6 px-2 mt-2"
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Alert Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alert Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Enable Budget Alerts</label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about your spending patterns
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAlerts}
                    onCheckedChange={(value) => handleSettingChange('enableAlerts', value)}
                  />
                </div>

                <Separator />

                {/* Threshold Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Warning Threshold: {settings.warningThreshold}%
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get warned when spending reaches this percentage of budget
                    </p>
                    <Slider
                      value={[settings.warningThreshold]}
                      onValueChange={([value]) => handleSettingChange('warningThreshold', value)}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                      disabled={!settings.enableAlerts}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Critical Threshold: {settings.dangerThreshold}%
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get critical alerts when spending reaches this percentage
                    </p>
                    <Slider
                      value={[settings.dangerThreshold]}
                      onValueChange={([value]) => handleSettingChange('dangerThreshold', value)}
                      max={150}
                      min={80}
                      step={5}
                      className="w-full"
                      disabled={!settings.enableAlerts}
                    />
                  </div>
                </div>

                <Separator />

                {/* Alert Types */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Alert Types</h4>
                  
                  {[
                    { key: 'monthlyAlerts', label: 'Monthly Budget Alerts', desc: 'Alerts for monthly spending limits' },
                    { key: 'weeklyAlerts', label: 'Weekly Budget Alerts', desc: 'Track weekly spending patterns' },
                    { key: 'dailyAlerts', label: 'Daily Spending Alerts', desc: 'Monitor daily spending spikes' },
                    { key: 'categoryAlerts', label: 'Category Budget Alerts', desc: 'Alerts for category-specific spending' },
                    { key: 'smartPatternAlerts', label: 'Smart Pattern Detection', desc: 'AI-powered unusual spending detection' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">{label}</label>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch
                        checked={settings[key as keyof BudgetAlertSettings] as boolean}
                        onCheckedChange={(value) => handleSettingChange(key as keyof BudgetAlertSettings, value)}
                        disabled={!settings.enableAlerts}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Reset to default settings
                    const defaultSettings: BudgetAlertSettings = {
                      enableAlerts: true,
                      warningThreshold: 80,
                      dangerThreshold: 100,
                      dailyAlerts: false,
                      weeklyAlerts: true,
                      monthlyAlerts: true,
                      categoryAlerts: true,
                      smartPatternAlerts: true
                    };
                    setSettings(defaultSettings);
                    onUpdateSettings(defaultSettings);
                    toast.success('Alert settings reset to defaults');
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={onClearAllAlerts}
                  disabled={alerts.length === 0}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Alerts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default BudgetAlerts;