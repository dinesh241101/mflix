
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
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    reward_points: 10,
    questions: []
  });

  useEffect(() => {
    loadQuizzes();
    loadMovies();
  }, []);

  const loadQuizzes = async () => {
    try {
      // For demo purposes, using sample data
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

  const handleAddQuiz = () => {
    const quiz: Quiz = {
      id: Date.now().toString(),
      title: newQuiz.title.trim(),
      questions: [],
      reward_points: newQuiz.reward_points,
      is_active: true
    };

    setQuizzes([...quizzes, quiz]);
    setNewQuiz({ title: "", reward_points: 10, questions: [] });
    setShowAddForm(false);

    toast({
      title: "Success",
      description: "Quiz created successfully!",
    });
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
    toast({
      title: "Success",
      description: "Quiz deleted successfully!",
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
              <div className="flex items-center justify-between">
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
                    variant="ghost"
                    onClick={() => setEditingQuiz(quiz)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
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
