
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  reward_points: number;
  is_active: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState<string | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    reward_points: 10,
    questions: []
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
    points: 5
  });

  useEffect(() => {
    loadQuizzes();
    loadMovies();
  }, []);

  const loadQuizzes = async () => {
    try {
      // For demo purposes, using sample data stored in localStorage
      const savedQuizzes = localStorage.getItem('mflix_quizzes');
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      } else {
        const sampleQuizzes: Quiz[] = [
          {
            id: '1',
            title: 'The Big Bang Theory Quiz',
            questions: [
              {
                id: '1',
                question: 'What is Sheldon Cooper\'s favorite number?',
                options: ['73', '42', '13', '7'],
                correct_answer: 0,
                points: 5
              },
              {
                id: '2', 
                question: 'What is the name of Penny\'s ex-boyfriend?',
                options: ['Leonard', 'Kurt', 'Mike', 'Dave'],
                correct_answer: 1,
                points: 5
              }
            ],
            reward_points: 10,
            is_active: true
          }
        ];
        setQuizzes(sampleQuizzes);
        localStorage.setItem('mflix_quizzes', JSON.stringify(sampleQuizzes));
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('movie_id, title')
        .eq('is_visible', true)
        .order('title');

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const saveQuizzes = (updatedQuizzes: Quiz[]) => {
    setQuizzes(updatedQuizzes);
    localStorage.setItem('mflix_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleAddQuiz = () => {
    const quiz: Quiz = {
      id: Date.now().toString(),
      title: newQuiz.title.trim(),
      questions: [],
      reward_points: newQuiz.reward_points,
      is_active: true
    };

    const updatedQuizzes = [...quizzes, quiz];
    saveQuizzes(updatedQuizzes);
    
    setNewQuiz({ title: "", reward_points: 10, questions: [] });
    setShowAddForm(false);

    toast({
      title: "Success",
      description: "Quiz created successfully!",
    });
  };

  const handleDeleteQuiz = (id: string) => {
    const updatedQuizzes = quizzes.filter(q => q.id !== id);
    saveQuizzes(updatedQuizzes);
    
    toast({
      title: "Success",
      description: "Quiz deleted successfully!",
    });
  };

  const handleAddQuestion = (quizId: string) => {
    const question: QuizQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question.trim(),
      options: newQuestion.options.filter(opt => opt.trim() !== ""),
      correct_answer: newQuestion.correct_answer,
      points: newQuestion.points
    };

    const updatedQuizzes = quizzes.map(quiz => {
      if (quiz.id === quizId) {
        return {
          ...quiz,
          questions: [...quiz.questions, question]
        };
      }
      return quiz;
    });

    saveQuizzes(updatedQuizzes);
    
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
      points: 5
    });
    setShowQuestionForm(null);

    toast({
      title: "Success",
      description: "Question added successfully!",
    });
  };

  const handleDeleteQuestion = (quizId: string, questionId: string) => {
    const updatedQuizzes = quizzes.map(quiz => {
      if (quiz.id === quizId) {
        return {
          ...quiz,
          questions: quiz.questions.filter(q => q.id !== questionId)
        };
      }
      return quiz;
    });

    saveQuizzes(updatedQuizzes);
    
    toast({
      title: "Success",
      description: "Question deleted successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Quiz Management</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Quiz
        </Button>
      </div>

      {/* Add New Quiz Form */}
      {showAddForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Quiz Title</Label>
              <Input
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., The Big Bang Theory Quiz"
              />
            </div>
            <div>
              <Label className="text-gray-300">Reward Points</Label>
              <Input
                type="number"
                value={newQuiz.reward_points}
                onChange={(e) => setNewQuiz({ ...newQuiz, reward_points: parseInt(e.target.value) })}
                className="bg-gray-700 border-gray-600 text-white"
                min="1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddQuiz} className="bg-green-600 hover:bg-green-700">
                <Save size={16} className="mr-2" />
                Create Quiz
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-gray-600"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quizzes List */}
      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium text-white">{quiz.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {quiz.questions.length} Questions
                    </Badge>
                    <Badge className="text-xs bg-green-600">
                      {quiz.reward_points} Points
                    </Badge>
                    {quiz.is_active && (
                      <Badge className="text-xs bg-blue-600">Active</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowQuestionForm(quiz.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Question
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-800 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Quiz</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Questions List */}
              {quiz.questions.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-300">Questions:</h4>
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-gray-700 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {index + 1}. {question.question}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {question.options.map((option, optIndex) => (
                              <p key={optIndex} className={`text-xs ${optIndex === question.correct_answer ? 'text-green-400' : 'text-gray-400'}`}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === question.correct_answer && ' ✓'}
                              </p>
                            ))}
                          </div>
                          <p className="text-xs text-blue-400 mt-1">{question.points} points</p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete Question</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to delete this question? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuestion(quiz.id, question.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Question Form */}
              {showQuestionForm === quiz.id && (
                <div className="bg-gray-700 p-4 rounded mt-4">
                  <h4 className="text-white font-medium mb-3">Add New Question</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300">Question</Label>
                      <Textarea
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        className="bg-gray-600 border-gray-500 text-white"
                        placeholder="Enter your question..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {newQuestion.options.map((option, index) => (
                        <div key={index}>
                          <Label className="text-gray-300">Option {String.fromCharCode(65 + index)}</Label>
                          <Input
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...newQuestion.options];
                              updatedOptions[index] = e.target.value;
                              setNewQuestion({ ...newQuestion, options: updatedOptions });
                            }}
                            className="bg-gray-600 border-gray-500 text-white"
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-300">Correct Answer</Label>
                        <select
                          value={newQuestion.correct_answer}
                          onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: parseInt(e.target.value) })}
                          className="w-full bg-gray-600 border border-gray-500 text-white rounded px-3 py-2"
                        >
                          {newQuestion.options.map((_, index) => (
                            <option key={index} value={index}>
                              Option {String.fromCharCode(65 + index)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Points</Label>
                        <Input
                          type="number"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                          className="bg-gray-600 border-gray-500 text-white"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddQuestion(quiz.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save size={16} className="mr-2" />
                        Add Question
                      </Button>
                      <Button
                        onClick={() => setShowQuestionForm(null)}
                        variant="outline"
                        className="border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No quizzes configured.</p>
          <p className="text-sm">Create quizzes to engage users before downloads.</p>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
