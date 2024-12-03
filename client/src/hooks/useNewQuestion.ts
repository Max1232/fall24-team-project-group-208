import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateHyperlink } from '../tool';
import { addQuestion } from '../services/questionService';
import useUserContext from './useUserContext';
import { Question } from '../types';

const useNewQuestion = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<Map<string, string>>(new Map());
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [titleErr, setTitleErr] = useState('');
  const [textErr, setTextErr] = useState('');
  const [tagErr, setTagErr] = useState('');

  const displayError = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    let errorMessage = '';

    if (!title) {
      errorMessage = 'Title cannot be empty';
      setTitleErr(errorMessage);
      isValid = false;
    } else if (title.length > 100) {
      errorMessage = 'Title cannot be more than 100 characters';
      setTitleErr(errorMessage);
      isValid = false;
    } else {
      setTitleErr('');
    }

    if (!text) {
      errorMessage = 'Question text cannot be empty';
      setTextErr(errorMessage);
      isValid = false;
    } else if (!validateHyperlink(text)) {
      errorMessage = 'Invalid hyperlink format';
      setTextErr(errorMessage);
      isValid = false;
    } else {
      setTextErr('');
    }

    if (tags.size === 0) {
      errorMessage = 'Should have at least 1 tag';
      setTagErr(errorMessage);
      isValid = false;
    } else if (tags.size > 5) {
      errorMessage = 'Cannot have more than 5 tags';
      setTagErr(errorMessage);
      isValid = false;
    } else {
      for (const tagName of tags.keys()) {
        if (tagName.length > 20) {
          errorMessage = 'New tag length cannot be more than 20';
          setTagErr(errorMessage);
          isValid = false;
          break;
        }
      }
      if (isValid) setTagErr('');
    }

    if (!isValid) {
      displayError(errorMessage);
    }

    return isValid;
  };

  const postQuestion = async (): Promise<boolean> => {
    if (!validateForm()) return false;

    const tagsArray = Array.from(tags.entries()).map(([name, description]) => ({
      name,
      description,
    }));

    const question: Question = {
      title,
      text,
      tags: tagsArray,
      askedBy: user.username,
      askDateTime: new Date(),
      answers: [],
      upVotes: [],
      downVotes: [],
      views: [],
      comments: [],
    };

    try {
      const res = await addQuestion(question);
      if (res && res._id) {
        navigate('/home');
        return true; // Indicate success
      }
      displayError('Failed to post question. Please try again.');
      return false;
    } catch (error) {
      displayError('An error occurred while posting the question.');
      return false;
    }
  };

  return {
    title,
    setTitle,
    text,
    setText,
    tags,
    setTags,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
    showAlert,
    setShowAlert,
    alertMessage,
  };
};

export default useNewQuestion;
