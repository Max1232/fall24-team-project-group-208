import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestionsByTag } from '../services/questionService';
import { Question } from '../types';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns qlist - An array of questions filtered by tag retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useQuizPage = () => {
  const navigate = useNavigate();
  const [qlist, setQlist] = useState<Question[]>([]);

  /**
   * Function to navigate to the question page with the id of the selected question.
   *
   * @param question_id - The id of the question to navigate to.
   */
  const clickQuestion = (question_id: string) => {
    navigate(`/quiz/${question_id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByTag('newest', 'quizQuestions');
        setQlist(res || []);
      } catch (e) {
        throw new Error('Failed to fetch questions by tag');
      }
    };

    fetchData().then(() => {});
  }, []);

  return { qlist, clickQuestion };
};

export default useQuizPage;
