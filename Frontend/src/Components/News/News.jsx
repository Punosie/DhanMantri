import { Box, Card, Heading, Text, Stack } from "@chakra-ui/react";
import useFinhubNews, { newsEnabled } from "../../Utils/news"; // Import the custom hook

const NewsCard = ({ article }) => {
  return (
    <Card.Root size="sm">
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <Card.Header>
          <Heading size="md" p="2">{article.headline}</Heading>
        </Card.Header>
        <Card.Body color="fg.muted" p="2">
          {article.summary}
        </Card.Body>
      </a>
    </Card.Root>
  );
};

const News = () => {
  const { news, loading, error } = useFinhubNews();

  if (!newsEnabled) return null;

  return (
    <Box as="section" mt="4" p="4" aria-label="Latest market news" w="100%">
      <Stack gap={4}>
        <Heading as="h2" fontSize="2xl" fontWeight="bold" color="gray.200">
          Latest News
        </Heading>
        {loading && <Text>Loading news...</Text>}
        {error && <Text color="red.500">Could not load news right now.</Text>}
        {!loading && !error && (
          <Box overflowY="auto" maxH="45vh">
            {news.map((article) => (
              <Box key={article.id ?? article.url} mb="2" px="4" py="2">
                <NewsCard article={article} />
              </Box>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default News;
