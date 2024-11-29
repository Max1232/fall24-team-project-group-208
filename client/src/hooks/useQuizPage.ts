/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestionsByTagFilter } from '../services/questionService';
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
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickQuestion = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByTagFilter('newest', 'quizQuestions');
        console.log(res);
        setQlist(res || []);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    };

    fetchData();
  }, []);

  return { qlist, clickQuestion };
};

export default useQuizPage;
