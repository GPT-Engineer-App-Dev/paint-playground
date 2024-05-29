import React, { useState } from 'react';
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const toast = useToast();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    addEvent.mutate(newEvent, {
      onSuccess: () => {
        toast({ title: 'Event added.', status: 'success', duration: 2000, isClosable: true });
        setNewEvent({ name: '', date: '', description: '' });
      },
      onError: () => {
        toast({ title: 'Error adding event.', status: 'error', duration: 2000, isClosable: true });
      },
    });
  };

  const handleUpdateEvent = (event) => {
    updateEvent.mutate(event, {
      onSuccess: () => {
        toast({ title: 'Event updated.', status: 'success', duration: 2000, isClosable: true });
        setEditingEvent(null);
      },
      onError: () => {
        toast({ title: 'Error updating event.', status: 'error', duration: 2000, isClosable: true });
      },
    });
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id, {
      onSuccess: () => {
        toast({ title: 'Event deleted.', status: 'success', duration: 2000, isClosable: true });
      },
      onError: () => {
        toast({ title: 'Error deleting event.', status: 'error', duration: 2000, isClosable: true });
      },
    });
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (isError) return <Box>Error loading events.</Box>;

  return (
    <Container maxW="container.xl" p={4}>
      <Heading mb={4}>Events</Heading>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={newEvent.name} onChange={handleInputChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input name="date" type="date" value={newEvent.date} onChange={handleInputChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input name="description" value={newEvent.description} onChange={handleInputChange} />
        </FormControl>
        <Button onClick={handleAddEvent} colorScheme="blue">Add Event</Button>
      </VStack>
      <Table variant="simple" mt={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event) => (
            <Tr key={event.id}>
              <Td>{event.name}</Td>
              <Td>{event.date}</Td>
              <Td>{event.description}</Td>
              <Td>
                <Button size="sm" onClick={() => setEditingEvent(event)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {editingEvent && (
        <VStack spacing={4} align="stretch" mt={8}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input name="date" type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input name="description" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
          </FormControl>
          <Button onClick={() => handleUpdateEvent(editingEvent)} colorScheme="blue">Update Event</Button>
        </VStack>
      )}
    </Container>
  );
};

export default Events;