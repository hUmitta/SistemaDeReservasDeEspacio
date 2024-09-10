import React, { useState } from 'react';
import { Container, Grid, Header, Form, Button } from 'semantic-ui-react';

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
            <Button type="submit">Enviar</Button>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default CommentSection;