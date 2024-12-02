import { useEffect, useState } from 'react';
import { getQuestionsByTag } from '../services/questionService';
import { QuestionsWithTag, Tag } from '../types';

/**
 * Custom hook to handle fetching questions by tag name.
 *
 * @param t - The tag object to fetch data for
 *
 * @returns questionsWithTag - The current tag details with associated questions.
 * @returns setQuestionsWithTag - Setter to manually update the state if needed.
 */
const useQuizSelected = (t: Tag) => {
  const [questionsWithTag, setQuestionsWithTag] = useState<QuestionsWithTag>({
    name: '',
    description: '',
    questions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByTag('newest', t.name);
        setQuestionsWithTag({
          name: t.name,
          description: t.description,
          questions: res || [],
        });
      } catch (e) {
        throw new Error('Failed to fetch questions by tag');
      }
    };
    fetchData();
  }, [t.name, t.description]);

  return {
    questionsWithTag,
    setQuestionsWithTag,
  };
};

export default useQuizSelected;
