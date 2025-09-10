import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Target, TrendingUp, Zap, Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIPersonalizationProps {
  productId?: string;
  showRecommendations?: boolean;
  variant?: 'compact' | 'detailed' | 'floating';
  onAnalysisComplete?: (data: any) => void;
}

const AIPersonalization: React.FC<AIPersonalizationProps> = ({
  productId,
  showRecommendations = true,
  variant = 'detailed',
  onAnalysisComplete
}) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [aiScore, setAiScore] = useState<number>(0);
  const [matchReasons, setMatchReasons] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [personalizedInsights, setPersonalizedInsights] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile && productId) {
      performPersonalizedAnalysis();
    }
  }, [userProfile, productId]);

  const loadUserProfile = () => {
    const profile = localStorage.getItem('enhancedUserSkinProfile');
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
  };

  const performPersonalizedAnalysis = async () => {
    if (!userProfile || !productId) return;

    setIsAnalyzing(true);
    
    // Simulate advanced AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate personalized match score
    const baseScore = Math.floor(Math.random() * 30) + 70;
    const personalityBonus = calculatePersonalityBonus(userProfile.personalityProfile);
    const concernMatchBonus = calculateConcernMatch(userProfile.concerns);
    
    const finalScore = Math.min(100, baseScore + personalityBonus + concernMatchBonus);
    setAiScore(finalScore);
    
    // Generate match reasons
    const reasons = generateMatchReasons(finalScore, userProfile);
    setMatchReasons(reasons);
    
    // Generate personalized insights
    const insights = generatePersonalizedInsights(finalScore, userProfile);
    setPersonalizedInsights(insights);
    
    setIsAnalyzing(false);
    
    if (onAnalysisComplete) {
      onAnalysisComplete({
        score: finalScore,
        reasons,
        insights,
        confidence: userProfile.confidence
      });
    }
  };

  const calculatePersonalityBonus = (profile: any): number => {
    let bonus = 0;
    if (profile?.skincare_commitment === 'high') bonus += 5;
    if (profile?.result_expectation === 'patient') bonus += 3;
    return bonus;
  };

  const calculateConcernMatch = (concerns: string[]): number => {
    // This would be enhanced with actual product-concern matching
    return Math.floor(Math.random() * 15) + 5;
  };

  const generateMatchReasons = (score: number, profile: any): string[] => {
    const reasons = [];
    
    if (score > 90) {
      reasons.push('Exceptional compatibility with your skin profile');
      reasons.push('Addresses your top 3 concerns simultaneously');
    } else if (score > 80) {
      reasons.push('High compatibility with your skin type');
      reasons.push('Targets your primary skin concerns');
    } else if (score > 70) {
      reasons.push('Good match for your skin profile');
      reasons.push('Supports your skincare goals');
    }
    
    if (profile.personalityProfile?.product_preference === 'science-backed') {
      reasons.push('Contains clinically-proven ingredients');
    }
    
    if (profile.personalityProfile?.routine_complexity === 'simple') {
      reasons.push('Fits your preferred minimal routine');
    }
    
    return reasons.slice(0, 3);
  };

  const generatePersonalizedInsights = (score: number, profile: any) => {
    return {
      timeline: score > 85 ? 'Results expected in 2-3 weeks' : 'Results expected in 4-6 weeks',
      synergy: 'High synergy with your current routine',
      optimization: 'Use in evening for maximum effectiveness',
      lifestyle_tip: profile.aiInsights?.[0] || 'Consistent use yields exponential results'
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="w-4 h-4" />;
    if (score >= 80) return <Star className="w-4 h-4" />;
    if (score >= 70) return <Target className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  if (!userProfile) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-6 text-center">
          <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-3">Complete your skin analysis for personalized AI insights</p>
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Take Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${getScoreColor(aiScore)} border flex items-center gap-1`}>
          {getScoreIcon(aiScore)}
          {isAnalyzing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <Brain className="w-3 h-3" />
            </motion.div>
          ) : (
            `${aiScore}% AI Match`
          )}
        </Badge>
        {aiScore > 85 && (
          <Badge className="bg-gradient-primary text-white animate-pulse">
            <Sparkles className="w-3 h-3 mr-1" />
            Perfect Match
          </Badge>
        )}
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        className="fixed bottom-20 right-6 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-80 shadow-2xl border-primary/20 bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold">AI Personalization</h4>
                <p className="text-xs text-muted-foreground">Live analysis active</p>
              </div>
            </div>
            
            {isAnalyzing ? (
              <div className="text-center py-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"
                />
                <p className="text-sm text-muted-foreground">Analyzing compatibility...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Match Score</span>
                  <Badge className={getScoreColor(aiScore)}>
                    {aiScore}%
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  {matchReasons.slice(0, 2).map((reason, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Zap className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
                
                {personalizedInsights && (
                  <div className="pt-2 border-t border-muted">
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <Target className="w-3 h-3" />
                      {personalizedInsights.timeline}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-serum">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center"
            animate={isAnalyzing ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isAnalyzing ? Infinity : 0 }}
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">AI Personalization Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Based on your unique skin profile
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-muted-foreground">
                Processing your skin profile with advanced AI algorithms...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* AI Match Score */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getScoreColor(aiScore)}`}>
                  {getScoreIcon(aiScore)}
                  <span className="font-bold text-2xl">{aiScore}%</span>
                  <span className="font-medium">AI Match</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Confidence: {Math.round((userProfile.confidence || 0.9) * 100)}%
                </p>
              </div>

              {/* Match Reasons */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Why This Matches You
                </h4>
                <div className="space-y-2">
                  {matchReasons.map((reason, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{reason}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Personalized Insights */}
              {personalizedInsights && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Personalized Insights
                  </h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Results:</span>
                      <span className="font-medium">{personalizedInsights.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Routine Synergy:</span>
                      <span className="font-medium text-green-600">{personalizedInsights.synergy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best Usage:</span>
                      <span className="font-medium">{personalizedInsights.optimization}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-muted">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground italic">
                        {personalizedInsights.lifestyle_tip}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {showRecommendations && (
                <div className="flex gap-2">
                  <Button variant="premium" size="sm" className="flex-1">
                    <Sparkles className="w-4 h-4 mr-2" />
                    View Similar Products
                  </Button>
                  <Button variant="outline" size="sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Refine Analysis
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AIPersonalization;