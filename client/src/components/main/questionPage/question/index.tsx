import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Visibility, CheckCircle } from '@mui/icons-material';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';
import VoteComponent from '../../voteComponent';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <Card
      variant='outlined'
      sx={{
        borderColor: 'primary.main',
        borderRadius: 1,
        mb: 2,
        position: 'relative',
        padding: 2,
        width: '95%',
        cursor: 'pointer',
      }}
      onClick={() => {
        if (q._id) {
          handleAnswer(q._id);
        }
      }}>
      <CardContent>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box display='flex' alignItems='center'>
            <Box sx={{pr: 4}}>
              <VoteComponent question={q} />
            </Box>
            <Box className='postStats' mr={2} mt={1} alignContent='center'>
              <Typography fontWeight={600}>{q.upVotes.length} votes</Typography>
              <Typography>
                <CheckCircle sx={{ verticalAlign: 'middle', mr: '3px' }} />
                {q.answers.length || 0} answers
              </Typography>
              <Typography>
                <Visibility sx={{ verticalAlign: 'middle' }} /> {q.views.length} views
              </Typography>
            </Box>
            <Box className='question_mid'>
              <Typography variant='body1' className='postTitle'>
                {q.title}
              </Typography>
              <Box className='question_tags'>
                {q.tags.map((tag, idx) => (
                  <Button
                    key={idx}
                    variant='outlined'
                    size='small'
                    sx={{ mr: 1, mb: 1 }}
                    onClick={e => {
                      e.stopPropagation();
                      clickTag(tag.name);
                    }}>
                    {tag.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            className='lastActivity'
            sx={{
              textAlign: 'right',
            }}>
            <Typography className='question_author'>{q.askedBy}</Typography>
            <Typography className='question_meta'>
              asked {getMetaData(new Date(q.askDateTime))}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionView;
