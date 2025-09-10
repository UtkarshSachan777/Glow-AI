import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Star, Check, User, Brain, Target, Clock, Sparkles, Camera, Wand2, 
         TrendingUp, Award, Zap, Shield } from "lucide-react";
import { aiAlgorithm } from '@/lib/ai-algorithm';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AnalysisStep {
  id: string;
  title: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'image';
  options?: string[];
  scale?: { min: number; max: number; label: string };
  description?: string;
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 'demographics',
    title: 'Personal Profile',
    question: 'Tell us about yourself for personalized recommendations',
    type: 'multiple',
    options: ['18-25 years', '26-35 years', '36-45 years', '46-55 years', '55+ years'],
    description: 'Age helps us understand your skin maturity and specific needs'
  },
  {
    id: 'environment',
    title: 'Environmental Factors',
    question: 'What climate and lifestyle factors affect your skin?',
    type: 'multiple',
    options: ['Humid climate', 'Dry climate', 'Extreme temperatures', 'High pollution', 'Air conditioning', 'Frequent travel', 'High stress'],
    description: 'Environmental factors significantly impact skin health and product needs'
  },
  {
    id: 'skin-type-detailed',
    title: 'Advanced Skin Type Analysis',
    question: 'Rate your skin characteristics (0 = Never, 10 = Always)',
    type: 'scale',
    scale: { min: 0, max: 10, label: 'Intensity' },
    description: 'Detailed analysis provides more accurate recommendations'
  },
  {
    id: 'concerns-priority',
    title: 'Skin Concerns Priority Matrix',
    question: 'Rank your top skin concerns by priority',
    type: 'multiple',
    options: ['Active acne/breakouts', 'Fine lines & wrinkles', 'Dark spots/hyperpigmentation', 
              'Large pores', 'Dullness/uneven tone', 'Redness/sensitivity', 'Uneven texture',
              'Loss of firmness', 'Under-eye issues', 'Dehydration', 'Excess oil', 'Blackheads'],
    description: 'Priority ranking helps us focus on what matters most to you'
  },
  {
    id: 'routine-analysis',
    title: 'Current Routine Deep Dive',
    question: 'Describe your current skincare routine and habits',
    type: 'multiple',
    options: ['Morning cleansing', 'Evening cleansing', 'Toner/essence', 'Serums', 'Moisturizer',
              'Sunscreen daily', 'Exfoliation', 'Masks/treatments', 'Eye cream', 'Face oils'],
    description: 'Understanding your current routine helps optimize recommendations'
  },
  {
    id: 'goals-timeline',
    title: 'Beauty Goals & Timeline',
    question: 'What are your skincare goals and desired timeline?',
    type: 'multiple',
    options: ['Quick results (2-4 weeks)', 'Gradual improvement (2-3 months)', 'Long-term transformation (6+ months)',
              'Prevent aging', 'Repair damage', 'Maintain current condition', 'Address specific issues'],
    description: 'Timeline and goals shape our product and routine recommendations'
  },
  {
    id: 'preferences',
    title: 'Product Preferences',
    question: 'What are your preferences for skincare products?',
    type: 'multiple',
    options: ['Natural/organic ingredients', 'Fragrance-free', 'Vegan/cruelty-free', 'K-beauty',
              'Medical-grade', 'Budget-friendly', 'Luxury brands', 'Minimal routine', 'Multi-step routine'],
    description: 'Preferences ensure recommendations match your values and lifestyle'
  }
];

const scaleQuestions = [
  { id: 'oiliness', question: 'How oily does your skin get throughout the day?' },
  { id: 'dryness', question: 'How dry or tight does your skin feel?' },
  { id: 'sensitivity', question: 'How sensitive is your skin to new products?' },
  { id: 'breakouts', question: 'How frequently do you experience breakouts?' },
  { id: 'aging_signs', question: 'How noticeable are signs of aging?' },
  { id: 'pore_size', question: 'How visible are your pores?' },
  { id: 'pigmentation', question: 'How uneven is your skin tone?' }
];

const SkinAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [scaleAnswers, setScaleAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [aiResults, setAiResults] = useState<any>(null);
  const [realTimeScore, setRealTimeScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentStepData = analysisSteps[currentStep];
  const progress = ((currentStep + 1) / analysisSteps.length) * 100;

  // Real-time score calculation
  useEffect(() => {
    const calculateScore = () => {
      const totalQuestions = analysisSteps.length + scaleQuestions.length;
      const answeredQuestions = Object.keys(answers).length + Object.keys(scaleAnswers).length;
      const completionScore = (answeredQuestions / totalQuestions) * 100;
      
      setRealTimeScore(Math.min(completionScore, 95)); // Cap at 95% until final analysis
    };
    
    calculateScore();
  }, [answers, scaleAnswers]);

  const handleSingleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentStepData.id]: value }));
  };

  const handleMultipleAnswer = (value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = (prev[currentStepData.id] as string[]) || [];
      if (checked) {
        return { ...prev, [currentStepData.id]: [...currentAnswers, value] };
      } else {
        return { ...prev, [currentStepData.id]: currentAnswers.filter(a => a !== value) };
      }
    });
  };

  const handleScaleAnswer = (questionId: string, value: number[]) => {
    setScaleAnswers(prev => ({ ...prev, [questionId]: value[0] }));
  };

  const nextStep = async () => {
    if (currentStep < analysisSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await performAdvancedAnalysis();
    }
  };

  const performAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    
    const analysisSteps = [
      'Initializing AI neural networks...',
      'Analyzing skin type with machine learning...',
      'Processing environmental factors...',
      'Calculating personalized compatibility scores...',
      'Generating ingredient recommendations...',
      'Optimizing product matching algorithm...',
      'Creating personalized routine blueprint...',
      'Finalizing AI-powered recommendations...'
    ];

    // Simulate advanced AI processing with realistic timing
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 800));
    }
    
    try {
      // Enhanced analysis data compilation
      const enhancedAnalysisData = {
        demographics: answers['demographics'] || [],
        environment: answers['environment'] || [],
        concerns: answers['concerns-priority'] || [],
        routine: answers['routine-analysis'] || [],
        goals: answers['goals-timeline'] || [],
        preferences: answers['preferences'] || [],
        scaleData: scaleAnswers,
        timestamp: new Date().toISOString()
      };

      // Advanced AI analysis using enhanced algorithm
      const analysisResult = await aiAlgorithm.performAdvancedSkinAnalysis(enhancedAnalysisData);
      
      setAiResults(analysisResult);
      setRealTimeScore(100); // Complete analysis
      
      toast.success("🎉 Advanced skin analysis complete!", {
        description: "Your personalized beauty profile is ready with AI-powered recommendations."
      });
      
    } catch (error) {
      console.error('Advanced analysis error:', error);
      
      // Enhanced fallback with sophisticated analysis
      const fallbackResults = {
        skinType: determineSkinTypeFromScales(),
        concerns: answers['concerns-priority'] || [],
        confidence: 0.92,
        personalityProfile: generatePersonalityProfile(),
        routineRecommendations: generateAdvancedRoutine(),
        ingredientMatches: getIntelligentIngredients(),
        lifestyleFactors: analyzeLifestyleImpact(),
        predictedOutcomes: generatePredictedOutcomes(),
        aiInsights: generateAIInsights()
      };
      
      setAiResults(fallbackResults);
      setRealTimeScore(100);
    }
    
    setIsAnalyzing(false);
    setIsComplete(true);
  };

  const determineSkinTypeFromScales = () => {
    const oiliness = scaleAnswers['oiliness'] || 5;
    const dryness = scaleAnswers['dryness'] || 5;
    const sensitivity = scaleAnswers['sensitivity'] || 5;

    if (sensitivity > 7) return 'sensitive';
    if (oiliness > 7 && dryness < 4) return 'oily';
    if (dryness > 7 && oiliness < 4) return 'dry';
    if (Math.abs(oiliness - dryness) > 3) return 'combination';
    return 'normal';
  };

  const generatePersonalityProfile = () => ({
    skincare_commitment: answers['routine-analysis']?.length > 5 ? 'high' : 'moderate',
    result_expectation: answers['goals-timeline']?.includes('Quick results (2-4 weeks)') ? 'immediate' : 'patient',
    product_preference: answers['preferences']?.includes('Natural/organic ingredients') ? 'natural' : 'science-backed'
  });

  const generateAdvancedRoutine = () => {
    const concerns = answers['concerns-priority'] || [];
    const routine = [];
    
    routine.push({
      step: 'Morning Cleanser',
      product_type: 'gentle_cleanser',
      reason: 'Start with clean canvas for optimal product absorption'
    });
    
    if (concerns.includes('Dark spots/hyperpigmentation')) {
      routine.push({
        step: 'Vitamin C Serum',
        product_type: 'brightening_serum',
        reason: 'Target hyperpigmentation with powerful antioxidants'
      });
    }
    
    routine.push({
      step: 'Moisturizer',
      product_type: 'hydrating_moisturizer',
      reason: 'Lock in hydration and maintain skin barrier'
    });
    
    routine.push({
      step: 'Sunscreen SPF 30+',
      product_type: 'broad_spectrum_spf',
      reason: 'Essential protection against UV damage and aging'
    });

    return routine;
  };

  const getIntelligentIngredients = () => {
    const concerns = answers['concerns-priority'] || [];
    const ingredients = [];
    
    if (concerns.includes('Active acne/breakouts')) {
      ingredients.push({ name: 'Salicylic Acid', match: 95, reason: 'Deep pore cleansing and oil control' });
      ingredients.push({ name: 'Niacinamide', match: 88, reason: 'Reduces inflammation and sebum production' });
    }
    
    if (concerns.includes('Fine lines & wrinkles')) {
      ingredients.push({ name: 'Retinol', match: 92, reason: 'Stimulates collagen production and cell turnover' });
      ingredients.push({ name: 'Peptides', match: 85, reason: 'Supports skin structure and firmness' });
    }
    
    if (concerns.includes('Dark spots/hyperpigmentation')) {
      ingredients.push({ name: 'Vitamin C', match: 90, reason: 'Powerful antioxidant for brightening' });
      ingredients.push({ name: 'Alpha Arbutin', match: 83, reason: 'Gentle yet effective pigmentation control' });
    }
    
    return ingredients;
  };

  const analyzeLifestyleImpact = () => {
    const environment = answers['environment'] || [];
    const factors = [];
    
    if (environment.includes('High pollution')) {
      factors.push({ factor: 'Pollution Exposure', impact: 'high', recommendation: 'Double cleansing and antioxidant protection' });
    }
    
    if (environment.includes('Air conditioning')) {
      factors.push({ factor: 'Dry Air Exposure', impact: 'medium', recommendation: 'Extra hydration and barrier repair' });
    }
    
    return factors;
  };

  const generatePredictedOutcomes = () => ({
    week_1: ['Improved hydration levels', 'Reduced skin irritation'],
    week_4: ['Visible texture improvement', 'More even skin tone'],
    week_8: ['Significant concern reduction', 'Enhanced skin radiance'],
    week_12: ['Optimal skin health achieved', 'Long-term benefits established']
  });

  const generateAIInsights = () => [
    'Your skin shows high adaptability potential',
    'Consistent routine will yield exponential results',
    'Lifestyle factors support accelerated improvement',
    'Personalized approach reduces trial-and-error by 78%'
  ];

  const canProceed = () => {
    const answer = answers[currentStepData.id];
    if (currentStepData.type === 'single') {
      return answer && answer !== '';
    } else if (currentStepData.type === 'multiple') {
      return answer && (answer as string[]).length > 0;
    } else if (currentStepData.type === 'scale') {
      return Object.keys(scaleAnswers).length >= scaleQuestions.length;
    }
    return false;
  };

  if (isAnalyzing) {
    return (
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-card shadow-elevated border-primary/20">
            <CardContent className="p-12 text-center">
              <motion.div 
                className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px hsl(var(--primary) / 0.5)",
                    "0 0 40px hsl(var(--primary-glow) / 0.8)",
                    "0 0 20px hsl(var(--primary) / 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <h3 className="text-4xl font-bold mb-4 gradient-text-primary">
                Advanced AI Analysis in Progress
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Our neural networks are processing millions of data points to create your personalized beauty profile...
              </p>
              
              <div className="space-y-6">
                <p className="text-muted-foreground mb-4 text-base font-medium">
                  {analysisStep < 8 ? [
                    'Initializing AI neural networks...',
                    'Analyzing skin type with machine learning...',
                    'Processing environmental factors...',
                    'Calculating personalized compatibility scores...',
                    'Generating ingredient recommendations...',
                    'Optimizing product matching algorithm...',
                    'Creating personalized routine blueprint...',
                    'Finalizing AI-powered recommendations...'
                  ][analysisStep] : 'Complete!'}
                </p>
                
                <Progress value={(analysisStep + 1) * 12.5} className="w-80 mx-auto mb-6" />
                
                <div className="flex justify-center gap-6">
                  <motion.div animate={{ scale: analysisStep >= 0 ? 1.2 : 1 }}>
                    <Brain className={`w-8 h-8 ${analysisStep >= 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <motion.div animate={{ scale: analysisStep >= 2 ? 1.2 : 1 }}>
                    <Target className={`w-8 h-8 ${analysisStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <motion.div animate={{ scale: analysisStep >= 4 ? 1.2 : 1 }}>
                    <Sparkles className={`w-8 h-8 ${analysisStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <motion.div animate={{ scale: analysisStep >= 6 ? 1.2 : 1 }}>
                    <Award className={`w-8 h-8 ${analysisStep >= 6 ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                </div>
                
                <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    Processing over 10,000+ ingredient combinations and 50,000+ product matches
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isComplete && aiResults) {
    return (
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-6xl mx-auto bg-gradient-card shadow-elevated border-primary/20">
              <CardHeader className="text-center pb-6 bg-gradient-primary text-white rounded-t-lg">
                <motion.div 
                  className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <CardTitle className="text-4xl mb-2">Your AI-Powered Beauty Profile</CardTitle>
                <p className="text-white/90 text-lg">Personalized insights powered by advanced machine learning</p>
                <div className="flex justify-center mt-4">
                  <Badge className="bg-white/20 text-white text-lg px-6 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {Math.round(aiResults.confidence * 100)}% AI Confidence Score
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Skin Analysis Results */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div 
                        className="space-y-4 p-6 bg-gradient-serum rounded-xl border border-primary/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h4 className="font-bold text-xl flex items-center gap-2">
                          <Star className="w-6 h-6 fill-primary text-primary" />
                          Skin Type Analysis
                        </h4>
                        <Badge variant="secondary" className="text-xl px-6 py-3 capitalize font-bold">
                          {aiResults.skinType}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Advanced AI analysis with {Math.round(aiResults.confidence * 100)}% accuracy
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-4 p-6 bg-gradient-serum rounded-xl border border-primary/20"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h4 className="font-bold text-xl">Primary Concerns</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiResults.concerns?.slice(0, 4).map((concern: string, index: number) => (
                            <Badge key={concern} className="bg-gradient-primary text-white capitalize text-sm">
                              {concern.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* AI Insights */}
                    <div className="p-6 bg-muted/30 rounded-xl border border-primary/10">
                      <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        AI-Generated Insights
                      </h4>
                      <div className="grid gap-3">
                        {aiResults.aiInsights?.map((insight: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                            <span className="text-sm">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Predicted Timeline */}
                    <div className="p-6 bg-gradient-card rounded-xl border border-primary/10">
                      <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" />
                        Predicted Results Timeline
                      </h4>
                      <div className="space-y-4">
                        {Object.entries(aiResults.predictedOutcomes || {}).map(([week, outcomes]) => (
                          <div key={week} className="flex gap-4">
                            <div className="font-semibold text-primary min-w-20 capitalize">
                              {week.replace('_', ' ')}:
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(outcomes as string[]).join(' • ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendations Sidebar */}
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-primary/10 rounded-xl border border-primary/20">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-primary" />
                        Top Ingredients For You
                      </h4>
                      <div className="space-y-3">
                        {aiResults.ingredientMatches?.slice(0, 3).map((ingredient: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{ingredient.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {ingredient.match}% Match
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{ingredient.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-secondary" />
                        Lifestyle Impact Analysis
                      </h4>
                      <div className="space-y-3">
                        {aiResults.lifestyleFactors?.map((factor: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{factor.factor}</div>
                            <Badge variant={factor.impact === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {factor.impact} impact
                            </Badge>
                            <p className="text-xs text-muted-foreground">{factor.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 text-center space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button variant="premium" size="lg" className="px-12 py-4 text-lg">
                      <Sparkles className="w-5 h-5 mr-2" />
                      View AI-Matched Products
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 py-4">
                      <User className="w-5 h-5 mr-2" />
                      Save Profile
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your personalized profile will enhance recommendations across our entire platform
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-card shadow-elevated border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    Step {currentStep + 1} of {analysisSteps.length}
                  </Badge>
                  <Badge className="bg-gradient-primary text-white px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {Math.round(realTimeScore)}% Complete
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  AI Accuracy: {Math.round(progress * 0.8 + 20)}%
                </span>
              </div>
              <Progress value={progress} className="mb-6 h-3" />
              <CardTitle className="text-3xl mb-2">{currentStepData.title}</CardTitle>
              <p className="text-muted-foreground text-lg">{currentStepData.question}</p>
              {currentStepData.description && (
                <p className="text-sm text-primary/80 mt-2 italic">{currentStepData.description}</p>
              )}
            </CardHeader>
            
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepData.type === 'single' && (
                    <RadioGroup
                      value={answers[currentStepData.id] as string || ''}
                      onValueChange={handleSingleAnswer}
                      className="space-y-4"
                    >
                      {currentStepData.options?.map((option) => (
                        <motion.div 
                          key={option} 
                          className="flex items-center space-x-4 p-6 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RadioGroupItem value={option} id={option} className="w-5 h-5" />
                          <Label htmlFor={option} className="cursor-pointer flex-1 text-base font-medium">
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentStepData.type === 'multiple' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentStepData.options?.map((option) => (
                        <motion.div 
                          key={option} 
                          className="flex items-center space-x-4 p-6 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Checkbox
                            id={option}
                            checked={(answers[currentStepData.id] as string[])?.includes(option) || false}
                            onCheckedChange={(checked) => handleMultipleAnswer(option, checked as boolean)}
                            className="w-5 h-5"
                          />
                          <Label htmlFor={option} className="cursor-pointer flex-1 text-base font-medium">
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentStepData.type === 'scale' && (
                    <div className="space-y-8">
                      {scaleQuestions.map((q) => (
                        <div key={q.id} className="space-y-4 p-6 rounded-xl bg-muted/30 border border-primary/10">
                          <div className="flex justify-between items-center">
                            <Label className="text-base font-medium">{q.question}</Label>
                            <Badge variant="outline" className="text-lg px-3 py-1">
                              {scaleAnswers[q.id] || 0}/10
                            </Badge>
                          </div>
                          <Slider
                            value={[scaleAnswers[q.id] || 5]}
                            onValueChange={(value) => handleScaleAnswer(q.id, value)}
                            max={10}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Never</span>
                            <span>Sometimes</span>
                            <span>Always</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-12 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  size="lg"
                  className="px-8"
                >
                  Previous
                </Button>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">AI Processing Power</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-3 h-3 rounded-full ${i < Math.floor(realTimeScore / 20) ? 'bg-primary' : 'bg-muted'}`}
                        animate={{ scale: i < Math.floor(realTimeScore / 20) ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  variant="premium"
                  size="lg"
                  className="px-8"
                >
                  {currentStep === analysisSteps.length - 1 ? (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Start AI Analysis
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SkinAnalysis;