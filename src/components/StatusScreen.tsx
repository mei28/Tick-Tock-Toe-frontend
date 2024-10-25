// src/components/StatusScreen.tsx
import React, { useState, useEffect } from 'react';
import { VStack, Text, Box, CircleProgress, HStack, Icon } from '@yamada-ui/react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useApi } from '../hooks/useApi';

const StatusScreen: React.FC = () => {
  const { request } = useApi();
  const [status, setStatus] = useState<'operational' | 'disruption' | 'loading'>('loading');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await request('/health', 'GET', null, false);
        setStatus(data.status === 'ok' ? 'operational' : 'disruption');
      } catch (error) {
        setStatus('disruption');
      }
    };
    fetchStatus();
  }, [request]);

  return (
    <VStack align="center" justify="center" h="100vh" bg="gray.50" gap={6} p={4} borderRadius="lg" boxShadow="lg">
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
          System Status
        </Text>
        {status === 'loading' ? (
          <CircleProgress isAnimation size="80px" color="teal.500" thickness="8px" trackColor="gray.200" />
        ) : (
          <HStack gap={2} mt={4} align="center">
            <Icon
              as={status === 'operational' ? FaCheckCircle : FaExclamationTriangle}
              boxSize={8}
              color={status === 'operational' ? 'green.500' : 'orange.400'}
              transition="color 0.2s"
            />
            <Text fontSize="lg" color={status === 'operational' ? 'gray.800' : 'red.600'} fontWeight="semibold">
              {status === 'operational' ? 'All Systems Operational' : 'Service Disruption'}
            </Text>
          </HStack>
        )}
      </Box>
    </VStack>
  );
};

export default StatusScreen;

