/* eslint-disable no-console */
// REMOVE LATER - console for debug
import { useState } from 'react';
import { Question, Tag } from '../types';
import { updateQuestionTags } from '../services/questionService';

const useQuizTag = (questionId: string, currentQuestion: Question) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectAnswerModalOpen, setSelectAnswerModalOpen] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<string | null>(null);

  const addQuizTag = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if QUIZ tag already applied
      const hasQuizTag = currentQuestion.tags.some(tag => tag.name === 'quizQuestions');
      if (hasQuizTag) {
        return;
      }

      setSelectAnswerModalOpen(true);
    } catch (err) {
      setError('Failed to add QUIZ tag');
      console.error('Error adding QUIZ tag:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCorrectAnswerSelect = async (index: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedAnswerIndex(index);

      // Add QUIZ tag and update correct answer index
      const newTags: Tag[] = [
        ...currentQuestion.tags,
        {
          name: 'quizQuestions',
          description: 'Question marked as quiz material',
        },
      ];

      await updateQuestionTags(questionId, newTags, index);
      setSelectAnswerModalOpen(false);
      setSelectedAnswerIndex(null);
    } catch (err) {
      setError('Failed to update question');
      console.error('Error updating question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addQuizTag,
    isLoading,
    error,
    selectAnswerModalOpen,
    setSelectAnswerModalOpen,
    handleCorrectAnswerSelect,
    selectedAnswerIndex,
  };
};

export default useQuizTag;
