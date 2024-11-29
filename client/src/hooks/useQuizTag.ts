/* eslint-disable no-console */
// REMOVE LATER - console for debug
import { useState, useEffect } from 'react';
import { Question, Tag } from '../types';
import { getQuestionById, updateQuestionTags } from '../services/questionService';
import useUserContext from './useUserContext';

const useQuizTag = (questionId: string) => {
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);

  // Fetch question data 
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionData = await getQuestionById(questionId, user.username);
        setQuestion(questionData);
      } catch (err) {
        setError('Failed to load question data');
        console.error('Error loading question:', err);
      }
    };

    fetchQuestion();
  }, [questionId, user.username]);

  const addQuizTag = async () => {
    if (!question) {
      setError('Question data not available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if QUIZ tag already applied
      const hasQuizTag = question.tags.some(tag => tag.name === 'QUIZ');
      if (hasQuizTag) {
        return;
      }

      // Create new tags with QUIZ tag
      const newTags: Tag[] = [
        ...question.tags,
        {
          name: 'QUIZ',
          description: 'Question marked as quiz material.',
        },
      ];

      // Update the question with new tags
      const updatedQuestion = await updateQuestionTags(questionId, newTags);
      setQuestion(updatedQuestion);

    } catch (err) {
      setError('Failed to add QUIZ tag');
      console.error('Error adding QUIZ tag:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addQuizTag,
    isLoading,
    error,
    question
  };
};

export default useQuizTag;