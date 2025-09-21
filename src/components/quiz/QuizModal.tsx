
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Trophy, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (earned_points: number) => void;
  movieTitle: string;
  resolution: string;
}

const QuizModal = ({ isOpen, onClose, onComplete, movieTitle, resolution }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Sample quiz questions - in real app, these would come from the database
  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: `What genre is "${movieTitle}"?`,
      options: ['Action', 'Comedy', 'Drama', 'Sci-Fi'],
      correct_answer: 0,
      points: 5
    },
    {
      id: '2',
      question: 'Which resolution provides the best quality?',
      options: ['480p', '720p', '1080p', '4K'],
      correct_answer: 3,
      points: 5
    }
  ];

  useEffect(() => {
    if (isOpen && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [isOpen, timeLeft, showResult]);

  useEffect(() => {
    if (isOpen) {
      resetQuiz();
    }
  }, [isOpen]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setEarnedPoints(0);
    setShowResult(false);
    setTimeLeft(30);
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Moving to next question...",
      variant: "destructive"
    });
    handleNextQuestion();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const question = quizQuestions[currentQuestion];
    let newScore = score;
    let newPoints = earnedPoints;

    if (selectedAnswer === question.correct_answer) {
      newScore += 1;
      newPoints += question.points;
      toast({
        title: "Correct!",
        description: `+${question.points} points earned`,
      });
    } else {
      toast({
        title: "Wrong Answer",
        description: "Better luck with the next question!",
        variant: "destructive"
      });
    }

    setScore(newScore);
    setEarnedPoints(newPoints);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const handleComplete = () => {
    onComplete(earnedPoints);
    onClose();
  };

  const handleSkip = () => {
    toast({
      title: "Quiz Skipped",
      description: "You can still download, but you won't earn any points.",
    });
    onComplete(0);
    onClose();
  };

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              Quiz Challenge
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600">
                <Star size={14} className="mr-1" />
                {earnedPoints} Points
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {movieTitle} - {resolution} Download
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showResult ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <span>Time: {timeLeft}s</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-xl text-white font-semibold">
                  {currentQ.question}
                </h3>
                
                <div className="space-y-2">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border transition-all ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-900/20 text-blue-300'
                          : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {currentQuestion + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="border-gray-600"
                >
                  Skip Quiz
                </Button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <Trophy className="text-yellow-500 mx-auto" size={48} />
                <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
                <p className="text-gray-400">
                  Great job! You answered {score} out of {quizQuestions.length} questions correctly.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 space-y-2">
                <div className="text-3xl font-bold text-yellow-500">
                  +{earnedPoints} Points
                </div>
                <div className="text-gray-400">Points Earned</div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue to Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizModal;
