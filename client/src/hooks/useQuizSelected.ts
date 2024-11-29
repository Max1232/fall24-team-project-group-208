import { useEffect, useState } from 'react';
import { getQuestionsByTagFilter } from '../services/questionService';
import { Question, QuestionsWithTag, Tag } from '../types';

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
        const res = await getQuestionsByTagFilter('newest', t.name);
        setQuestionsWithTag({
          name: t.name,
          description: t.description,
          questions: res || [],
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
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
