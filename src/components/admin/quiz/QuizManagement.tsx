import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit3 } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  total_points: number;
  created_at?: string;
}

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: ''
  });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    points: 5
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    try {
      const savedQuizzes = localStorage.getItem('mflix_quizzes');
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const saveQuizzes = (updatedQuizzes: Quiz[]) => {
    try {
      localStorage.setItem('mflix_quizzes', JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error('Error saving quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz data",
        variant: "destructive"
      });
    }
  };

  const handleCreateQuiz = () => {
    if (!newQuiz.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive"
      });
      return;
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      title: newQuiz.title,
      description: newQuiz.description,
      questions: [],
      total_points: 0,
      created_at: new Date().toISOString()
    };

    const updatedQuizzes = [...quizzes, quiz];
    saveQuizzes(updatedQuizzes);
    setSelectedQuiz(quiz);
    setNewQuiz({ title: '', description: '' });

    toast({
      title: "Success",
      description: "Quiz created successfully!",
    });
  };

  const handleAddQuestion = () => {
    if (!selectedQuiz) return;

    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all question fields",
        variant: "destructive"
      });
      return;
    }

    const question: QuizQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: [...newQuestion.options],
      correct_answer: newQuestion.correct_answer,
      points: newQuestion.points
    };

    const updatedQuiz = {
      ...selectedQuiz,
      questions: [...selectedQuiz.questions, question],
      total_points: selectedQuiz.total_points + newQuestion.points
    };

    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === selectedQuiz.id ? updatedQuiz : quiz
    );

    saveQuizzes(updatedQuizzes);
    setSelectedQuiz(updatedQuiz);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      points: 5
    });

    toast({
      title: "Success",
      description: "Question added successfully!",
    });
  };

  const handleUpdateQuestion = () => {
    if (!selectedQuiz || !editingQuestion) return;

    if (!editingQuestion.question.trim() || editingQuestion.options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all question fields",
        variant: "destructive"
      });
      return;
    }

    const updatedQuestions = selectedQuiz.questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    );

    const updatedQuiz = {
      ...selectedQuiz,
      questions: updatedQuestions,
      total_points: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
    };

    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === selectedQuiz.id ? updatedQuiz : quiz
    );

    saveQuizzes(updatedQuizzes);
    setSelectedQuiz(updatedQuiz);
    setEditingQuestion(null);

    toast({
      title: "Success",
      description: "Question updated successfully!",
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedQuiz) return;

    const confirmed = window.confirm('Are you sure you want to delete this question?');
    if (!confirmed) return;

    const updatedQuestions = selectedQuiz.questions.filter(q => q.id !== questionId);
    const updatedQuiz = {
      ...selectedQuiz,
      questions: updatedQuestions,
      total_points: updatedQuestions.reduce((sum, q) => sum + q.points, 0)
    };

    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === selectedQuiz.id ? updatedQuiz : quiz
    );

    saveQuizzes(updatedQuizzes);
    setSelectedQuiz(updatedQuiz);

    toast({
      title: "Success",
      description: "Question deleted successfully!",
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
    saveQuizzes(updatedQuizzes);

    if (selectedQuiz?.id === quizId) {
      setSelectedQuiz(null);
    }

    toast({
      title: "Success",
      description: "Quiz deleted successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-white">Quiz Management</div>

      {!selectedQuiz ? (
        <div className="space-y-6">
          {/* Create New Quiz */}
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
                  placeholder="Enter quiz title..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Description (Optional)</Label>
                <Textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  placeholder="Enter quiz description..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button onClick={handleCreateQuiz} className="bg-blue-600 hover:bg-blue-700">
                Create Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Existing Quizzes */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Existing Quizzes ({quizzes.length})</h4>
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{quiz.title}</div>
                      <div className="text-sm text-gray-400">{quiz.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {quiz.questions.length} Questions
                        </Badge>
                        <Badge className="text-xs bg-green-600">
                          {quiz.total_points} Points
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedQuiz(quiz)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Edit Quiz
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

            {quizzes.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No quizzes found.</p>
                <p className="text-sm">Create your first quiz above.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Editor */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{selectedQuiz.title}</h3>
              <p className="text-gray-400">{selectedQuiz.description}</p>
            </div>
            <Button
              onClick={() => setSelectedQuiz(null)}
              variant="outline"
            >
              Back to Quizzes
            </Button>
          </div>

          {/* Add/Edit Question Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Question</Label>
                <Textarea
                  value={editingQuestion ? editingQuestion.question : newQuestion.question}
                  onChange={(e) => {
                    if (editingQuestion) {
                      setEditingQuestion({ ...editingQuestion, question: e.target.value });
                    } else {
                      setNewQuestion({ ...newQuestion, question: e.target.value });
                    }
                  }}
                  placeholder="Enter your question..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(editingQuestion ? editingQuestion.options : newQuestion.options).map((option, index) => (
                  <div key={index}>
                    <Label className="text-gray-300">Option {index + 1}</Label>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(editingQuestion ? editingQuestion.options : newQuestion.options)];
                        newOptions[index] = e.target.value;
                        if (editingQuestion) {
                          setEditingQuestion({ ...editingQuestion, options: newOptions });
                        } else {
                          setNewQuestion({ ...newQuestion, options: newOptions });
                        }
                      }}
                      placeholder={`Enter option ${index + 1}...`}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Correct Answer</Label>
                  <select
                    value={editingQuestion ? editingQuestion.correct_answer : newQuestion.correct_answer}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, correct_answer: value });
                      } else {
                        setNewQuestion({ ...newQuestion, correct_answer: value });
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Points</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={editingQuestion ? editingQuestion.points : newQuestion.points}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 5;
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, points: value });
                      } else {
                        setNewQuestion({ ...newQuestion, points: value });
                      }
                    }}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {editingQuestion ? (
                  <>
                    <Button
                      onClick={handleUpdateQuestion}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Update Question
                    </Button>
                    <Button
                      onClick={() => setEditingQuestion(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAddQuestion}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Question
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">
              Questions ({selectedQuiz.questions.length}) - Total Points: {selectedQuiz.total_points}
            </h4>
            {selectedQuiz.questions.map((question, index) => (
              <Card key={question.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Q{index + 1}: {question.question}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`
                              ${optIndex === question.correct_answer ? 'text-green-400 font-medium' : ''}
                            `}>
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className="bg-blue-600">{question.points} pts</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingQuestion(question)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {selectedQuiz.questions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No questions added yet.</p>
                <p className="text-sm">Add your first question above.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
