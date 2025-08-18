import { useState, useCallback } from 'react';
import { ArrowLeft, Upload, Camera, FileText, Zap, TrendingUp, AlertCircle, CheckCircle, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../components/LanguageContext';
import { toast } from 'sonner';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

export interface BillData {
  id: string;
  fileName: string;
  uploadDate: Date;
  amount: number;
  category: string;
  merchant: string;
  dueDate?: Date;
  isPaid: boolean;
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'error';
  aiInsights: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high';
  recurringPattern?: 'monthly' | 'quarterly' | 'yearly' | 'none';
}

interface BillScannerProps {
  onBack: () => void;
  onBillScanned: (billData: BillData) => void;
  existingBills: BillData[];
  monthlyBudget?: number;
}

const SPENDING_CATEGORIES = [
  { id: 'electricity', name: 'Electricity', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'water', name: 'Water', icon: '💧', color: 'bg-blue-500' },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: 'bg-green-500' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-purple-500' },
  { id: 'airtime', name: 'Airtime/Data', icon: '📱', color: 'bg-orange-500' },
  { id: 'rent', name: 'Rent', icon: '🏠', color: 'bg-red-500' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'bg-indigo-500' },
  { id: 'medical', name: 'Medical', icon: '🏥', color: 'bg-pink-500' },
  { id: 'other', name: 'Other', icon: '📄', color: 'bg-gray-500' }
];

export function BillScanner({ onBack, onBillScanned, existingBills, monthlyBudget = 5000 }: BillScannerProps) {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);

  // Calculate spending insights
  const totalSpending = existingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const spendingByCategory = SPENDING_CATEGORIES.map(category => ({
    ...category,
    amount: existingBills
      .filter(bill => bill.category === category.id)
      .reduce((sum, bill) => sum + bill.amount, 0)
  }));

  const highPriorityBills = existingBills.filter(bill => bill.priority === 'high');
  const unpaidBills = existingBills.filter(bill => !bill.isPaid);

  const simulateAIAnalysis = useCallback((fileName: string, fileSize: number): Promise<BillData> => {
    return new Promise((resolve) => {
      // Simulate different bill types based on filename
      let billData: Partial<BillData> = {};
      
      if (fileName.toLowerCase().includes('eskom') || fileName.toLowerCase().includes('electricity')) {
        billData = {
          amount: Math.floor(Math.random() * 800) + 200,
          category: 'electricity',
          merchant: 'Eskom',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'high',
          recurringPattern: 'monthly',
          aiInsights: [
            'Your electricity usage is 15% higher than last month',
            'Peak usage hours: 18:00-22:00 daily',
            'Consider switching to energy-efficient appliances'
          ],
          recommendations: [
            'Set aside R50 weekly for electricity bills',
            'Use appliances during off-peak hours (22:00-06:00)',
            'Install a prepaid meter to better control usage'
          ]
        };
      } else if (fileName.toLowerCase().includes('water')) {
        billData = {
          amount: Math.floor(Math.random() * 300) + 100,
          category: 'water',
          merchant: 'City Water Department',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          recurringPattern: 'monthly',
          aiInsights: [
            'Water usage within normal range',
            'No significant leaks detected',
            'Usage pattern shows consistent consumption'
          ],
          recommendations: [
            'Budget R150 monthly for water bills',
            'Check for leaky taps to avoid extra charges',
            'Consider rainwater harvesting to reduce costs'
          ]
        };
      } else {
        billData = {
          amount: Math.floor(Math.random() * 500) + 50,
          category: 'other',
          merchant: 'Various Merchant',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          priority: Math.random() > 0.5 ? 'medium' : 'low',
          recurringPattern: Math.random() > 0.5 ? 'monthly' : 'none',
          aiInsights: [
            'Bill amount varies from previous months',
            'Payment history shows timely payments',
            'Consider setting up automatic payments'
          ],
          recommendations: [
            'Track this expense in your monthly budget',
            'Look for alternative providers to save money',
            'Set payment reminders to avoid late fees'
          ]
        };
      }

      const newBill: BillData = {
        id: `bill_${Date.now()}`,
        fileName,
        uploadDate: new Date(),
        isPaid: false,
        analysisStatus: 'completed',
        ...billData
      } as BillData;

      resolve(newBill);
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate AI analysis
      const billData = await simulateAIAnalysis(file.name, file.size);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onBillScanned(billData);
        toast.success(`Bill analyzed successfully! Found ${billData.category} bill for R${billData.amount.toLocaleString()}`);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to analyze bill. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onBillScanned, simulateAIAnalysis]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => `R${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Bill Scanner</h1>
          <p className="text-sm text-muted-foreground">Upload bills for AI analysis and spending insights</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Spending</p>
                <p className="font-medium">{formatCurrency(totalSpending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Unpaid Bills</p>
                <p className="font-medium">{unpaidBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      {monthlyBudget && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Monthly Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent: {formatCurrency(totalSpending)}</span>
                <span>Budget: {formatCurrency(monthlyBudget)}</span>
              </div>
              <Progress 
                value={(totalSpending / monthlyBudget) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {totalSpending > monthlyBudget 
                  ? `Over budget by ${formatCurrency(totalSpending - monthlyBudget)}`
                  : `${formatCurrency(monthlyBudget - totalSpending)} remaining`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Bill
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isUploading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
                <span>Analyzing bill with AI...</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {uploadProgress < 50 ? 'Uploading and processing...' : 
                 uploadProgress < 90 ? 'Running AI analysis...' : 'Finalizing results...'}
              </p>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,application/pdf';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileUpload(file);
                };
                input.click();
              }}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Upload Bill or Receipt</p>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to select • JPG, PNG, PDF up to 10MB
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* High Priority Bills Alert */}
      {highPriorityBills.length > 0 && (
        <Alert className="mb-6 border-orange-200 dark:border-orange-800">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            You have {highPriorityBills.length} high priority bill{highPriorityBills.length > 1 ? 's' : ''} that need attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Bills */}
      {existingBills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Bills ({existingBills.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {existingBills.slice(0, 5).map((bill) => {
              const category = SPENDING_CATEGORIES.find(c => c.id === bill.category);
              return (
                <div key={bill.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${category?.color} flex items-center justify-center text-white text-lg`}>
                      {category?.icon}
                    </div>
                    <div>
                      <p className="font-medium">{bill.merchant}</p>
                      <p className="text-sm text-muted-foreground">
                        {bill.uploadDate.toLocaleDateString()} • {category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="font-medium">{formatCurrency(bill.amount)}</p>
                      <Badge className={`text-xs ${getPriorityColor(bill.priority)}`}>
                        {bill.priority}
                      </Badge>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBill(bill)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Bill Details</DialogTitle>
                        </DialogHeader>
                        {selectedBill && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg ${category?.color} flex items-center justify-center text-white text-xl`}>
                                {category?.icon}
                              </div>
                              <div>
                                <h3 className="font-medium">{selectedBill.merchant}</h3>
                                <p className="text-sm text-muted-foreground">{category?.name}</p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Amount</p>
                                <p className="font-medium">{formatCurrency(selectedBill.amount)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Priority</p>
                                <Badge className={getPriorityColor(selectedBill.priority)}>
                                  {selectedBill.priority}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Due Date</p>
                                <p className="font-medium">
                                  {selectedBill.dueDate ? selectedBill.dueDate.toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <div className="flex items-center gap-1">
                                  {selectedBill.isPaid ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                  )}
                                  <span className="text-sm">
                                    {selectedBill.isPaid ? 'Paid' : 'Unpaid'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {selectedBill.aiInsights.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-medium mb-2">AI Insights</h4>
                                  <ul className="text-sm space-y-1">
                                    {selectedBill.aiInsights.map((insight, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{insight}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                            
                            {selectedBill.recommendations.length > 0 && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-medium mb-2">Recommendations</h4>
                                  <ul className="text-sm space-y-1">
                                    {selectedBill.recommendations.map((rec, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {existingBills.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-muted rounded-lg">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="font-medium">No Bills Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your first bill to get started with AI-powered spending insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}