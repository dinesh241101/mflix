
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  total_points: number;
}

interface QuizAssignment {
  id: string;
  movie_id: string;
  movie_title: string;
  quiz_id: string;
  quiz_title: string;
  resolution: string;
  questions_count: number;
}

const QuizAssignment = () => {
  const [assignments, setAssignments] = useState<QuizAssignment[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedResolution, setSelectedResolution] = useState("1080p");

  const resolutions = ["480p", "720p", "1080p", "4K"];

  useEffect(() => {
    loadMovies();
    loadQuizzes();
    loadAssignments();
  }, []);

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

  const loadQuizzes = () => {
    try {
      const savedQuizzes = localStorage.getItem('mflix_quizzes');
      if (savedQuizzes) {
        const parsedQuizzes = JSON.parse(savedQuizzes);
        setQuizzes(parsedQuizzes);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const loadAssignments = () => {
    try {
      const savedAssignments = localStorage.getItem('mflix_quiz_assignments');
      if (savedAssignments) {
        setAssignments(JSON.parse(savedAssignments));
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const saveAssignments = (updatedAssignments: QuizAssignment[]) => {
    try {
      localStorage.setItem('mflix_quiz_assignments', JSON.stringify(updatedAssignments));
      setAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  };

  const handleAssignQuiz = () => {
    if (!selectedMovie || !selectedQuiz) {
      toast({
        title: "Error",
        description: "Please select both movie and quiz",
        variant: "destructive"
      });
      return;
    }

    const movie = movies.find(m => m.movie_id === selectedMovie);
    const quiz = quizzes.find(q => q.id === selectedQuiz);

    if (!movie || !quiz) {
      toast({
        title: "Error",
        description: "Selected movie or quiz not found",
        variant: "destructive"
      });
      return;
    }

    // Check if assignment already exists
    const existingAssignment = assignments.find(a => 
      a.movie_id === selectedMovie && 
      a.quiz_id === selectedQuiz && 
      a.resolution === selectedResolution
    );

    if (existingAssignment) {
      toast({
        title: "Error",
        description: "This quiz is already assigned to this movie and resolution",
        variant: "destructive"
      });
      return;
    }

    const assignment: QuizAssignment = {
      id: Date.now().toString(),
      movie_id: selectedMovie,
      movie_title: movie.title,
      quiz_id: selectedQuiz,
      quiz_title: quiz.title,
      resolution: selectedResolution,
      questions_count: quiz.questions.length
    };

    const updatedAssignments = [...assignments, assignment];
    saveAssignments(updatedAssignments);
    setSelectedMovie("");
    setSelectedQuiz("");

    toast({
      title: "Success",
      description: "Quiz assigned to movie successfully!",
    });
  };

  const handleRemoveAssignment = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to remove this quiz assignment?');
    if (!confirmed) return;

    const updatedAssignments = assignments.filter(a => a.id !== id);
    saveAssignments(updatedAssignments);
    
    toast({
      title: "Success",
      description: "Quiz assignment removed successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-white">Quiz Assignment to Movies</div>

      {/* Assignment Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Assign Quiz to Movie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">Select Movie</Label>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              >
                <option value="">Choose Movie...</option>
                {movies.map((movie) => (
                  <option key={movie.movie_id} value={movie.movie_id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-gray-300">Select Quiz</Label>
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              >
                <option value="">Choose Quiz...</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title} ({quiz.questions.length} questions)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-gray-300">Resolution</Label>
              <select
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded"
              >
                {resolutions.map((res) => (
                  <option key={res} value={res}>{res}</option>
                ))}
              </select>
            </div>
          </div>
          <Button 
            onClick={handleAssignQuiz} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!selectedMovie || !selectedQuiz}
          >
            Assign Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Current Assignments ({assignments.length})</h4>
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{assignment.movie_title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {assignment.quiz_title}
                    </Badge>
                    <Badge className="text-xs bg-blue-600">
                      {assignment.resolution}
                    </Badge>
                    <Badge className="text-xs bg-green-600">
                      {assignment.questions_count} Questions
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveAssignment(assignment.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {assignments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No quiz assignments found.</p>
            <p className="text-sm">Assign quizzes to movie download buttons above.</p>
          </div>
        )}

        {quizzes.length === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mt-4">
            <p className="text-yellow-400 text-sm">
              <strong>Note:</strong> No quizzes available. Create quizzes in the Quiz Management tab first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAssignment;
