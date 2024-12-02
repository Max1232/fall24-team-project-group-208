import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import useUserContext from './useUserContext';
import { Answer, OrderType, Question } from '../types';
import { getQuestionsByFilter } from '../services/questionService';

/**
 * Custom hook to manage the state and logic for the question page.
 * It handles fetching questions based on search parameters and updates the state accordingly.
 * It also sets up socket event listeners to handle real-time updates to questions and answers.
 */
const useQuestionPage = () => {
  const { socket } = useUserContext();
  const [searchParams] = useSearchParams();

  // Combine state updates into a single state object
  const [state, setState] = useState({
    titleText: 'All Questions',
    search: '',
    questionOrder: 'newest' as OrderType,
    qlist: [] as Question[],
  });

  // Memoize the fetch function
  const fetchQuestions = useCallback(async (order: OrderType, searchTerm: string) => {
    try {
      const res = await getQuestionsByFilter(order, searchTerm || '');
      setState(prev => ({ ...prev, qlist: res || [] }));
    } catch (error) {
      setState(prev => ({ ...prev, qlist: [] }));
    }
  }, []);

  // Single effect to handle URL params and trigger fetch
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const tagQuery = searchParams.get('tag');

    let newTitle = 'All Questions';
    let newSearch = '';

    if (searchQuery?.trim()) {
      newTitle = 'Search Results';
      newSearch = searchQuery.trim();
    } else if (tagQuery?.trim()) {
      newTitle = tagQuery.trim();
      newSearch = `[${tagQuery.trim()}]`;
    }

    setState(prev => ({
      ...prev,
      titleText: newTitle,
      search: newSearch,
    }));

    fetchQuestions(state.questionOrder, newSearch).then(() => {});
  }, [searchParams, state.questionOrder, fetchQuestions]);

  // Socket event handlers
  useEffect(() => {
    const handleQuestionUpdate = (question: Question) => {
      setState(prev => ({
        ...prev,
        qlist: prev.qlist.some(q => q._id === question._id)
          ? prev.qlist.map(q => (q._id === question._id ? question : q))
          : [question, ...prev.qlist],
      }));
    };

    const handleAnswerUpdate = ({ qid, answer }: { qid: string; answer: Answer }) => {
      setState(prev => ({
        ...prev,
        qlist: prev.qlist.map(q => (q._id === qid ? { ...q, answers: [...q.answers, answer] } : q)),
      }));
    };

    const handleViewsUpdate = (question: Question) => {
      setState(prev => ({
        ...prev,
        qlist: prev.qlist.map(q => (q._id === question._id ? question : q)),
      }));
    };

    socket.on('questionUpdate', handleQuestionUpdate);
    socket.on('answerUpdate', handleAnswerUpdate);
    socket.on('viewsUpdate', handleViewsUpdate);

    return () => {
      socket.off('questionUpdate', handleQuestionUpdate);
      socket.off('answerUpdate', handleAnswerUpdate);
      socket.off('viewsUpdate', handleViewsUpdate);
    };
  }, [socket]);

  const setQuestionOrder = useCallback((order: OrderType) => {
    setState(prev => ({ ...prev, questionOrder: order }));
  }, []);

  return {
    titleText: state.titleText,
    qlist: state.qlist,
    setQuestionOrder,
  };
};

export default useQuestionPage;
