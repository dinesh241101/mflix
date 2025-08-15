
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

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
  const [quizzes] = useState([
    { id: '1', title: 'The Big Bang Theory Quiz', questions_count: 2 },
    { id: '2', title: 'General Movie Quiz', questions_count: 3 }
  ]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedResolution, setSelectedResolution] = useState("1080p");

  const resolutions = ["480p", "720p", "1080p", "4K"];

  useEffect(() => {
    loadMovies();
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

  const loadAssignments = () => {
    // Sample assignments for demo
    const sampleAssignments: QuizAssignment[] = [
      {
        id: '1',
        movie_id: '1',
        movie_title: 'The Big Bang Theory S01E01',
        quiz_id: '1',
        quiz_title: 'The Big Bang Theory Quiz',
        resolution: '1080p',
        questions_count: 2
      }
    ];
    setAssignments(sampleAssignments);
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

    if (!movie || !quiz) return;

    const assignment: QuizAssignment = {
      id: Date.now().toString(),
      movie_id: selectedMovie,
      movie_title: movie.title,
      quiz_id: selectedQuiz,
      quiz_title: quiz.title,
      resolution: selectedResolution,
      questions_count: quiz.questions_count
    };

    setAssignments([...assignments, assignment]);
    setSelectedMovie("");
    setSelectedQuiz("");

    toast({
      title: "Success",
      description: "Quiz assigned to movie successfully!",
    });
  };

  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
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
                    {quiz.title} ({quiz.questions_count} questions)
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
          <Button onClick={handleAssignQuiz} className="bg-blue-600 hover:bg-blue-700">
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
      </div>
    </div>
  );
};

export default QuizAssignment;
