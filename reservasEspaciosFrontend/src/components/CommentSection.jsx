import React, { useState } from 'react';
import { Container, Grid, Header, Form } from 'semantic-ui-react';
import { Button as MUIButton } from '@mui/material'; // Import MUI Button

function CommentSection() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setComments([...comments, { text: newComment, id: Date.now() }]);
    setNewComment('');
  };

  return (
    <Container>
      <Grid columns={1} centered>
        <Grid.Column>
          <Header as="h2">Comentarios</Header>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              type="text"
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Escribe un comentario"
            />
            <MUIButton variant="contained" color="primary" type="submit"> 
              Enviar
            </MUIButton>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default CommentSection;