import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, Star, Sparkles, Coins } from 'lucide-react';
import { Achievement, GamificationSystem } from './GamificationSystem';
import { motion } from 'motion/react';

interface BadgeCelebrationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const BadgeCelebration: React.FC<BadgeCelebrationProps> = ({
  achievement,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-2 border-primary/20">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                initial={{
                  x: Math.random() * 400,
                  y: -10,
                  scale: 0,
                  rotate: 0
                }}
                animate={{
                  y: 500,
                  scale: [0, 1, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        <div className="relative p-8 text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-primary">
                Achievement Unlocked!
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground">Congratulations!</span>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
            </motion.div>
          </div>

          {/* Achievement Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-4"
          >
            <div className={`p-6 rounded-xl ${GamificationSystem.getTierBackground(achievement.tier)} border border-border/50`}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${GamificationSystem.getTierBackground(achievement.tier)}`}>
                  <div className={GamificationSystem.getTierColor(achievement.tier)}>
                    {achievement.icon}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${GamificationSystem.getTierColor(achievement.tier)} border-current`}
                >
                  {achievement.tier.toUpperCase()}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {achievement.description}
              </p>
              
              {/* Rewards */}
              <div className="flex items-center justify-center gap-6 p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">+{achievement.reward.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">+{achievement.reward.coins} Coins</span>
                </div>
              </div>
              
              {achievement.reward.title && (
                <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                  <div className="text-xs text-muted-foreground">New Title Unlocked:</div>
                  <div className="font-medium text-primary">"{achievement.reward.title}"</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button 
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium py-3"
            >
              Awesome! Continue Saving
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};