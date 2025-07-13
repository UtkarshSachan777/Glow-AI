import { supabase } from '@/integrations/supabase/client';

// Enhanced AI Algorithm for Skincare Product Recommendations
export interface UserProfile {
  skinType: 'normal' | 'oily' | 'dry' | 'combination' | 'sensitive';
  concerns: string[];
  age: number;
  climate: 'humid' | 'dry' | 'tropical' | 'temperate' | 'cold';
  preferences?: {
    priceRange?: [number, number];
    brands?: string[];
    ingredients?: string[];
    routineComplexity?: 'simple' | 'moderate' | 'complex';
  };
}

export interface AIRecommendation {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  dynamic_score: number;
  match_reasons: string[];
  predicted_results?: string[];
  usage_timeline?: string;
}

export interface SkinAnalysisResult {
  skinType: string;
  concerns: string[];
  recommendations: string[];
  confidence: number;
}

export class EnhancedAIAlgorithm {
  private static instance: EnhancedAIAlgorithm;

  public static getInstance(): EnhancedAIAlgorithm {
    if (!EnhancedAIAlgorithm.instance) {
      EnhancedAIAlgorithm.instance = new EnhancedAIAlgorithm();
    }
    return EnhancedAIAlgorithm.instance;
  }

  /**
   * Get personalized product recommendations using the enhanced AI algorithm
   */
  async getPersonalizedRecommendations(
    userProfile: UserProfile,
    limit: number = 10
  ): Promise<AIRecommendation[]> {
    try {
      const { data, error } = await supabase.rpc('get_personalized_recommendations', {
        user_skin_type: userProfile.skinType,
        user_concerns: userProfile.concerns,
        user_age: userProfile.age,
        user_climate: userProfile.climate,
        limit_count: limit
      });

      if (error) throw error;

      return data?.map((item: any) => ({
        ...item,
        predicted_results: this.generatePredictedResults(item, userProfile),
        usage_timeline: this.generateUsageTimeline(item)
      })) || [];
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  /**
   * Calculate dynamic AI score for a specific product
   */
  async calculateDynamicScore(
    productId: string,
    userProfile: UserProfile
  ): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('calculate_dynamic_ai_score', {
        product_id: productId,
        user_skin_type: userProfile.skinType,
        user_concerns: userProfile.concerns,
        user_age: userProfile.age,
        user_climate: userProfile.climate
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error calculating dynamic score:', error);
      return 0;
    }
  }

  /**
   * Analyze skin profile and provide detailed insights
   */
  async analyzeSkinProfile(responses: Record<string, any>): Promise<SkinAnalysisResult> {
    const {
      oiliness,
      sensitivity,
      hydration,
      concerns,
      age,
      climate,
      lifestyle
    } = responses;

    // Determine skin type based on responses
    let skinType = 'normal';
    let confidence = 0.8;

    if (oiliness > 7 && hydration < 4) {
      skinType = 'oily';
      confidence = 0.9;
    } else if (hydration < 4 && oiliness < 4) {
      skinType = 'dry';
      confidence = 0.85;
    } else if (oiliness > 6 && hydration > 6) {
      skinType = 'combination';
      confidence = 0.8;
    } else if (sensitivity > 7) {
      skinType = 'sensitive';
      confidence = 0.9;
    }

    // Determine primary concerns
    const detectedConcerns = [];
    if (concerns.includes('acne') || oiliness > 6) {
      detectedConcerns.push('acne', 'oily_skin');
    }
    if (concerns.includes('aging') || age > 30) {
      detectedConcerns.push('wrinkles', 'fine_lines', 'aging');
    }
    if (hydration < 5 || concerns.includes('dryness')) {
      detectedConcerns.push('dryness', 'dehydration');
    }
    if (concerns.includes('dark_spots') || concerns.includes('pigmentation')) {
      detectedConcerns.push('dark_spots', 'pigmentation');
    }

    // Generate recommendations based on analysis
    const recommendations = this.generateSkinRecommendations(
      skinType,
      detectedConcerns,
      age,
      climate
    );

    return {
      skinType,
      concerns: detectedConcerns,
      recommendations,
      confidence
    };
  }

  /**
   * Search products with enhanced AI scoring
   */
  async searchWithAI(
    query: string,
    userProfile?: Partial<UserProfile>
  ): Promise<any[]> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;

      // If user profile is provided, calculate dynamic scores
      if (userProfile && userProfile.skinType) {
        const enhancedProducts = await Promise.all(
          products.map(async (product) => {
            const dynamicScore = await this.calculateDynamicScore(
              product.id,
              userProfile as UserProfile
            );
            return {
              ...product,
              ai_match_score: dynamicScore
            };
          })
        );

        return enhancedProducts.sort((a, b) => b.ai_match_score - a.ai_match_score);
      }

      return products.sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0));
    } catch (error) {
      console.error('Error in AI search:', error);
      return [];
    }
  }

  /**
   * Generate predicted results for a product
   */
  private generatePredictedResults(
    product: any,
    userProfile: UserProfile
  ): string[] {
    const results = [];
    
    if (product.dynamic_score > 80) {
      results.push('Excellent compatibility with your skin');
    }
    
    if (userProfile.concerns.includes('acne') && product.benefits?.includes('acne-fighting')) {
      results.push('Visible reduction in breakouts within 2-4 weeks');
    }
    
    if (userProfile.concerns.includes('aging') && product.benefits?.includes('anti-aging')) {
      results.push('Improved skin texture and firmness in 4-6 weeks');
    }
    
    if (userProfile.concerns.includes('dryness') && product.benefits?.includes('hydrating')) {
      results.push('Enhanced hydration levels within 1-2 weeks');
    }

    if (product.clinical_evidence_score > 80) {
      results.push('Clinically proven ingredients for reliable results');
    }

    return results;
  }

  /**
   * Generate usage timeline for a product
   */
  private generateUsageTimeline(product: any): string {
    if (product.usage_frequency === 'twice-daily') {
      return 'Use morning and evening for optimal results';
    } else if (product.usage_frequency === 'weekly') {
      return 'Use 1-2 times per week as a treatment';
    } else if (product.name?.toLowerCase().includes('serum')) {
      return 'Apply daily in the evening, introduce gradually';
    } else if (product.name?.toLowerCase().includes('moisturizer')) {
      return 'Use twice daily as the final step in your routine';
    }
    
    return 'Use daily as part of your skincare routine';
  }

  /**
   * Generate skin-specific recommendations
   */
  private generateSkinRecommendations(
    skinType: string,
    concerns: string[],
    age: number,
    climate: string
  ): string[] {
    const recommendations = [];

    // Base recommendations by skin type
    switch (skinType) {
      case 'oily':
        recommendations.push(
          'Use a gentle, oil-free cleanser twice daily',
          'Incorporate salicylic acid for pore control',
          'Choose lightweight, non-comedogenic moisturizers'
        );
        break;
      case 'dry':
        recommendations.push(
          'Use a cream-based cleanser to avoid stripping natural oils',
          'Apply hyaluronic acid serum on damp skin',
          'Use a rich moisturizer to restore barrier function'
        );
        break;
      case 'sensitive':
        recommendations.push(
          'Avoid fragrances and harsh actives',
          'Patch test new products before full application',
          'Use gentle, pH-balanced formulations'
        );
        break;
      case 'combination':
        recommendations.push(
          'Use different products for T-zone and cheek areas',
          'Consider dual-action formulations',
          'Balance oil control with hydration'
        );
        break;
      default:
        recommendations.push(
          'Maintain a consistent basic routine',
          'Focus on prevention with antioxidants',
          'Adjust products based on seasonal changes'
        );
    }

    // Age-specific recommendations
    if (age > 30) {
      recommendations.push(
        'Incorporate anti-aging ingredients like retinol',
        'Use products with peptides and antioxidants',
        'Consider professional treatments for enhanced results'
      );
    }

    // Climate-specific recommendations
    if (climate === 'humid' || climate === 'tropical') {
      recommendations.push('Choose gel-based, lightweight formulations');
    } else if (climate === 'dry' || climate === 'cold') {
      recommendations.push('Use richer, more occlusive formulations');
    }

    return recommendations;
  }
}

// Export singleton instance
export const aiAlgorithm = EnhancedAIAlgorithm.getInstance();