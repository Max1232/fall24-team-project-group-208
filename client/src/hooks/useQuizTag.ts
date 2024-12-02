import { useState } from 'react';
import { Question, Tag } from '../types';
import { updateQuestionTags } from '../services/questionService';

/**
 * Custom hook to manage quiz tags for a question.
 *
 * @param {string} questionId - The ID of the question to update.
 * @param {Question} currentQuestion - The current question object
 */
const useQuizTag = (questionId: string, currentQuestion: Question) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectAnswerModalOpen, setSelectAnswerModalOpen] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<string | null>(null);

  /**
   * Adds a QUIZ tag to the current question.
   * If the tag is already present, it does nothing.
   */
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
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the selection of the correct answer for the quiz.
   *
   * @param {string} index - The index of the selected correct answer.
   */
  const handleCorrectAnswerSelect = async (index: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedAnswerIndex(index);

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
