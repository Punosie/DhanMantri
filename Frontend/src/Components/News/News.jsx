import { Box, Card, Heading, Text, Stack } from "@chakra-ui/react";
import useFinhubNews from "../../Utils/news"; // Import the custom hook

const NewsCard = ({ article }) => {
  return (
    <>
        <Card.Root size="10px">
        <a href={article.url} target="_blank" >
        <Card.Header>
          <Heading size="md" p="2">{article.headline}</Heading>
        </Card.Header>
        <Card.Body color="fg.muted" p="2">
            {article.summary}
        </Card.Body>
        </a>
        </Card.Root>
    </>
  );
};

const News = () => {
  const { news, loading, error } = useFinhubNews(' ');

  return (
    <Box mt="4" p="4" >
      {loading && <Text>Loading news...</Text>}
      {error && <Text color="red.500">Error: {error.message}</Text>}
      {!loading && !error && (
        <Stack spacing={4}>
          {/* Heading */}
          <Heading fontSize="2xl" fontWeight="bold" color="gray.200">
            Latest News
          </Heading>

          {/* Iterate through the news items with dividers between them */}
          <Box overflowY="auto" maxH="45vh">
            {news.map((article, index) => (
              <Box key={index} mb="2" px="4" py="2">
                <NewsCard article={article} />
              </Box>
            ))}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default News;
