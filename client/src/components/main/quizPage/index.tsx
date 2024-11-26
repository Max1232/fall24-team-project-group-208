import React from 'react';
import './index.css';
import QuestionHeader from '../questionPage/header';
import QuestionView from '../questionPage/question';
import useQuestionPage from '../../../hooks/useQuestionPage';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  const filteredQlist = qlist.filter(
    q => q.tags.filter(t => t.name === 'quizQuestion').length === 0,
  );

  return (
    <>
      <QuestionHeader
        titleText={titleText}
        qcnt={filteredQlist.length}
        setQuestionOrder={setQuestionOrder}
      />
      <div id='question_list' className='question_list'>
        {filteredQlist.map((q, idx) => (
          <QuestionView q={q} key={idx} />
        ))}
      </div>
      {titleText === 'Search Results' && !filteredQlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
