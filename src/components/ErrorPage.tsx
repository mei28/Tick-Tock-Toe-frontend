import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, Text, Image } from '@yamada-ui/react';

interface ErrorPageProps {
  code: number;
  message: string;
  imageSrc?: string; // 画像のパス
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, message, imageSrc }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // 5秒後にホームにリダイレクト
    }, 5000);

    return () => clearTimeout(timer); // クリーンアップ
  }, [navigate]);

  return (
    <VStack justify="center" align="center" h="100vh" spacing="6">
      {imageSrc && (
        <Image 
          src={imageSrc} 
          alt={`${code} error`} 
          boxSize={{ base: '50%', md: '70%', lg: '80%' }} // スクリーンサイズに応じた大きさ
          objectFit="contain" 
        />
      )}
      <Text fontSize="sm" color="gray.500" textAlign="center">
        Redirecting to the homepage in 5 seconds...
      </Text>
    </VStack>
  );
};

export default ErrorPage;

