import React, { useState } from 'react';
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const toast = useToast();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    addEvent.mutate(newEvent, {
      onSuccess: () => {
        toast({ title: 'Event added.', status: 'success', duration: 2000, isClosable: true });
        setNewEvent({ name: '', date: '', description: '' });
        onAddClose();
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
        onEditClose();
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
      <Button onClick={onAddOpen} colorScheme="blue">Add Event</Button>
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
                <Button size="sm" onClick={() => { setEditingEvent(event); onEditOpen(); }}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddEvent}>Add Event</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name="name" value={editingEvent?.name || ''} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input name="date" type="date" value={editingEvent?.date || ''} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input name="description" value={editingEvent?.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => { handleUpdateEvent(editingEvent); onEditClose(); }}>Update Event</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Events;